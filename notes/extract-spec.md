# Dispensing event extract: the starter spec

The extract a sponsor asks its IRT vendor for, and the extract the closing slide promises. One row per scheduled dispensing visit per patient, plus one row per site per week for supply. Everything below is a standard IRT field or a one-line derivation from one. No treatment arm, no dose value, no free text.

## Patient-level events (one row per scheduled dispensing visit)

| Field | Type | Source | Notes |
|---|---|---|---|
| `study_id` | string | IRT | |
| `site_id` | string | IRT | |
| `patient_id` | string | IRT | Pseudonymous subject number. Never the screening log. |
| `visit_number` | integer | IRT visit schedule | Protocol visit index. |
| `scheduled_date` | date | IRT visit schedule | The protocol-derived target date. |
| `window_open`, `window_close` | date | IRT visit schedule | Protocol window. If the IRT does not store it, derive from the protocol's plus-or-minus days. |
| `actual_date` | date or null | IRT dispensing transaction | Null if no dispense has occurred against this visit. |
| `days_late` | integer or null | derived | `actual_date - window_close` when positive, else 0. Null if no dispense. |
| `no_dispense` | boolean | derived | True when `actual_date` is null and today is more than 7 days past `window_close`. |
| `kit_type_changed` | boolean | IRT kit assignment | True when the kit type differs from the previous visit. **Kit level only.** Do not include direction, dose value, or arm. In a blinded study this field runs inside the unblinded layer or is dropped. |
| `returned_units` | integer or null | IRT drug accountability | Units returned unused at this visit, from the previous kit. |
| `expected_units` | integer or null | IRT kit definition | Units in the previous kit. |
| `kit_not_returned` | boolean | derived | True when the previous kit has no return record and no subsequent dispense exists. |
| `reschedule_reason` | enum or null | IRT | `supply`, `site`, `patient`, `other`, null. The value that matters is `supply`: no kit available on the scheduled day. |
| `supply_pushed` | boolean | derived | True when `reschedule_reason = supply`, or when the site had a stockout flag on the scheduled week. |

## Site-level supply (one row per site per week)

| Field | Type | Source | Notes |
|---|---|---|---|
| `site_id` | string | IRT | |
| `week_start` | date | | Monday. |
| `days_of_supply` | number | IRT inventory | Site stock divided by forecast weekly consumption, as the IRT computes it. |
| `stockout` | boolean | IRT inventory | Any kit type at zero available during the week. |
| `shipment_late_days` | integer | IRT shipment status, courier | Days between the resupply order's promised and actual delivery. Zero if on time or none. |
| `excursion` | boolean | temperature loggers, IRT quarantine status | Any shipment or site stock quarantined for temperature during the week. |
| `depot_days_of_supply` | number or null | depot WMS, planning tool | For the depot serving this site. Optional in the first pull. |

## Outcomes (one row per patient, from EDC, for the backward run)

| Field | Type | Source |
|---|---|---|
| `patient_id` | string | EDC |
| `randomized_date` | date | EDC or IRT |
| `end_status` | enum | EDC disposition: `completed`, `withdrawn`, `lost_to_follow_up`, `ongoing`, `other` |
| `end_date` | date or null | EDC disposition |

## The three rules to run first

Each rule is an event flag with a fixed definition, one owner, and a closing condition. No weights. Owners are functions, not departments: IRT oversight produces the extract, supply planning owns the supply flags, clinical operations owns the patient flags. At a small sponsor the first two are one person and the third is the CRO.

| Flag | Definition | Owner | Closes when |
|---|---|---|---|
| Out-of-window dispense | `days_late > 7`, or `no_dispense` is true | Clinical operations (CRA or study manager), with the site coordinator | Next dispensing visit lands inside its window |
| Kit not returned | `kit_not_returned` is true, or `returned_units / expected_units >= 0.35` | Clinical operations, with the site coordinator | Next visit records a return under threshold |
| Visit pushed by supply | `supply_pushed` is true, or the site had `stockout` or `shipment_late_days > 3` in the scheduled week | Supply planning (at a small sponsor, the supply manager who also runs the IRT) | Site above trigger and no pushed visits for 8 weeks |

## The two questions for the retrospective test

1. Among patients who withdrew, what share had an out-of-window dispense or a kit-not-returned event before the withdrawal date, and what was the median number of weeks between the first such event and the withdrawal? Compare with the share among completers over the same exposure.
2. Among withdrawals at a site, what share followed a site supply event (stockout, late shipment, excursion) within eight weeks? Compare with the base rate of supply events at that site.

Report both as counts and shares, with the number of withdrawal events, per study and pooled. No model until the pooled event count passes 200.

## What is deliberately not in the extract

- Treatment arm, dose value, or any field that could separate arms. Kit type change is a boolean at kit level and lives in the unblinded layer.
- Free-text comments.
- Screening log identifiers, dates of birth, or any direct identifier.
- Compliance percentages. Pill counts overstate adherence and 11 to 19 percent of visits show returns implying over 100 percent adherence. Use the events.
