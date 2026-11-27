# Meemo research evidence layer

This package adds a reusable, machine-readable research layer to the existing Meemo product catalog. It keeps commercial verification, formulation identity, study findings, and permission to make a particular claim separate.

**Status:** source-checked seed for review. The web quiz and SMS bot do not consume this package yet. Production claim rendering is disabled by the dataset's draft state. The preview demonstrates the permitted wording and the reasons a claim can be blocked. No network calls, messages, purchases, or personal-data collection occur in the package.

## Files

| File | Purpose |
| --- | --- |
| `meemo-evidence.v1.json` | Versioned registry: catalog IDs, sources, studies, formula snapshots, product links, bounded claims, research queue, and an outcome-tracking specification. |
| `meemo-evidence.schema.json` | JSON Schema 2020-12 for structure, types, explicit unknown values, and basic evidence/claim constraints. |
| `runtime.mjs` | Dependency-free JavaScript adapter usable by a browser bundle or Node service. Validates references and renders only stored claim wording with its qualification. |
| `runtime.test.mjs` | Offline behavior tests, including catalog parity, unsupported claims, unknown IDs, formula conflicts, review expiry, and input tampering. |
| `demo.mjs` | Reproducible preview using the current catalog IDs; prints the successful and blocked cases. |
| `validate_schema.py` | Optional schema validation and negative checks, using Python's `jsonschema` package. |

The registry is language-independent JSON. The JavaScript module is a reference consumer, not a replacement for the scientific record.

## Coverage and its meaning

