/* Signal board - a small, dependency-free engine that turns IRT dispensing
   events and site supply events into per-patient flags, and shows which team
   and which system holds each piece of evidence today.
   Rule-based and illustrative: the weights are a starting rule, not a model.
   Used inline by the deck (deck/index.html) and by the standalone demo.
   All data is synthetic; see data/generate.py. */
(function (global) {
  'use strict';

  // ---------- scoring ----------
  const WINDOW_DAYS = 70;      // trailing window for signals (about 2 visits + slack)
  const OVERDUE_DAYS = 7;      // a visit this far past its window counts as missed
  const CRIT = 6, WARN = 3;

  // Where each piece of evidence lives today, and who reads it.
  const OWNERS = {
    drift:      { system: 'IRT visit schedule',            owner: 'IRT oversight; CRA at the next monitoring visit', reaches: 'Site-level off-schedule KRI, monthly' },
    missed:     { system: 'IRT visit schedule',            owner: 'IRT oversight; CRA at the next monitoring visit', reaches: 'Site-level missed-assessment KRI' },
    doseDown:   { system: 'IRT kit assignment',            owner: 'Site pharmacist (unblinded)',                     reaches: 'Nobody outside the pharmacy' },
    returned:   { system: 'IRT drug accountability',       owner: 'Site; IRT oversight report; CRA',                 reaches: 'Reconciliation only' },
    supplyHit:  { system: 'IRT inventory, reschedule',     owner: 'Supply planning',                                 reaches: 'A resupply ticket' },
    siteSupply: { system: 'IRT inventory, depot, courier', owner: 'Supply planning; depot',                          reaches: 'Stock risk report, never patient risk' }
  };

  const LENSES = {
    irt:    { drift: 1, missed: 1, doseDown: 1, returned: 1, supplyHit: 0, siteSupply: 0 },
    supply: { drift: 0, missed: 0, doseDown: 0, returned: 0, supplyHit: 1, siteSupply: 1 },
    joined: { drift: 1, missed: 1, doseDown: 1, returned: 1, supplyHit: 1, siteSupply: 1 }
  };

  function statusAt(p, T, meta) {
    if (p.randDay > T) return 'pending';
    if (p.dropDay != null && p.dropDay <= T) return 'dropped';
    if (p.randDay + meta.treatmentWeeks * 7 <= T) return 'completed';
    return 'active';
  }

  // Signals visible at day T using only events that had happened by T.
  function signalsAt(p, site, T, lensKey) {
    const L = LENSES[lensKey] || LENSES.joined;
    const out = [];
    const due = p.visits.filter(v => v.sched <= T);
    const occurred = due.filter(v => !v.missed && v.actual != null && v.actual <= T);
    const recentOcc = occurred.filter(v => v.actual >= T - WINDOW_DAYS);
    const last2 = occurred.slice(-2);

    // 1. visit drift: mean lateness of the last two dispensing visits
    if (L.drift && last2.length && last2[last2.length - 1].actual >= T - WINDOW_DAYS) {
      const mean = last2.reduce((a, v) => a + v.late, 0) / last2.length;
      let pts = 0;
      if (mean >= 8) pts = 3; else if (mean >= 5) pts = 2; else if (mean >= 3) pts = 1;
      const slope = last2.length === 2 && (last2[1].late - last2[0].late) >= 3 && last2[1].late >= 4;
      if (slope) pts += 1;
      if (pts) out.push({ key: 'drift', label: 'Visit drift', detail: 'last visits ' + mean.toFixed(1) + ' days late on average' + (slope ? ', and getting later' : ''), pts, src: 'IRT' });
    }
    // 2. missed or overdue visit
    if (L.missed) {
      const miss = due.some(v => v.sched >= T - WINDOW_DAYS && (v.missed || v.actual == null || v.actual > T) && (T - v.sched) > OVERDUE_DAYS);
      if (miss) out.push({ key: 'missed', label: 'Missed or overdue visit', detail: 'a dispensing visit is more than ' + OVERDUE_DAYS + ' days past its window', pts: 3, src: 'IRT' });
    }
    // 3. dose reduction (kit type changed to a lower dose)
    if (L.doseDown && recentOcc.some(v => v.doseDown)) {
      out.push({ key: 'doseDown', label: 'Dose reduced', detail: 'kit type stepped down at a recent visit', pts: 2, src: 'IRT' });
    }
    // 4. returned units (compliance falling)
    if (L.returned && occurred.length) {
      const r = occurred[occurred.length - 1].returned;
      if (r >= 0.35) out.push({ key: 'returned', label: 'Units returned', detail: Math.round(r * 100) + '% of the last kit came back unused', pts: 3, src: 'IRT' });
      else if (r >= 0.2) out.push({ key: 'returned', label: 'Units returned', detail: Math.round(r * 100) + '% of the last kit came back unused', pts: 2, src: 'IRT' });
    }
    // 5. this patient's visit was pushed by a site stockout
    if (L.supplyHit && due.some(v => v.supplyHit && v.sched >= T - WINDOW_DAYS)) {
      out.push({ key: 'supplyHit', label: 'Visit pushed by stockout', detail: 'no kit available on the scheduled day, visit rescheduled', pts: 2, src: 'Supply' });
    }
    // 6. site is running thin right now
    if (L.siteSupply && site) {
      const wk = Math.min(site.supply.length, Math.max(1, Math.floor(T / 7) + 1));
      const row = site.supply[wk - 1];
      if (row && (row.stockout || row.dos < 12)) {
        out.push({ key: 'siteSupply', label: 'Site supply thin', detail: row.dos.toFixed(0) + ' days of supply on hand' + (row.stockout ? ', stockout this week' : ''), pts: 1, src: 'Supply' });
      }
    }
    const score = out.reduce((a, s) => a + s.pts, 0);
    const level = score >= CRIT ? 'crit' : score >= WARN ? 'warn' : 'ok';
    return { signals: out, score, level };
  }

  // ---------- model ----------
  function Model(data) {
    this.data = data;
    this.meta = data.meta;
    this.sites = data.sites;
    this.siteById = {};
    data.sites.forEach(s => { this.siteById[s.id] = s; });
    this.patients = data.patients;
    this.cache = {};
  }

  // Weekly risk trajectory per patient for a lens (cached).
  Model.prototype.trajectory = function (lens) {
    if (this.cache[lens]) return this.cache[lens];
    const weeks = this.meta.studyWeeks;
    const traj = {};
    this.patients.forEach(p => {
      const site = this.siteById[p.site];
      const arr = new Array(weeks + 1).fill(null);
      for (let w = 1; w <= weeks; w++) {
        const T = w * 7;
        if (p.randDay > T) continue;
        if (p.dropDay != null && p.dropDay <= T) break;
        if (p.randDay + this.meta.treatmentWeeks * 7 <= T) break;
        arr[w] = signalsAt(p, site, T, lens).level;
      }
      traj[p.id] = arr;
    });
    this.cache[lens] = traj;
    return traj;
  };

  Model.prototype.firstFlagWeek = function (p, lens, level) {
    const arr = this.trajectory(lens)[p.id];
    for (let w = 1; w < arr.length; w++) {
      if (arr[w] === 'crit' || (level === 'warn' && arr[w] === 'warn')) return w;
    }
    return null;
  };

  Model.prototype.snapshot = function (week, lens) {
    const T = week * 7;
    const rows = [];
    const counts = { pending: 0, active: 0, dropped: 0, completed: 0, crit: 0, warn: 0, ok: 0 };
    const bySite = {};
    this.sites.forEach(s => { bySite[s.id] = { site: s, active: 0, crit: 0, warn: 0, dropped: 0, patients: [] }; });
    this.patients.forEach(p => {
      const st = statusAt(p, T, this.meta);
      counts[st]++;
      const b = bySite[p.site];
      if (st === 'dropped') b.dropped++;
      if (st !== 'active') return;
      const site = this.siteById[p.site];
      const r = signalsAt(p, site, T, lens);
      counts[r.level]++;
      b.active++; if (r.level === 'crit') b.crit++; if (r.level === 'warn') b.warn++;
      const row = { p, site, status: st, score: r.score, level: r.level, signals: r.signals };
      rows.push(row); b.patients.push(row);
    });
    // lead time and hit rate, using only outcomes known by T
    const leads = [];
    let flaggedKnown = 0, flaggedDropped = 0, dropsKnown = 0, dropsFlagged = 0;
    this.patients.forEach(p => {
      const st = statusAt(p, T, this.meta);
      if (st !== 'dropped' && st !== 'completed') return;
      const fw = this.firstFlagWeek(p, lens, 'crit');
      if (st === 'dropped') {
        dropsKnown++;
        if (fw != null && fw * 7 <= p.dropDay) { dropsFlagged++; leads.push((p.dropDay - fw * 7) / 7); }
      }
      if (fw != null) { flaggedKnown++; if (st === 'dropped') flaggedDropped++; }
    });
    leads.sort((a, b) => a - b);
    const median = leads.length ? (leads.length % 2 ? leads[(leads.length - 1) / 2] : (leads[leads.length / 2 - 1] + leads[leads.length / 2]) / 2) : null;
    return {
      T, week, lens, rows, counts, bySite,
      lead: { median, n: leads.length },
      precision: flaggedKnown ? flaggedDropped / flaggedKnown : null,
      recall: dropsKnown ? dropsFlagged / dropsKnown : null,
      dropsKnown
    };
  };

  // Four instructive patients for the opening vote, chosen deterministically.
  Model.prototype.pickExemplars = function () {
    const meta = this.meta;
    const P = this.patients;
    const clean = p => !p.dropDay && p.visits.length === 12 && !p.visits.some(v => v.missed || v.doseDown);
    const lateN = p => p.visits.filter(v => v.late != null && v.late >= 5).length;
    const steady = P.find(p => clean(p) && p.visits.every(v => Math.abs(v.late) <= 3 && !v.supplyHit && v.returned < 0.15));
    const ramp = P.find(p => p.dropDay && !p.abrupt && p.visits.length >= 8 && p.visits.length <= 10 && p.visits[p.visits.length - 1].missed && p.visits.slice(-4, -1).every(v => v.late != null && v.late >= 4));
    const roughPatch = P.find(p => clean(p) && !p.visits.some(v => v.supplyHit) && lateN(p) >= 2 && lateN(p) <= 3 && p.visits.some(v => v.returned >= 0.2) && p.visits.slice(-3).every(v => v.late <= 3));
    const supplyHit = P.find(p => clean(p) && p.visits.some(v => v.supplyHit) && lateN(p) <= 2);
    return [steady, ramp, roughPatch, supplyHit].filter(Boolean).map((p, i) => ({ p, tag: 'ABCD'[i] }));
  };

  // ---------- rendering helpers ----------
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) { if (k === 'text') n.textContent = attrs[k]; else if (k === 'html') n.innerHTML = attrs[k]; else n.setAttribute(k, attrs[k]); }
    (children || []).forEach(c => c && n.appendChild(c));
    return n;
  }
  function svg(tag, attrs) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function fmtPct(x) { return x == null ? 'n/a' : Math.round(x * 100) + '%'; }

  // Visit timeline: hollow ticks at the scheduled day, filled dots at the actual day.
  // Days are relative to randomization. Option T truncates to what is known at day T.
  function visitTimeline(p, opts) {
    opts = opts || {};
    const W = opts.width || 520, H = opts.height || 64, padL = 26, padR = 14;
    const T = opts.T != null ? opts.T : Infinity;
    const treatDays = (opts.treatmentWeeks || 48) * 7;
    const s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'rd-tl', preserveAspectRatio: 'none' });
    const x = d => padL + (d / treatDays) * (W - padL - padR);
    const yBase = H - 20;
    s.appendChild(svg('line', { x1: padL, x2: W - padR, y1: yBase, y2: yBase, class: 'rd-axis' }));
    for (let m = 0; m <= 12; m += 3) {
      const xx = x(m * 28);
      s.appendChild(svg('line', { x1: xx, x2: xx, y1: yBase, y2: yBase + 5, class: 'rd-axis' }));
      const t = svg('text', { x: xx, y: H - 4, class: 'rd-tick' }); t.textContent = 'M' + m; s.appendChild(t);
    }
    p.visits.forEach(v => {
      const relS = v.sched - p.randDay;
      if (v.sched > T) return;
      s.appendChild(svg('line', { x1: x(relS), x2: x(relS), y1: yBase - 14, y2: yBase, class: 'rd-sched' }));
      const occurred = !v.missed && v.actual != null && v.actual <= T;
      if (occurred) {
        const relA = v.actual - p.randDay;
        const cls = v.late >= 9 ? 'crit' : v.late >= 4 ? 'warn' : 'ok';
        if (v.late >= 1) s.appendChild(svg('line', { x1: x(relS), x2: x(relA), y1: yBase - 7, y2: yBase - 7, class: 'rd-lag ' + cls }));
        const c = svg('circle', { cx: x(relA), cy: yBase - 7, r: v.supplyHit ? 6 : 5, class: 'rd-dot ' + cls + (v.supplyHit ? ' hit' : '') });
        s.appendChild(c);
        if (v.doseDown) { const t = svg('text', { x: x(relA), y: yBase - 18, class: 'rd-mark' }); t.textContent = '▼'; s.appendChild(t); }
        if (v.returned >= 0.25) { const t = svg('text', { x: x(relA), y: yBase - 18 - (v.doseDown ? 11 : 0), class: 'rd-mark ret' }); t.textContent = '↩'; s.appendChild(t); }
      } else if ((T - v.sched) > OVERDUE_DAYS) {
        const xx = x(relS + 4);
        s.appendChild(svg('path', { d: 'M' + (xx - 5) + ' ' + (yBase - 12) + 'l10 10M' + (xx + 5) + ' ' + (yBase - 12) + 'l-10 10', class: 'rd-miss' }));
      }
    });
    if (p.dropDay != null && p.dropDay <= T && opts.showOutcome) {
      const xx = x(p.dropDay - p.randDay);
      s.appendChild(svg('line', { x1: xx, x2: xx, y1: 6, y2: yBase, class: 'rd-drop' }));
      const t = svg('text', { x: xx + 4, y: 14, class: 'rd-droplbl' }); t.textContent = 'withdrew'; s.appendChild(t);
    }
    return s;
  }

  function supplyStrip(site, opts) {
    opts = opts || {};
    const W = opts.width || 520, H = opts.height || 56, padL = 26, padR = 14;
    const weeks = site.supply;
    const T = opts.T != null ? opts.T : Infinity;
    const s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'rd-sup', preserveAspectRatio: 'none' });
    const x = w => padL + ((w - 1) / (weeks.length - 1)) * (W - padL - padR);
    const y = d => 8 + (1 - Math.min(d, 60) / 60) * (H - 26);
    s.appendChild(svg('line', { x1: padL, x2: W - padR, y1: y(12), y2: y(12), class: 'rd-thresh' }));
    let d = '';
    weeks.forEach((r, i) => { if (r.w * 7 > T + 6) return; d += (i ? 'L' : 'M') + x(r.w).toFixed(1) + ' ' + y(r.dos).toFixed(1); });
    s.appendChild(svg('path', { d, class: 'rd-dos' }));
    weeks.forEach(r => {
      if (r.w * 7 > T + 6) return;
      if (r.stockout) s.appendChild(svg('rect', { x: x(r.w) - 2, y: H - 16, width: 4, height: 8, class: 'rd-so' }));
      if (r.excursion) s.appendChild(svg('circle', { cx: x(r.w), cy: H - 12, r: 2.2, class: 'rd-exc' }));
    });
    const t = svg('text', { x: padL, y: H - 2, class: 'rd-tick', 'text-anchor': 'start' }); t.textContent = 'days of supply · stockout marks · excursions'; s.appendChild(t);
    return s;
  }

  // ---------- the interactive board ----------
  function Radar(container, data, opts) {
    opts = opts || {};
    this.root = container;
    this.model = new Model(data);
    this.week = opts.week || 30;
    this.lens = opts.lens || 'joined';
    this.selectedSite = null;
    this.selectedPatient = null;
    this.compact = !!opts.compact;
    this.build();
    this.render();
  }

  Radar.prototype.build = function () {
    const r = this.root; r.classList.add('rd'); r.innerHTML = '';
    // toolbar
    this.tb = el('div', { class: 'rd-tb' });
    const wkBox = el('div', { class: 'rd-wk' });
    this.btnBack = el('button', { type: 'button', class: 'rd-btn', text: '− 4 wk' });
    this.wkLbl = el('span', { class: 'rd-wklbl' });
    this.btnFwd = el('button', { type: 'button', class: 'rd-btn', text: '+ 4 wk' });
    this.btnPlay = el('button', { type: 'button', class: 'rd-btn rd-play', text: 'Advance to week 48' });
    wkBox.append(this.btnBack, this.wkLbl, this.btnFwd, this.btnPlay);
    const lensBox = el('div', { class: 'rd-lens' }, [el('span', { class: 'rd-lenslbl', text: 'Lens' })]);
    this.lensBtns = {};
    [['irt', 'Dispensing events'], ['supply', 'Supply events'], ['joined', 'Joined']].forEach(([k, lbl]) => {
      const b = el('button', { type: 'button', class: 'rd-btn rd-lb', text: lbl, 'data-lens': k });
      b.addEventListener('click', e => { e.stopPropagation(); this.lens = k; this.render(); });
      this.lensBtns[k] = b; lensBox.appendChild(b);
    });
    this.tb.append(wkBox, lensBox);
    // KPI row
    this.kpis = el('div', { class: 'rd-kpis' });
    // panels
    this.grid = el('div', { class: 'rd-grid' });
    this.list = el('div', { class: 'rd-list' });
    this.detail = el('div', { class: 'rd-detail' });
    const body = el('div', { class: 'rd-body' }, [this.grid, this.list, this.detail]);
    r.append(this.tb, this.kpis, body);
    this.btnBack.addEventListener('click', e => { e.stopPropagation(); this.setWeek(this.week - 4); });
    this.btnFwd.addEventListener('click', e => { e.stopPropagation(); this.setWeek(this.week + 4); });
    this.btnPlay.addEventListener('click', e => { e.stopPropagation(); this.play(48); });
    r.addEventListener('keydown', e => { e.stopPropagation(); });
  };

  Radar.prototype.setWeek = function (w) {
    this.week = Math.max(8, Math.min(this.model.meta.studyWeeks - 4, w));
    this.render();
  };

  Radar.prototype.play = function (to) {
    if (this.timer) { clearInterval(this.timer); this.timer = null; this.btnPlay.textContent = 'Advance to week ' + to; return; }
    if (this.week >= to) { this.setWeek(8); }
    this.btnPlay.textContent = 'Pause';
    this.timer = setInterval(() => {
      if (this.week >= to) { clearInterval(this.timer); this.timer = null; this.btnPlay.textContent = 'Advance to week ' + to; return; }
      this.setWeek(this.week + 1);
    }, 420);
  };

  Radar.prototype.render = function () {
    const snap = this.model.snapshot(this.week, this.lens);
    this.snap = snap;
    this.wkLbl.textContent = 'Study week ' + this.week;
    for (const k in this.lensBtns) this.lensBtns[k].classList.toggle('on', k === this.lens);
    // KPIs
    const c = snap.counts;
    const wkIdx = Math.min(this.model.sites[0].supply.length, Math.max(1, Math.floor(snap.T / 7) + 1)) - 1;
    const sitesThin = this.model.sites.filter(s => { const r = s.supply[wkIdx]; return r && (r.stockout || r.dos < 12); }).length;
    const flagged = snap.rows.filter(r => r.level !== 'ok');
    const withSupply = flagged.filter(r => r.signals.some(x => x.src === 'Supply')).length;
    const k = [
      ['Active', c.active, ''],
      ['Withdrawn so far', c.dropped, ''],
      ['Flagged critical', c.crit, 'crit'],
      ['Flagged watch', c.warn, 'warn'],
      ['Sites under supply pressure', sitesThin, 'sup'],
      ['Flags with a supply cause', flagged.length ? withSupply + ' of ' + flagged.length : '0', 'sup']
    ];
    this.kpis.innerHTML = '';
    k.forEach(([lbl, val, cls]) => {
      this.kpis.appendChild(el('div', { class: 'rd-kpi ' + cls }, [el('div', { class: 'rd-kv', text: String(val) }), el('div', { class: 'rd-kl', text: lbl })]));
    });
    // site grid
    this.grid.innerHTML = '';
    this.grid.appendChild(el('div', { class: 'rd-ph', text: 'Sites · click one' }));
    const tiles = el('div', { class: 'rd-tiles' });
    this.model.sites.forEach(s => {
      const b = snap.bySite[s.id];
      const share = b.active ? b.crit / b.active : 0;
      const lvl = b.crit >= 3 || share >= 0.25 ? 'crit' : (b.crit >= 1 || b.warn >= 3) ? 'warn' : 'ok';
      const t = el('button', { type: 'button', class: 'rd-tile ' + lvl + (this.selectedSite === s.id ? ' sel' : ''), title: s.name + ' · ' + s.region });
      t.append(el('div', { class: 'rd-tid', text: String(s.id) }), el('div', { class: 'rd-tsub', text: s.country + ' · ' + b.active + ' active' }), el('div', { class: 'rd-tcrit', text: b.crit ? b.crit + ' critical' : (b.warn ? b.warn + ' watch' : 'clear') }));
      t.addEventListener('click', e => { e.stopPropagation(); this.selectedSite = (this.selectedSite === s.id ? null : s.id); this.selectedPatient = null; this.render(); });
      tiles.appendChild(t);
    });
    this.grid.appendChild(tiles);
    // patient list
    this.list.innerHTML = '';
    let rows = snap.rows.filter(r => !this.selectedSite || r.site.id === this.selectedSite);
    rows.sort((a, b) => b.score - a.score || a.p.id.localeCompare(b.p.id));
    const title = this.selectedSite ? this.model.siteById[this.selectedSite].name + ' · ' + rows.length + ' active' : 'All sites · top risk';
    this.list.appendChild(el('div', { class: 'rd-ph', text: title }));
    const ul = el('div', { class: 'rd-rows' });
    rows.slice(0, this.selectedSite ? 40 : 14).forEach(r => {
      const li = el('button', { type: 'button', class: 'rd-row ' + r.level + (this.selectedPatient === r.p.id ? ' sel' : '') });
      li.append(el('span', { class: 'rd-pid', text: r.p.id }), el('span', { class: 'rd-psite', text: 'S' + r.site.id }),
        el('span', { class: 'rd-plvl', text: r.level === 'crit' ? 'Critical' : r.level === 'warn' ? 'Watch' : 'Clear' }),
        el('span', { class: 'rd-pscore', text: r.score ? r.score + ' pts' : '' }));
      const chips = el('span', { class: 'rd-chips' });
      r.signals.forEach(s => chips.appendChild(el('i', { class: 'rd-chip ' + (s.src === 'Supply' ? 'sup' : 'irt'), text: s.label })));
      li.appendChild(chips);
      li.addEventListener('click', e => { e.stopPropagation(); this.selectedPatient = r.p.id; this.render(); });
      ul.appendChild(li);
    });
    if (!rows.length) ul.appendChild(el('div', { class: 'rd-empty', text: 'No active patients at this site yet.' }));
    this.list.appendChild(ul);
    // detail
    this.detail.innerHTML = '';
    let sel = rows.find(r => r.p.id === this.selectedPatient) || rows[0];
    if (!sel) { this.detail.appendChild(el('div', { class: 'rd-ph', text: 'Patient detail' })); return; }
    this.selectedPatient = sel.p.id;
    const head = el('div', { class: 'rd-ph' });
    head.append(el('span', { text: sel.p.id + ' · ' + sel.site.name + ' · ' + sel.site.region }), el('span', { class: 'rd-lvl ' + sel.level, text: (sel.level === 'crit' ? 'Critical' : sel.level === 'warn' ? 'Watch' : 'Clear') + ' · ' + sel.score + ' pts, rule-based' }));
    this.detail.appendChild(head);
    this.detail.appendChild(el('div', { class: 'rd-sub', text: 'Dispensing visits, as known at week ' + this.week + '. Hollow tick = scheduled, dot = dispensed, gap = days late, × = missed, ▼ dose down, ↩ units returned, ringed dot = pushed by a stockout.' }));
    this.detail.appendChild(visitTimeline(sel.p, { T: snap.T, treatmentWeeks: this.model.meta.treatmentWeeks }));
    const sig = el('div', { class: 'rd-sigs' });
    if (!sel.signals.length) sig.appendChild(el('div', { class: 'rd-sig ok', html: '<b>No signal.</b> Visits inside window, kits used, site supplied.' }));
    sel.signals.forEach(s => sig.appendChild(el('div', { class: 'rd-sig ' + (s.pts >= 3 ? 'crit' : 'warn') }, [el('b', { text: s.label }), el('span', { text: ' ' + s.detail }), el('em', { text: s.src + ' · +' + s.pts })])));
    this.detail.appendChild(sig);
    if (sel.signals.length) {
      this.detail.appendChild(el('div', { class: 'rd-sub', text: 'Who holds this evidence today, and where it goes.' }));
      const tbl = el('table', { class: 'rd-own' });
      tbl.appendChild(el('tr', {}, [el('th', { text: 'Signal' }), el('th', { text: 'System of record' }), el('th', { text: 'Function that reads it' }), el('th', { text: 'Reaches a retention decision?' })]));
      sel.signals.forEach(s => {
        const o = OWNERS[s.key] || {};
        tbl.appendChild(el('tr', {}, [el('td', { text: s.label }), el('td', { text: o.system || '' }), el('td', { text: o.owner || '' }), el('td', { class: 'no', text: o.reaches || '' })]));
      });
      this.detail.appendChild(tbl);
    }
    this.detail.appendChild(el('div', { class: 'rd-sub', text: sel.site.name + ' supply, same clock.' }));
    this.detail.appendChild(supplyStrip(sel.site, { T: snap.T }));
  };

  global.Radar = { Model, Radar, signalsAt, statusAt, visitTimeline, supplyStrip, LENSES, OWNERS };
})(window);
