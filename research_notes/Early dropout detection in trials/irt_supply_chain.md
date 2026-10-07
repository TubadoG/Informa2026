# IRT/RTSM and Clinical Supply Data as Early Signals of Dropout, Retention Risk and Non-Adherence

Research date: 2026-09-20. Scope: vendor products, white papers, conference content, and literature on (a) IRT/RTSM vendors using dispensing/supply data for patient-level retention or adherence signals, and (b) evidence that supply chain failures cause missed visits and dropout. Window 2018-2026 preferred.

Overall headline: no IRT/RTSM vendor found publicly markets a patient-level "dropout risk" or "retention risk" feature driven by dispensing data. What they market is (1) real-time subject status and visit-schedule tracking, (2) drug accountability / returns reconciliation reports for site compliance, (3) compliance alerts (Endpoint "NUDGE"), and (4) forecasting that consumes dropout rates as an input rather than predicting them per patient. Claims linking supply failures to dropout are common in vendor and consultant commentary but are almost entirely unquantified; the only quantified items found are indirect (enrollment shortfalls from shortages, COVID-era loss to follow-up tied to drug-supply disruption, pill-count unreliability data).

---

## Key Question 1: Which IRT/RTSM vendors market retention-risk, adherence monitoring, drug return/accountability analytics, visit-window compliance alerts, or patient-level dashboards? What data do they use and what do they claim?

### Takeaway
Every major vendor markets drug accountability/reconciliation reporting and real-time subject/visit status; none found markets a patient-level dropout or retention-risk score built from dispensing data. The only vendor language explicitly claiming "identify risk factors for dropout early" comes from DDi (a smaller vendor) and is generic AI marketing with no method or evidence. Endpoint Clinical's "NUDGE alerts" and Signant's "protocol compliance monitoring" are the closest things to visit-compliance alerting; Suvoda's Sofia and IQVIA's SAVE use IRT data for supply/site analytics, not patient retention.

### Cited Findings