The catalog snapshot contains **30 existing IDs**, read from commit `0d637aae3316d0c9a77bd990ce908f74f6ba9b96`. Both `src/App.jsx` and `api/_bot.js` contain the same IDs. [PR #5](https://github.com/ComplianceCodeaAi/meemo-skin-quiz/pull/5) and [PR #6](https://github.com/ComplianceCodeaAi/meemo-skin-quiz/pull/6) are merged.

The seed contains two product evidence records, three formulation snapshots, and **one** clinical study. Both product records reference that same study; it is not counted twice as independent research. The other 28 products resolve to `insufficient_evidence` / `not_reviewed`. This means this registry has not assessed them. It does not mean they are ineffective or that no research exists.

### Evidence categories

| Value | Meaning |
| --- | --- |
| `finished_product_human_study` | Human research matched to the exact finished formulation and relevant outcome. Study quality and applicability still need review; this label alone is not a guarantee. |
| `ingredient_level_human_study` | Human research involving an ingredient or ingredient-containing formulation, with indirect applicability to the catalog product. |
| `preclinical_research` | Laboratory, model, or animal findings that cannot be presented as demonstrated consumer results. |
| `insufficient_evidence` | No supported assessment in the registry for the requested product/outcome, including products not yet reviewed. |

These are evidence relationships, not scores. Retailer status, review counts, stars, virality, price, and affiliate economics do not change the classification. The current runtime renders only the narrow ingredient-context category used by this seed; other categories require a deliberate runtime extension.

## What was verified

### The clinical study

[Anggraeni et al., 2021; PMID 34214362](https://pubmed.ncbi.nlm.nih.gov/34214362/) compared creams in 30 Indonesian batik workers with dry skin. Use was twice daily on hands and arms for four weeks. The abstract reports selected hydration changes and a dorsal water-loss result in the ceramide arm. This was not a trial of either catalog product.

The record preserves the eight significant results reported in the abstract, with their p-values, while explicitly marking the extraction as incomplete. A p-value is not an effect size or a promised benefit. Pairwise baseline-to-week-four tests have not been verified. The abstract's nonsignificant comparative conclusion does not establish equivalence or a superior ingredient.

[Publisher disclosures](https://www.degruyterbrill.com/de/document/doi/10.1515/jbcpp-2020-0510/html) identify PT Paragon as funder and cream manufacturer, separately from the authors' no-conflict declaration. The primary full article was not accessible in this review. Concentrations, arm counts, ages, full vehicles, and unverified statistics remain `null` or explicitly unknown.

The [earlier author poster](https://ff.unair.ac.id/conferences/icphs2020/files/disabled-eposter-/ICPHS2020-CP-84_sylvia-anggraeni-hutomo.pdf) is linked as a related report of the same study. Its pH table and the abstract's summary need reconciliation, so no consumer pH benefit claim is emitted. No dermatitis-prevention claim is accepted from these endpoints.

### The catalog formulations

| Exact catalog ID | Verified relationship | Consequence |
| --- | --- | --- |
| `skin1004-centella-ampoule` | [Current official INCI](https://www.skin1004.com/products/skin1004-madagascar-centella-ampoule) matches the [catalog's US 55 ml listing](https://us.oliveyoung.com/products/UA43792133). Seven listed ingredients include Centella extract. Its concentration is undisclosed. | A preview may display qualified ingredient research context. No finished-product efficacy, numerical benefit, or “100% active Centella” claim follows. |
| `illiyoon-ceramide-cream` | The [catalog US listing](https://us.oliveyoung.com/products/UA39684183) names Hydroxypropyl Bispalmitamide MEA; the [international brand list](https://int.illiyoon.com/products/ceramide-ato-concentrate-cream) names Cetyl-PG Hydroxyethyl Palmitamide. Both include Ceramide NP. | Both snapshots are retained. `active_formulation_id` is `null`, and product-linked claim rendering is blocked until the catalog/package version is resolved. |

The Illiyoon snapshots contain selected ingredients and say `inci_is_complete: false`. The source pages contain longer lists. Neither snapshot is represented as a complete allergy screen. Website checks also do not authenticate an individual purchased batch.

Manufacturer test summaries are research leads, not accepted trials. Illiyoon's public percentages and duration promises are excluded from recommendation claims until the full report and exact tested formulation can be assessed. A raw-material purity figure must never be entered as its concentration in the finished product.

## Use the package

From the repository root, with a current Node LTS runtime:

```bash
node --test evidence/runtime.test.mjs
node evidence/demo.mjs
```

For JSON Schema validation, install a compatible development dependency if needed and run the validator:

```bash
python3 -m pip install 'jsonschema>=4.22,<5'
python3 evidence/validate_schema.py
```

The JavaScript runtime itself has no third-party dependencies. Consumers inject the parsed registry and their actual catalog IDs:

```js
import { createEvidenceEngine } from './evidence/runtime.mjs';

const engine = createEvidenceEngine(registry, catalog.map(product => product.id));
const result = engine.renderClaim(
  'skin1004-centella-ampoule',
  'skin1004-indirect-hydration-context',
  {
    mode: 'preview',
    concern: 'hydration',
    asOf: '2026-11-27',
    channel: 'web'
  }
);

// result.text includes the mandatory formulation/body-site limitation.
// result.publishable is false in preview, even for an otherwise eligible claim.
```

Use the real catalog as the second argument in application code. Passing the registry's own snapshot back as the current catalog would defeat the drift check. The demo reads the current app catalog.

### API and failure behavior

| Method | Returns |
| --- | --- |
| `assess(productId, options)` | Evidence category, review state, eligibility, allowed claim IDs, reasons for blocking, and the limited scope of an allergy check. |
| `getClaim(productId, claimId, options)` | Stored claim fields and source links if the product, concern, formulation, dates, and review states permit it. |
| `renderClaim(productId, claimId, options)` | Final stored web or SMS wording joined to its mandatory caveat. Blocked cases return `text: null`. |
| `buildModelContext(productIds, options)` | Eligible product/claim IDs and rendered context, plus reasons for excluded candidates. This does not select a winner. |

Default mode is `production`; preview is explicit. Production requires an approved dataset and approved relevant product, study, and claim records. A schema-valid file is not automatically an approved scientific record. This status mechanism is part of the package's editorial design, not evidence that a clinician has reviewed it.

Unknown IDs, an unsupported concern, a mismatched claim, expired reviews, inactive sources, and ambiguous formulas produce explicit blocked results. Invalid registry configuration raises `EvidenceRegistryError`. Nothing silently becomes the first catalog product.

`knownAllergens` accepts exact INCI names, with case and whitespace normalization. Unknown aliases and free text require review. A negative exact match means only that the name was not found in the listed INCI; it never means “safe.” This module is not a comprehensive contraindication, diagnosis, or allergy engine.

Review dates expire after a documented 90-day editorial interval in this seed. That interval is a maintenance choice, not an assertion that scientific knowledge expires after 90 days. `asOf` is for deterministic evaluation; application callers must not let a model choose an old date to bypass expiry.

## Connect the quiz and SMS later

Adding this package alone does not constrain the existing app's output. A complete integration must enforce claims after model selection:

1. Move recommendation selection and the prompt into a server-owned handler. The current `api/recommend.js` forwards the caller's request body.
2. Use the canonical catalog and only eligible evidence claim IDs. Keep profile-fit reasons separate from efficacy assertions.
3. Have the model return `productId` and `claimId` for each primary/alternative choice. Reject unknown IDs or unsupported combinations.
4. Render evidence wording using `renderClaim`. Do not display model-authored efficacy prose or allow it to remove the caveat.
5. Apply the same rule to fallbacks, alternative products, and ongoing SMS replies. Existing `why`, `altWhy`, `dataReason`, `fit`, and `DEMO_RECS` paths are not evidence-reviewed merely because they use real product IDs.
6. Preserve product IDs in the SMS routine state; its current mapping drops them. Keep registration, consent, and sending controls independently managed.

The current public UI uses descriptions such as “proven” and free-form efficacy wording. This package does not substantiate that site-wide language. A live cutover must review it with the covered evidence and claim policy.

## Adding and reviewing evidence

Record a source with its access level and inspection date. Create one study per study family, with related papers/posters linked rather than counted independently. Capture null and adverse findings alongside positive ones when full text becomes available. Preserve measured endpoints, units, comparator, duration, effect sizes and uncertainty; do not replace them with a confidence score.

Verify product market, size, package INCI and formula version separately. Keep extract content, standardized active content, proprietary blend concentration and raw-material purity distinct. A changed formula must trigger a new match review.

Create product-to-study links, then write bounded claim records that cite those links. A claim review should check population, body site, dose, vehicle, statistical scope, funding, negative findings and exact wording. Record the actual reviewer and decision; do not change approval fields simply to make tests or rendering pass.

Run schema validation and behavior tests after editing. For a new evidence category, extend the runtime and its failure tests deliberately. The starter is not a systematic review and should not be marketed as a complete efficacy ranking of Korean skincare.

## Measurable user outcomes

The JSON includes a measurement specification, not an active tracking service. It proposes baseline, day-14 and day-28 self-reports for dryness, tightness, irritation, adherence and other routine changes. Define each 0–10 scale and retain missing values as null. Follow-up minus baseline expresses a change in reported experience; it does not establish causality.

TEWL and corneometry remain instrument measurements. A selfie cannot supply them. Keep individual observations separate from published clinical evidence, and do not turn a four-week check-in into a time-to-results promise. Any future personal tracking implementation needs its own consent and data handling.
