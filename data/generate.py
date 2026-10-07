#!/usr/bin/env python3
"""Generate the synthetic study used by the Dropout Radar demo.

Everything here is invented. No real sponsor, site, or patient data is used.
The generator is deterministic (fixed seed) so the deck and the demo always
show the same study. Run:  python3 data/generate.py  ->  data/study.json
"""
import json
import math
import random
from pathlib import Path

SEED = 20261007
N_SITES = 24
PATIENTS_PER_SITE = 20
ENROLL_WEEKS = 20          # randomization spread over the first 20 weeks
TREATMENT_WEEKS = 48       # planned treatment duration per patient
VISIT_INTERVAL_DAYS = 28   # dispensing visit every 4 weeks
STUDY_WEEKS = ENROLL_WEEKS + TREATMENT_WEEKS + 4
BASE_DROPOUT = 0.15        # ordinary sites
FRICTION_DROPOUT = 0.28    # sites with supply friction
REGIONS = ["North America", "Europe", "Asia Pacific"]
COUNTRIES = {
    "North America": ["US", "US", "US", "CA"],
    "Europe": ["DE", "ES", "PL", "UK"],
    "Asia Pacific": ["JP", "KR", "AU", "TW"],
}

rng = random.Random(SEED)


def clamp(x, lo, hi):
    return max(lo, min(hi, x))