**Suvoda**
- Suvoda IRT marketing: "Drug logistics capabilities include dispensing, accountability, temperature excursion monitoring, controlled substances, variable sourcing, depot control, direct-to-patient shipping, and supply forecasting." IRT "should help study teams perform end-to-end accountability, reconciliation, and returns." — [Suvoda, What is IRT](https://www.suvoda.com/insights/blog/what-is-interactive-response-technology-irt); [Suvoda IRT product page](https://www.suvoda.com/products/irt)
- Suvoda reports: "pre-set and ad-hoc reports give you up-to-the-minute visualizations of data points, KPIs, and trends on the subjects, sites, drugs, and depots within a given study." — [Suvoda RTSM/IRT](https://www.suvoda.com/rtsm-irt-clinical-trial)
- Suvoda's "10 Crucial IRT Features" (Feb 17, 2022): describes a configurable three-step returns process (site accountability, monitor reconciliation, site destruction with e-signature) and "Dynamic visit scheduling ... new visits and new cycles can be automatically added to a patient's visit schedule as they progress." No patient compliance or retention claims. — [Suvoda](https://www.suvoda.com/insights/blog/10-crucial-irt-features-that-deserve-a-nuanced-approach)
- Sofia AI assistant (embedded in Suvoda IRT): surfaces "enrollment velocity, site performance trends, and supply risk"; users can "compare depot inventories, review drug lot releases, create tables and graphs while maintaining the study blind." No patient-retention analytics claimed. — [Suvoda Sofia launch](https://www.suvoda.com/insights/all-news/new-ai-assistant-simplify-clinical-trial-management); [Sofia FAQ](https://www.suvoda.com/sofia-ai-faqs)
- FLAG: Marketing only; no evidence of dropout prediction.

**Endpoint Clinical (PULSE)**
- Search-indexed language for PULSE: it "can be used to track subject activities in real time throughout all your study visits and milestones, and the real-time web reports and NUDGE alerts platform give ready access to compliance feedback for continuous transparency of your study's progress." — [Endpoint PULSE brochure (indexed snippet)](https://info.endpointclinical.com/pulse-brochure); [Endpoint PULSE page](https://www.endpointclinical.com/solutions-pulse)
- The current PULSE page itself emphasizes "100% workflow coverage via dynamic forms", "25+ features tracking every shipment, transfer, and return across the supply chain", "40+ standard reports". The fetched page contained no explicit NUDGE, visit-compliance, or retention claims and cites no evidence. — [Endpoint PULSE](https://www.endpointclinical.com/solutions-pulse)
- FLAG: "NUDGE alerts" is the closest thing to a visit/compliance alerting feature found at any vendor, but the brochure page returned 403 and I could not verify current wording or what data triggers the alerts.

**Signant Health (SmartSignals RTSM)**
- RTSM guide (Dec 16, 2024): "Real-time subject status tracking and protocol compliance monitoring support efficient trial execution"; RTSM systems "automate visit scheduling, and manage drug assignment and dispensation." No retention or adherence claims, no patient-level reporting language. — [Signant RTSM/IRT guide](https://signanthealth.com/resources/blog/rtsm-irt-clinical-trials-guide)
- Bill Byrom, PhD (Dec 11, 2024): RTSM/IRT systems "aggregate multiple data points, including historical enrollment patterns, screen failure rates, patient dropout trends, and site activation timelines to generate accurate supply forecasts." Dropout is an input to forecasting, not an output. No claims linking supply to retention. — [Signant, supply chain management using RTSM/IRT](https://signanthealth.com/resources/blog/clinical-trial-supply-chain-management-rtsm-irt)
- James Stringer (Dec 4, 2023): argues for aligning "RTSM system design with EDC, eCOA, supplies inventory management, CTMS, and other components from the beginning"; mentions "patient-centric approach" and reduced "site burden" but "does not provide specific evidence linking integration to measurable improvements in patient compliance, adherence, or visit compliance." — [Signant, Bringing RTSM in from the cold](https://signanthealth.com/resources/blog/clinical-supplies/bringing-rtsm-in-from-the-cold-integrated-approaches-for-optimized-trial-conduct)

**YPrime**
- "YPrime IRT includes drug accountability and reconciliation reports to monitor site compliance." Feature list: "drug order management, support for hybrid/remote/on-site visit schedules, electronic drug accountability, remote CRA monitoring, depot return options, and reconciliation reporting." IRT+ offers "real-time visibility into their clinical supply chain, patient interactions and site activities, including self-service analytics." — [YPrime IRT (Clinical Leader listing)](https://www.clinicalleader.com/doc/yprime-irt-0002); [YPrime IRT](https://www.yprime.com/irt/)
- FLAG: "site compliance" (accountability) not patient retention. No evidence cited.

**Medidata (Rave RTSM)**
- Feb 24, 2020 blog: "data flows seamlessly between other Medidata solutions, including EDC, without the extensive programming"; only quantified claim is "a 35% reduction in CRF entry completion time" with Rave RTSM (methodology not detailed); Syneos case study cites "streamlined workflow" and eliminated "data reconciliation across separate systems" with no metrics. No dispensing-to-retention analytics described. — [Medidata blog](https://www.medidata.com/en/life-science-resources/medidata-blog/bringing-data-together-without-complicated-integrations-rave-rtsm/)
- Rave RTSM "supports multi-dose vial tracking and captures viability information of the remaining doses" and is "unified with Medidata Rave EDC ... ensuring a single source of truth." Forecasting training covers predicting usage "based on existing and simulated enrollment." — [Medidata, What is RTSM](https://www.medidata.com/en/life-science-resources/medidata-blog/what-is-rtsm/); [Rave RTSM forecasting training](https://www.medidata.com/en/clinical-trial-services/medidata-training/rave-rtsm-forecasting-and-projections/)
- FLAG: search found no Medidata material on patient dropout prediction from RTSM data (Medidata's separate AI/"Patient Retention" analytics on EDC data are outside this note's scope).

**IQVIA / Cenduit**
- Stefan Duerr (Sr. Director, Head of Cenduit Drug Supply CoE, IQVIA), Apr 11, 2023: emphasis on "real-time IRT data for predictive analysis" for supply/waste; introduces Supply Automation Value Engine (SAVE). No adherence, retention, or patient-level reporting claims. — [IQVIA blog](https://www.iqvia.com/blogs/2023/04/providing-drug-supply-support-in-complex-environments-through-irt)
- IQVIA/Clinical Leader piece: IRT manages "patient recruitment, drop-out rates, patient visits, and drug supply"; "IRT data is a valuable source for predictive analytics and preventative measures due to its real-time nature." SAVE "reevaluates and assigns the most optimal supply strategy for every site, every day"; claimed savings $150,000-$1M/yr, no methodology. — [Clinical Leader, Using IRT Data to Automate and Optimize Clinical Supply](https://www.clinicalleader.com/doc/using-irt-data-to-automate-and-optimize-clinical-supply-0001)
- IQVIA IRT marketing: "Turnkey workflows are available for direct-to-patient dispensation and confirmation"; "Without the proper technology, clinical trial sponsors and researchers have no method of monitoring medication adherence and dosage information" in decentralized settings, positioning IRT as part of the answer. — [IQVIA IRT](https://www.iqvia.com/solutions/technologies/patient-engagement-suite/interactive-response-technology); [IQVIA electronic drug accountability and returns fact sheet](https://www.iqvia.com/-/media/iqvia/pdfs/library/fact-sheets/digital-drug-accountability-and-returns-management.pdf)
- FLAG: adherence language is aspirational; no product feature or evidence shown.

**4G Clinical (Prancer RTSM)**
- Prancer "supports evolving patient pathways as dosing strategies adjust, cohorts expand, and protocol amendments introduce new visit requirements, with configurable visit schedules managed within the system"; "can deliver alerts to team members with only a few clicks." No "visit window compliance alert" feature named. — [4G Clinical Prancer RTSM](https://www.4gclinical.com/products/prancer-rtsm/); [4G Clinical DtP white paper](https://www.4gclinical.com/hubfs/Direct-to-Patient_Clinical_Trials_WP_US-1.pdf?hsLang=en-us)

**Almac**
- Dan Ward (Product Manager), DCT/IRT blog (undated): "Decentralised trials ... offer improvement of patient centricity by lessening the burden of trial participation, which in turn speeds patient recruitment and strengthens retention." No evidence, numbers, or adherence metrics. — [Almac, Elevating study experience in DCTs](https://www.almacgroup.com/clinical-technologies/blogs/decentralised-trials-irt/)
- Almac ONE positions IRT integrated with physical supply services (per IntuitionLabs comparison). — [IntuitionLabs RTSM comparison](https://intuitionlabs.ai/articles/rtsm-software-comparison-trial-supply)
- Almac IRT data-integration blog could not be fetched (timeout/connection refused twice). — [Almac IRT data integration](https://www.almacgroup.com/clinical-technologies/blogs/interactive-responsive-technology-data-integration/)

**DDi (smaller vendor) -- the only explicit dropout-risk claim**
- "Improve patient retention by identifying risk factors for dropout early," under "Enhanced Patient Enrollment and Retention." Data described only as "historical and real-time trial data" and "patient recruitment patterns and site performance." No author, date, method, or evidence. — [DDi blog, AI and advanced analytics in RTSM/IRT](https://www.ddismart.com/blog/how-ai-advanced-analytics-transforming-rtsm-irt-systems/)
- FLAG: pure marketing claim, no evidence.

**ScienceSoft (custom IRT development vendor) -- most explicit dispensing-vs-diary reconciliation logic**
- "Automated counting of delivered, dispensed, and used IPs based on IRT shipment and dispensing data, as well as data from eCOA"; "Automated flagging of discrepancies in the quantities of IP provided, used, returned, and destroyed"; "Counting empty packaging and returned pills with the help of computer vision"; alerts flag inconsistencies when returns don't match diary-reported consumption. — [ScienceSoft IRT](https://www.scnsoft.com/healthcare/clinical-trials/irt)
- FLAG: capability description for a custom-build vendor, not a deployed product with evidence.

**N-SIDE (supply forecasting, not IRT)**
- Simulates "each patient virtually -- including their recruitment, screening, treatment, titration, dropout, and drug dispensing"; Supply App uses ML to "continuously monitor conditions after trials begin and update the model automatically" as "dropout rate per visit and treatment arm change." Dropout is a modelled input/observed parameter, not a patient-level prediction. — [N-SIDE, AI in clinical supply chain ep. 2](https://www.n-side.com/en/insights/ai-in-clinical-supply-chain-episode-2/); [N-SIDE, assessing assumptions](https://www.n-side.com/en/insights/assessing-the-impact-of-assumptions-on-clinical-supply-planning/); [N-SIDE Supply App](https://www.n-side.com/en/life-sciences/clinical-supply-forecasting-and-planning/supply-app-risk-based-clinical-supply-optimization-solution/)

**Veeva / Calyx / Oracle**
- Veeva RTSM: "Sites log in to Veeva RTSM to record screening, randomize subjects, and get kit assignments, while RTSM ensures sites have all supplies needed through either basic or predictive supply algorithms." No patient-compliance reporting found. — [IntuitionLabs Veeva RTSM overview](https://intuitionlabs.ai/pdfs/veeva-s-enterprise-standard-rtsm-a-comprehensive-overview.pdf); [Veeva RTSM](https://www.veeva.com/products/veeva-rtsm/)
- Calyx IRT (ex-Veracity Logic) landing page found; no retention/adherence feature language surfaced. — [Calyx IRT](https://lp.calyx.ai/irt)

### Inferences
- The vendor category's "patient-level" data is limited to subject status, visit schedule/dispensing events, kit assignment, returns, and (where integrated) eCOA diary. Vendors expose these as reports and alerts; none has productized a retention-risk model on top of them. This is a genuine white space for a talk.
- Dropout appears in vendor language almost exclusively as a forecasting parameter (supply demand), which is the inverse of the use the talk proposes (dispensing as a leading indicator of dropout).
- Endpoint's NUDGE and Signant's "protocol compliance monitoring" are the natural hooks to cite as "the industry already alerts on late visits; the gap is turning that into a per-patient risk signal."

### Gaps
- Could not fetch Endpoint's PULSE brochure (403) to verify NUDGE alert triggers or wording.
- Almac IRT data-integration blog unreachable; Almac ONE feature detail not verified.
- No public material found for Bracket (now Signant), Clinical Ink, S-Clinica, TrakCel, Vineti on dispensing-derived retention signals (TrakCel/Vineti are CGT orchestration; no retention analytics claims surfaced).
- Vendor claims are uniformly unevidenced; no vendor case study quantifying retention impact of IRT features was found.

---

## Key Question 2: What does the literature/industry commentary say about supply failures (stockouts, missed resupply, excursions, quarantines, shipment delays, expiry) causing missed visits, protocol deviations, or discontinuation? Any quantified examples?

### Takeaway
Industry commentary asserts the link repeatedly ("missed deliveries lead to missed doses ... increase dropout risk"; "stockouts increase patient dropouts") but no source found quantifies supply-failure-to-dropout at the patient level. The quantified evidence is indirect: an oncology trial enrolling under 60% of target due to comparator shortage; a supply model that flagged 425 patients at risk of missed doses; COVID-era reports of drug-supply disruption coinciding with increased loss to follow-up; and DtP vendor claims of retention benefit.

### Cited Findings
- Tom Wells (Director, Life Sciences, 4C Associates), Clinical Leader, Feb 9, 2026: "missed deliveries lead to missed doses, which erode confidence and increase dropout risk"; "Patients get cancelled visits; sites redo work; retention weakens" (DtP courier/pharmacy timing mismatch scenario); gene therapy 72-hour shelf-life delay scenario where "The patient's schedule is pushed back; the site scrambles to reorganize and loses capacity for the rest of the week"; also "anxiety when a delivery doesn't arrive, treatment interruptions, and the creeping sense that the system is less reliable." No quantitative evidence. — [Clinical Leader](https://www.clinicalleader.com/doc/the-key-role-of-clinical-supply-teams-in-patient-centricity-efforts-0001)
- Bob Lozito, MBA, MA, Clinical Supply Leader, Apr 3, 2026: "stockouts increase patient dropouts and CRO demotivation, directly threatening value-inflection milestones"; "Enrollment slowdowns of up to 30% result" from cold chain vulnerabilities; "under-forecasting can cause site stockouts, interrupt dosing schedules, and diminish investigator confidence"; "A single minus 5 degree C deviation can destroy a $2 million batch"; waste rates "50%-75%"; protocol amendments "affect nearly one-third of trials." No patient-level dropout data. — [Clinical Supply Leader](https://www.clinicalsupplyleader.com/doc/the-hidden-supply-chain-risks-that-can-derail-small-biotech-trials-0001)
- N-SIDE case (search-indexed; original URL now redirects): impending shortage from "longer patient treatment, faster-than-expected enrollment, and a commercial shortage of chemotherapy ... would have led to 425 patients missing drug doses within two months of the evaluation -- a risk to their wellbeing, and likely a fatal blow for the trial"; mitigated with CRO/CMO, saving "more than $4 million." — [N-SIDE, reducing risk of drug shortage](https://lifesciences.n-side.com/blog/how-to-reduce-the-risk-of-a-drug-shortage-in-your-clinical-trial) (page moved; quote from search index)
- National Academies report (NCBI Bookshelf, 2022), search-indexed: "one oncology trial enrolled less than 60 percent of the expected number of patients because of a shortage of one of the drugs in the comparison arm." Page blocked by reCAPTCHA on fetch. — [NBK583734](https://www.ncbi.nlm.nih.gov/books/NBK583734/)
- Oximio: "if there are insufficient quantities of comparator drugs, the integrity of the trial could be undermined by delays and non-compliance with data points missed." — [Oximio, Drug shortages](https://oximio.com/resources/drug-shortages/)
- Segelov et al., JCO Global Oncology 2020 (ASCOLT trial, 41 sites, pan-Asian): "disruption of drug supply and increased loss to follow-up because of lockdown, travel restrictions, or patient preference to avoid hospitals"; Guangzhou site: "6 patients need to get a new package of the study drug in February; we decided to deliver the package by post express"; Singapore "a high rate of nonattendance"; sites switched to "mailing of medication kits"; authors flag "higher rates of missing data." — [PMC7193776](https://pmc.ncbi.nlm.nih.gov/articles/PMC7193776/)
- Temperature excursion protocol norm: "Once an excursion is identified, the investigational product must be quarantined and not used until the sponsor provides documentation of permission"; use before approval "will be considered a protocol deviation." This is the mechanism by which an excursion becomes a missed/delayed dose. — [ELPRO, documenting temperature excursions](https://www.elpro.com/en/learn/documenting-temperature-excursions); [CCRPS protocol deviation guide](https://ccrps.org/clinical-research-blog/handling-protocol-deviations-crcs-comprehensive-guide)
- Applied Clinical Trials DtP strategies: "average dropout rate in clinical trials is 30%, with travel being identified as the primary reason"; "First-generation DtP programs have seen drop-off rates of 30 to 40% during patient handoffs." — [Applied Clinical Trials](https://www.appliedclinicaltrialsonline.com/view/direct-patient-clinical-trials-strategies-success)
- World Courier: DtP "can lead to increased enrollment and retention by meeting participants where they are"; "a missed shipment is a missed treatment for patients." — [World Courier DtP model](https://www.worldcourier.com/insights/the-direct-to-patient--model); [World Courier EU home delivery](https://www.worldcourier.com/insights/eu-picks-up-pace-on-home-delivery-of-study-drugs)
- World Pharma Today (DCT supply): "Missed or late supply deliveries can frustrate patients who selected decentralized participation specifically to avoid operational burdens, leading to dropout despite initial enthusiasm." No data. — [World Pharma Today](https://www.worldpharmatoday.com/biopharma/decentralized-clinical-trials-new-demands-on-clinical-supply-strategies/)
- Science 37 + Catalent (Tyler Van Horn, Ricky Hopson), SCRS, Oct 23, 2025: DtP IMP program across "17 studies, enrolling nearly 1,700 patients ... average of 26% of the total study population per trial", "over 6,400 medication shipments"; no dropout or missed-visit metrics reported. — [SCRS](https://myscrs.org/resources/redefining-access-in-clinical-trials/)
- Statista survey: respondents "improved patient retention by increasing convenience" via DtP distribution (percentage not visible without subscription). — [Statista](https://www.statista.com/statistics/754850/reasons-for-using-direct-to-patient-distribution-in-clinical-trials)
- Pfizer "Clinical Trial Anywhere": "about 90% of Pfizer's participants complete a clinical trial, compared to the industry average of about 75%" (general DCT, not supply-specific). — [Pfizer](https://www.pfizer.com/news/articles/the_next_era_of_decentralized_clinical_trials_the_clinical_trial_anywhere_model)
- Applied Clinical Trials "Retention by Design": "average trials see 25%-30% of participants drop out, and some studies have reported attrition rates as high as 70%." Page returned 403 on fetch; quote from search index. — [Applied Clinical Trials](https://www.appliedclinicaltrialsonline.com/view/retention-by-design-operationalizing-patient-centric-trials-without-increasing-site-burden)

### Inferences
- The causal chain is uncontested in industry writing (supply failure -> missed/delayed dose -> visit rescheduling or protocol deviation -> eroded confidence -> dropout) but is supported only by scenarios and anecdotes; a slide should present it as "widely asserted, rarely measured."
- The strongest defensible quantified statements are: shortage-driven enrollment shortfall (<60% of target, NASEM), 425 patients at risk of missed doses in one supply model (N-SIDE), and COVID-era documentation that drug-supply disruption co-occurred with increased loss to follow-up (Segelov 2020).
- DtP retention claims are vendor/logistics-provider assertions; the Science 37/Catalent data set (17 studies, 6,400 shipments) is the most concrete but reports no retention outcome.

### Gaps
- No peer-reviewed study found that quantifies patient discontinuation attributable to IMP stockouts, late resupply, excursions, or expiry. PubMed searches returned protocol PDFs and COVID-impact papers only.
- Applied Clinical Trials "Mitigating Supply Chain Risk" and "Evaluating the Impact of a Direct-to-Patient Clinical Trial Site" both returned 403; the latter reportedly has retention/representation data for a DtP site model and would be worth retrieving manually.
- NASEM chapter blocked by reCAPTCHA; underlying citation for the "<60% enrollment" oncology trial not captured.

---

## Key Question 3: Conference talks since 2019 (Informa IRT & RTSM, CTS Europe/East/West Coast, GCSG, DIA, SCOPE, ISPE) on using IRT or supply data for patient retention or dropout?

### Takeaway
No session found at Informa IRT & RTSM 2023-2026 or Arena CTS East Coast 2026 whose stated topic is using IRT/supply data for patient retention or dropout prediction. The nearest sessions are about IRT-eClinical integration (2026) and DtP/remote-monitoring-triggered resupply (CTS East Coast 2026). This confirms the talk topic is not already occupied on these agendas.

### Cited Findings
- Informa IRT & RTSM 2026, Oct 6-7, Hyatt Regency New Brunswick, NJ. Tracks: "IRT at Scale", "IRT from Scratch", "IRT in Growth Mode", "Track 1: IRT Design, Systems & Compliance", "Track 2: Clinical Supply Chain Optimization." — [Informa IRT & RTSM](https://informaconnect.com/irt-rtsm/)
- 2026 Day 1 sessions touching integration (not retention): "From System to Strategy -- IRT/RTSM's New role in Redefining Clinical Trials for Today's Challenges", 8:15-9:00am Oct 6, Carla Reis (VP Enterprise Customer Operations, 4G Clinical) and Paul Hughes (Director RTSM, Johnson & Johnson), covering "integration architecture (bridging CTMS, WMS, EDC, and eCOA)"; "Breaking the Silos -- Building a Smarter Cross-Study Data Strategy for IRT", 11:15-11:45am Oct 6, Kimberly Harrington (Principal Product Manager, Oracle), Isaac Greenslade (Head of Clinical Supply Systems, Merck & Co), Igor Druker (Director IRT & Clinical Supply Systems, Biohaven), on "improved interoperability between IRT and broader eClinical systems." Agenda page states no session on retention, dropout, adherence, or patient-level data. — [Informa IRT & RTSM agenda](https://informaconnect.com/irt-rtsm/agenda/)
- 2026 speaker list includes Bryan Clayton (Founder, BC Consulting) alongside Alyssa Gilliam (ICON), Bryan O'Neill (Gilead), Hans O von Steiger (Pfizer), Everett Rogers (Medidata), Fiona Geiger (Endpoint Clinical), Maggie Walker (Amgen, "Clinical Sys & Analytical Reporting (IRT)"), Christopher Natale (Regeneron, Data Management), Kate Thomas and Mehreen Bhatti (site CRCs). — [Informa IRT & RTSM speakers](https://informaconnect.com/irt-rtsm/speakers/)
- Informa IRT 2025: Oct 14-15, 2025, Boston; themes "optimizing data collection from clinical studies, navigating late-stage addendums, resolving conflicts between IRT randomizations and ancillary data." — [BiopharmaTrend listing](https://www.biopharmatrend.com/events/741-interactive-response-technologies-2025/)
- Informa IRT 2024: Oct 16, 2024, Revere Hotel Boston Common. — [Qwoted](https://app.qwoted.com/opportunities/event-irt-conference-2024)
- Informa IRT 2023: Oct 17-18, 2023, Boston; themes "decentralized trials, clinical supply chain optimization, IRT management, inspection readiness, and vendor governance." — [Poxy Clinical](https://www.poxyclinical.com/interactive-response-technologies-2023/); [4G Clinical events](https://www.4gclinical.com/events/flagship/irt-2023)
- Arena Clinical Trial Supply East Coast, Nov 4-5, 2026: "The Tech-Driven Trial: Syncing Clinical Operations Innovations with Next-Gen Supply Strategies" (Nov 4, 2:45pm) includes "leverage eConsent and Remote Monitoring data to trigger automatic resupply shipments, reducing the burden on both patients and site staff" and DtP "last-mile" cold chain; keynote Tom Gottschalk (VP BD, RxStudy Card, Valeris) "From Concept to Clinic: Operationalizing the Pharmacy Card Model to Decentralize Supply and Accelerate Patient Access" (Nov 4, 10:00am); roundtable moderated by Martina Endzhova (Bayer) on "patient-focused partnerships" (Nov 5, 9:10am). — [Arena CTS East Coast](https://www.arena-international.com/event/ctseastcoast/)
- Arena CTS East Coast positioning (search-indexed): "Patient-centric supply planning can reduce burden, improve retention, and build trust through advocacy partnerships, flexible logistics, and aligned operations." — [Arena CTS East Coast](https://www.arena-international.com/event/ctseastcoast/)
- GCSG 2025 US Conference, Apr 27-30, 2025, San Antonio, 450+ attendees; published topics: comparator sourcing workshop, expanded access, CGT, regional regulatory. No retention/IRT-data session surfaced. — [GCSG 2025 program](https://mygcsg.com/conference/gcsg-2025-us-conference/program-and-resources/)
- 4G Clinical webinar: "Agile IRT/RTSM: Enabling Clinical Trial Design and Supply Innovation" (press release) and on-demand supply pooling webinar; none on retention. — [4G Clinical](https://www.4gclinical.com/press_releases/agile_irt_rtsm_webinar)

### Inferences
- Across four Informa IRT agendas (2023-2026) and CTS East Coast 2026, the "IRT/supply data as a patient retention signal" framing is absent; the closest adjacent concept (CTS East Coast 2026) is the reverse direction: using clinical data to trigger resupply.
- Maggie Walker (Amgen, IRT analytical reporting) and Christopher Natale (Regeneron, data management) on the 2026 roster are plausible people to reference or engage on joining IRT with EDC data.

### Gaps
- Historical (2019-2025) Informa IRT agendas are not archived at public URLs; only themes, not session titles/speakers, were recoverable. DIA, SCOPE, ISPE, CTS Europe/West Coast, and GCSG session-level searches on this topic returned nothing relevant.
- Could not find any LinkedIn or SlideShare practitioner decks specifically on IRT dispensing data as a dropout early-warning signal.

---

## Key Question 4: Have sponsors or CROs presented on joining IRT dispensing data with EDC/CTMS data for retention monitoring or patient-risk dashboards?

### Takeaway
No sponsor or CRO presentation or case study was found that joins IRT dispensing data with EDC/CTMS specifically for retention monitoring or a patient-risk dashboard. What exists is integration guidance (eliminating reconciliation, enforcing eligibility gates) and one 2026 Informa panel (Merck, Biohaven, Oracle) on cross-study IRT data strategy.

### Cited Findings
- IntuitionLabs RTSM-EDC integration guide: "Business rules can be built so that the RTSM will only randomize a patient once certain EDC data points (like eligibility criteria) are entered and verified, enforcing protocol compliance"; integration "provides sponsors with comprehensive trial visibility across all systems." No retention use case. — [IntuitionLabs](https://intuitionlabs.ai/articles/rtsm-edc-integration-clinical-trials)
- DDi integration/reconciliation guidance: "data captured in IRT is real-time data which would help for easy reconciliation without discrepancies." — [DDi](https://www.ddismart.com/blog/integration-reconciliation-irt-guidelines/)
- Octalsoft IRT/EDC/CTMS page: "By combining real-time patient and site data with sophisticated supply management functionality, sponsors, sites and CROs get the visibility and control needed to make confident, data-driven decisions." Marketing, no evidence. — [Octalsoft](https://www.octalsoft.com/irt-and-edc-integration-for-seamless-clinical-trial-execution/)
- Medidata Syneos case (2020): eliminated "data reconciliation across separate systems"; no retention metrics. — [Medidata blog](https://www.medidata.com/en/life-science-resources/medidata-blog/bringing-data-together-without-complicated-integrations-rave-rtsm/)
- Informa 2026 "Breaking the Silos" panel (Merck & Co, Biohaven, Oracle) is on cross-study IRT data strategy and reconciliation burden, not patient risk. — [Informa agenda](https://informaconnect.com/irt-rtsm/agenda/)
- Modeling Clinical Trial Attrition Using Machine Intelligence (medRxiv 2021, 1,325 trials, ~1M patients): trial-level attrition driver analysis, not IRT-based. — [medRxiv](https://www.medrxiv.org/content/10.1101/2021.11.12.21266277v1.full)

### Inferences
- The industry has solved the plumbing (IRT-EDC integration is standard) but has not, publicly, put a retention-analytics layer on top; the "join" exists for reconciliation, not for risk.

### Gaps
- No sponsor/CRO case study found (Pfizer, Novartis, Sanofi, Syneos, ICON, IQVIA) presenting an IRT+EDC patient-risk dashboard. Absence of evidence, not evidence of absence; internal dashboards may exist but are not published.

---

## Key Question 5: What do IRT drug-return, accountability, and dose-titration data actually record, and how reliable are they as adherence proxies?

### Takeaway
IRT records dispensing events (kit/lot, visit, date), returns (units returned, lost/not-returned status), and accountability/destruction sign-offs; compliance is then computed as (dispensed - returned) / expected. The literature consistently shows pill-count/returns overestimate adherence versus electronic monitoring (roughly 5-8 points at the median, with 11-19% of visits showing >105% "over-adherence" consistent with pill dumping), so returns data is a weak positive signal of adherence but a usable negative signal (missing returns, non-returned kits, no subsequent dispensation).

### Cited Findings
- Standard protocol formula: "Compliance (%) = 100 x (tablets dispensed - tablets returned) / tablets prescribed"; variant "(number of tablets provided to subject - number of tablets returned) / Total number of Tablets that should have been taken during the period x 100"; "Treatment compliance is assessed based on the capsules dispensed and returned as recorded in the eCRF." — [NCT04223193 SAP](https://cdn.clinicaltrials.gov/large-docs/93/NCT04223193/SAP_001.pdf); [NCT05895552 SAP](https://cdn.clinicaltrials.gov/large-docs/52/NCT05895552/SAP_001.pdf)
- Missing-return rules in SAPs: "If a kit was lost and no return information was available, it is assumed that the tablets were not taken"; "If a kit is not returned but the patient had a subsequent dispensation, then the non-returned kit is assumed to have been taken in full. However, if a kit is not returned and no kit is subsequently dispensed, then the non-returned kit is assumed to not have been taken." — [NCT04316143 SAP](https://cdn.clinicaltrials.gov/large-docs/43/NCT04316143/SAP_001.pdf); [NCT04076059 SAP](https://cdn.clinicaltrials.gov/large-docs/59/NCT04076059/SAP_001.pdf)
- Suvoda returns workflow: site accountability, monitor reconciliation, site destruction with electronic signatures; kits "determined as unsafe" tracked to destruction. — [Suvoda](https://www.suvoda.com/insights/blog/10-crucial-irt-features-that-deserve-a-nuanced-approach); [Suvoda, What is IRT](https://www.suvoda.com/insights/blog/what-is-interactive-response-technology-irt)
- Medidata Rave RTSM: "supports multi-dose vial tracking and captures viability information of the remaining doses." — [Medidata](https://www.medidata.com/en/life-science-resources/medidata-blog/what-is-rtsm/)
- IQVIA: "Automated flagging of discrepancies in the quantities of IP provided, used, returned, and destroyed" (via ScienceSoft description of IRT+eCOA); IQVIA offers an "Electronic Drug Accountability and Returns Management" fact sheet. — [ScienceSoft](https://www.scnsoft.com/healthcare/clinical-trials/irt); [IQVIA fact sheet](https://www.iqvia.com/-/media/iqvia/pdfs/library/fact-sheets/digital-drug-accountability-and-returns-management.pdf)
- Baisley, Baeten, Hughes, Donnell et al., AIDS and Behavior 2013 (two HSV-2 suppression trials, n=1,305 and n=3,277): blister packs returned at scheduled visits 95% (Mwanza) and 89% (HPTN 039); tablets never returned in 2% and 4% of visits; over-adherence >105% in 19% and 11% of visits (median excess 28 and 6 tablets); apparent over-adherence intervals correlated with reduced antiviral effect, "suggesting these represented pill-dumping rather than actual adherence." — [PMC3812335](https://pmc.ncbi.nlm.nih.gov/articles/PMC3812335/)
- van Onzenoort et al., American Journal of Hypertension 2010 (n=228): "median adherence according to MEMS was lower than median adherence according to pill count (91.6 vs. 96.1; P < 0.001)"; classification agreement: 47% adherent by both, 14% nonadherent by both, 14% adherent by MEMS only, 25% adherent by pill count only. — [AJH](https://academic.oup.com/ajh/article/23/2/149/2281931)
- Scoping review of MEMS vs alternatives (PubMed 27005306, search-indexed): "median adherence was grossly overestimated by 8% using pill count." — [PubMed](https://pubmed.ncbi.nlm.nih.gov/27005306/)
- AARDEX (Bernard Vrijens): "Participants may throw excess pills away, creating a bias in results that can be as much as 50% in some trials"; "35% [of patients] ... had pill counts well above 100%"; "Manual pill counting is a convenient system that masks the uncomfortable truth of medication nonadherence." Page 403 on fetch; from search index. — [AARDEX](https://aardexgroup.com/pill-count-compliance-its-time-to-burst-the-drug-trial-bubble/); [Vrijens LinkedIn](https://www.linkedin.com/pulse/pill-count-time-question-assumed-option-adherence-bernard-vrijens-0j5zc)
- Pill count and self-report "likely overestimate rates of medication adherence, and may become less reliable as the duration of a clinical trial increases." — [PubMed 18472991](https://pubmed.ncbi.nlm.nih.gov/18472991/)
- AASK pilot and other studies: pill-count acceptable adherence at 68% of visits while MEMS flagged nonadherence at 47% of those visits. — [PubMed 8862216](https://pubmed.ncbi.nlm.nih.gov/8862216/)

### Inferences
- What IRT reliably records is the event layer (dispense happened / did not happen, on what date, kit returned / not returned, subsequent dispensation / none). These are objective and timestamped; the quantity layer (tablets returned) is what is unreliable.
- For dropout detection, the useful IRT signals are therefore: no dispensation at expected visit, dispensation outside window, kit not returned with no subsequent dispensation, and returns with implausible counts (>105% or <50%), rather than the computed compliance percentage itself.
- Titration data: IRT records dose-level assignment per visit in titration designs (Suvoda mentions "adjustments to dosage in treatment arms"); no source found characterizing its reliability as an adherence proxy.

### Gaps
- No source found that validates IRT returns-derived compliance specifically (all reliability data is on pill counts generally, which is the same measurement but not IRT-specific).
- No vendor documentation found describing exactly which return fields (count, condition, date, reason for non-return) are captured as standard.
- Dose-titration data content and reliability not covered in any retrieved source.
