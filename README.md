# Beyond Dispensing: the data, the rules, and the research

Companion material for **"Beyond Dispensing: How Supply Chain Data Can Predict and Prevent Patient Dropout"**, IRT & RTSM 2026 (Informa Connect), Hyatt New Brunswick, NJ, 7 October 2026.

Prepared by Bryan Clayton, M.S.
BC Consulting Group LLC

## The argument in one paragraph

Every clinical supply tool consumes a dropout rate as a forecasting input. A review of nine IRT and RTSM vendors' public material found none that produces a patient-level dropout signal. The predictors of dropout with published evidence are behavioral and in-trial: missed or incomplete procedures, early non-adherence, adverse events. Each has a twin in the IRT dispensing log: an out-of-window dispense, a kit returned or not returned, a kit-type change, a visit pushed by a stockout. No published study has tested those events as a dropout signal in an investigational product trial. The rest of the evidence is split across IRT, depot, courier, temperature, EDC, eCOA, and CTMS, read by functions that do not share a report: IRT oversight, supply planning, clinical operations, and the site. At study scale (a few hundred patients, 40 to 60 withdrawal events) the honest tool is a rule and a weekly huddle, not a model. At industry scale the asks are: IRT vendors expose dispensing events as a per-patient retention feed, sponsors route that feed to the retention review and to biostatistics under ICH E6(R3), and the community runs one pooled retrospective test.

## What is here

| Path | What it is |
|---|---|
| `notes/extract-spec.md` | The dispensing event extract a sponsor asks its IRT vendor for, the three rules to run first, and the two questions for the retrospective test. Start here. |
| `data/generate.py` | Generates the synthetic study SYN-4471 used in the talk. Fixed seed, every assumption documented in comments. Run it to reproduce `data/study.json`. |
| `data/study.json` | The synthetic study: 24 sites, 480 randomized patients, dispensing every 4 weeks over 48 weeks, site-level weekly supply series. |
| `demo/index.html` | The signal board from the talk, as a standalone page. Open it in a browser. Step the study clock, pick a site, open a patient, switch the lens between dispensing events, supply events, and joined. Each patient shows which function holds each piece of evidence today. Rule-based and illustrative. |
| `demo/radar.js`, `demo/radar.css`, `demo/standalone.html` | The board's source. Plain JavaScript and SVG, no libraries. |
| `timelapse/` | A whole-study replay of a second synthetic study, AURORA-301 (50 sites, 1,000 randomized, go-live to database lock), from the OpenRTSM project. Sites, subjects, and kits as a network over time, with a blinded and unblinded view. Serve the folder over HTTP (see below). |
| `reports/Early dropout detection in trials.md` | The research behind the talk: literature, vendor products, RBQM, eCOA and digital studies, and conference history, with sources. |
| `research_notes/` | The notes per research angle that the report was written from, each claim tagged by evidence quality. |

## Running the demos

The signal board opens directly from the file system: open `demo/index.html` in Chrome or Edge.

The timelapse fetches its data files, so it needs a web server. From this folder:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/timelapse/ in a browser. It starts paused and blinded; press play, and use the unblinded toggle to recolor by arm.

## The data is synthetic

Both studies are invented. No sponsor, site, or patient data was used. The signal board shows no hit rate or lead time on purpose: invented data cannot validate a rule. The extract spec is the way to get real numbers.

## Sources

Every quantitative claim in the talk is cited in `reports/Early dropout detection in trials.md` with a link to its source. The claim-by-claim table at the end of that report says what the evidence does and does not support.

## Contact

Bryan Clayton, M.S. · Founder, BC Consulting Group LLC · bclayton@bcconsulting.io · [linkedin.com/in/BryanSClayton](https://www.linkedin.com/in/BryanSClayton)