def make_sites():
    sites = []
    friction_ids = {3, 9, 14, 17, 22}
    for i in range(N_SITES):
        region = REGIONS[i % 3]
        country = COUNTRIES[region][(i // 3) % 4]
        sid = 101 + i
        friction = sid - 101 + 1 in friction_ids
        sites.append({
            "id": sid,
            "name": f"Site {sid}",
            "region": region,
            "country": country,
            "friction": friction,
        })
    return sites


def site_supply_series(site):
    """Weekly supply metrics per site. Friction sites get a rough patch."""
    weeks = []
    dos = rng.uniform(34, 48)
    rough_start = rng.randint(14, 30) if site["friction"] else None
    rough_len = rng.randint(8, 12) if site["friction"] else 0
    for w in range(1, STUDY_WEEKS + 1):
        in_rough = rough_start is not None and rough_start <= w < rough_start + rough_len
        # days of supply drifts; drops sharply in the rough patch
        target = rng.uniform(4, 13) if in_rough else rng.uniform(30, 45)
        dos = dos + (target - dos) * 0.35 + rng.uniform(-2, 2)
        dos = clamp(dos, 0, 60)
        ship_delay = 0
        if rng.random() < (0.35 if in_rough else 0.05):
            ship_delay = rng.randint(2, 9) if in_rough else rng.randint(1, 3)
        excursion = rng.random() < (0.12 if in_rough else 0.015)
        stockout = in_rough and dos < 14 and rng.random() < 0.6
        weeks.append({
            "w": w,
            "dos": round(dos, 1),
            "shipDelay": ship_delay,
            "excursion": excursion,
            "stockout": stockout,
        })
    return weeks, (rough_start, rough_len)


def make_patients(sites, supply):
    patients = []
    pid = 1000
    for site in sites:
        stockout_weeks = {r["w"] for r in supply[site["id"]] if r["stockout"]}
        for _ in range(PATIENTS_PER_SITE):
            pid += 1
            rand_week = rng.randint(1, ENROLL_WEEKS)
            rand_day = (rand_week - 1) * 7 + rng.randint(0, 6)
            p_drop = FRICTION_DROPOUT if site["friction"] else BASE_DROPOUT
            drops = rng.random() < p_drop
            # dropouts leave between week 6 and week 44 of their own treatment
            drop_tx_week = rng.randint(10, 46) if drops else None
            # a few dropouts leave abruptly with no warning (AE, relocation)
            abrupt = drops and rng.random() < 0.22
            # a handful of completers have a one-off late visit (holiday, travel)
            one_off_late = (not drops) and rng.random() < 0.18
            one_off_visit = rng.randint(2, 11) if one_off_late else None
            # some completers hit a rough patch (work, family, travel): 2 or 3 late
            # visits in a row with kit coming back, then they settle again
            rough_patch = (not drops) and rng.random() < 0.14
            patch_start = rng.randint(2, 9) if rough_patch else None
            patch_len = rng.randint(2, 3) if rough_patch else 0
            # dose reduction can also happen in completers (tolerability), less often
            visits = []
            k = 1
            while True:
                sched_day = rand_day + VISIT_INTERVAL_DAYS * k
                tx_week = 4 * k
                if tx_week > TREATMENT_WEEKS:
                    break
                if drops and tx_week > drop_tx_week:
                    break
                weeks_to_drop = (drop_tx_week - tx_week) if drops else None
                late = rng.gauss(0, 1.4)
                missed = False
                dose_down = False
                returned = clamp(rng.gauss(0.04, 0.03), 0, 0.2)
                supply_hit = False
                if drops and not abrupt and weeks_to_drop is not None and weeks_to_drop <= 20:
                    # disengagement ramps over the last ~20 weeks, fast at first
                    ramp = (20 - weeks_to_drop) / 20.0   # 0 -> 1
                    late = rng.gauss(2 + 11 * ramp ** 0.7, 1.8)
                    returned = clamp(rng.gauss(0.05 + 0.40 * ramp, 0.07), 0, 0.8)
                    missed = ramp > 0.6 and rng.random() < 0.4
                    dose_down = ramp > 0.35 and rng.random() < 0.25
                elif one_off_visit == k:
                    late = rng.gauss(8, 2)
                elif rough_patch and patch_start <= k < patch_start + patch_len:
                    step = k - patch_start
                    late = rng.gauss(5 + 3 * step, 1.5)
                    returned = clamp(rng.gauss(0.18 + 0.1 * step, 0.06), 0, 0.6)
                elif not drops and rng.random() < 0.05:
                    dose_down = True
                # site stockout on the scheduled week forces a reschedule
                sched_week = sched_day // 7 + 1
                if sched_week in stockout_weeks and rng.random() < 0.7:
                    supply_hit = True
                    late = max(late, rng.uniform(4, 12))
                late = round(clamp(late, -3, 21), 1)
                actual_day = None if missed else round(sched_day + late)
                visits.append({
                    "k": k,
                    "sched": sched_day,
                    "actual": actual_day,
                    "late": None if missed else late,
                    "missed": missed,
                    "doseDown": dose_down,
                    "returned": round(returned, 2),
                    "supplyHit": supply_hit,
                })
                k += 1
            drop_day = rand_day + drop_tx_week * 7 if drops else None
            patients.append({
                "id": f"P{pid}",
                "site": site["id"],
                "randDay": rand_day,
                "dropDay": drop_day,
                "abrupt": abrupt,
                "visits": visits,
            })
    return patients


def main():
    sites = make_sites()
    supply = {}
    rough = {}
    for s in sites:
        supply[s["id"]], rough[s["id"]] = site_supply_series(s)
    patients = make_patients(sites, supply)
    n_drop = sum(1 for p in patients if p["dropDay"])
    out = {
        "meta": {
            "study": "SYN-4471",
            "label": "Synthetic Phase III, 24 sites, 480 randomized",
            "synthetic": True,
            "seed": SEED,
            "studyWeeks": STUDY_WEEKS,
            "visitIntervalDays": VISIT_INTERVAL_DAYS,
            "treatmentWeeks": TREATMENT_WEEKS,
            "dropoutShare": round(n_drop / len(patients), 3),
        },
        "sites": [dict(s, supply=supply[s["id"]]) for s in sites],
        "patients": patients,
    }
    path = Path(__file__).with_name("study.json")
    path.write_text(json.dumps(out, separators=(",", ":")))
    print(f"wrote {path} : {len(sites)} sites, {len(patients)} patients, "
          f"{n_drop} dropouts ({out['meta']['dropoutShare']:.1%}), {path.stat().st_size//1024} KB")


if __name__ == "__main__":
    main()
