import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createEvidenceEngine, EvidenceRegistryError } from "./runtime.mjs";

const seed = JSON.parse(readFileSync(new URL("./meemo-evidence.v1.json", import.meta.url), "utf8"));
const SKIN = "skin1004-centella-ampoule";
const ILLIYOON = "illiyoon-ceramide-cream";
const SKIN_CLAIM = "skin1004-indirect-hydration-context";
const ILLIYOON_CLAIM = "illiyoon-indirect-hydration-context";
const PREVIEW = { mode: "preview", concern: "hydration", asOf: "2026-11-27" };
const fixture = () => structuredClone(seed);
const engine = (data = fixture(), ids = data.catalog.product_ids) => createEvidenceEngine(data, ids);
const hasReason = (result, reason) => {
  assert.equal(result.eligible, false);
  assert.equal(result.publishable, false);
  assert.ok(result.reasons.includes(reason), JSON.stringify(result.reasons));
};

test("the seed binds to the same 30 exact IDs in the quiz and SMS catalogs", () => {
  assert.equal(seed.catalog.product_ids.length, 30);
  for (const path of ["../src/App.jsx", "../api/_bot.js"]) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    const catalog = source.match(/const CATALOG = \[([\s\S]*?)\n\];/u);
    assert.ok(catalog, `missing catalog in ${path}`);
    const ids = [...catalog[1].matchAll(/\bid:\s*"([^"]+)"/gu)].map((match) => match[1]);
    assert.deepEqual(ids.sort(), [...seed.catalog.product_ids].sort());
  }
  assert.equal(seed.studies.length, 1, "the shared trial is one study, not two independent trials");
  assert.equal(seed.products[0].evidence_links[0].study_id, seed.products[1].evidence_links[0].study_id);
});

test("production defaults fail closed for a draft dataset", () => {
  const result = engine().renderClaim(SKIN, SKIN_CLAIM, { concern: "hydration", asOf: PREVIEW.asOf });
  hasReason(result, "dataset_not_approved");
  assert.equal(result.mode, "production");
  assert.equal(result.text, null);
  assert.deepEqual(result.sources, []);
});

test("explicit preview renders indirect research with its mandatory limitation", () => {
  const result = engine().renderClaim(SKIN, SKIN_CLAIM, PREVIEW);
  const claim = seed.claims.find((entry) => entry.id === SKIN_CLAIM);
  assert.equal(result.eligible, true);
  assert.equal(result.publishable, false);
  assert.equal(result.evidence_type, "ingredient_level_human_study");
  assert.equal(result.text, `${claim.text} ${claim.mandatory_caveat}`);
  assert.ok(result.sources.some((source) => source.url === "https://pubmed.ncbi.nlm.nih.gov/34214362/"));
});

test("SMS wording cannot lose the mandatory qualification", () => {
  const result = engine().renderClaim(SKIN, SKIN_CLAIM, { ...PREVIEW, channel: "sms" });
  const claim = seed.claims.find((entry) => entry.id === SKIN_CLAIM);
  assert.equal(result.text, `${claim.sms_text} ${claim.mandatory_caveat}`);
  assert.equal(result.publishable, false);
});

test("conflicting Illiyoon listings block product-linked claims even in preview", () => {
  const result = engine().renderClaim(ILLIYOON, ILLIYOON_CLAIM, PREVIEW);
  hasReason(result, "formulation_not_matched");
  assert.ok(result.reasons.includes("active_formulation_unconfirmed"));
  assert.equal(result.text, null);
});

test("a known unreviewed product is unknown efficacy, not evidence of inefficacy", () => {
  const result = engine().assess("cosrx-lowph-cleanser", PREVIEW);
  hasReason(result, "product_not_reviewed");
  assert.equal(result.evidence_type, "insufficient_evidence");
  assert.equal(result.review_status, "not_reviewed");
  assert.deepEqual(result.approved_claim_ids, []);
});

test("unknown products and prototype-key IDs never resolve to catalog defaults", () => {
  for (const id of ["invented-centella-cream", "__proto__", "constructor", "toString", null, {}]) {
    hasReason(engine().assess(id, PREVIEW), "unknown_product_id");
  }
});

test("missing or unsupported concerns cannot inherit hydration claims", () => {
  hasReason(engine().assess(SKIN, { mode: "preview", asOf: PREVIEW.asOf }), "concern_required");
  for (const concern of ["acne", "pigmentation", "wrinkles", "hair_growth", "dermatitis"]) {
    hasReason(engine().renderClaim(SKIN, SKIN_CLAIM, { ...PREVIEW, concern }), "concern_not_supported");
  }
});

test("claim IDs are bound to products and cannot be invented or crossed", () => {
  hasReason(engine().getClaim(SKIN, "a-claim-the-model-invented", PREVIEW), "unknown_claim_id");
  hasReason(engine().getClaim(SKIN, ILLIYOON_CLAIM, PREVIEW), "claim_product_mismatch");
  hasReason(engine().getClaim(ILLIYOON, SKIN_CLAIM, PREVIEW), "claim_product_mismatch");
});

test("a label edit cannot promote indirect research to finished-product evidence", () => {
  for (const type of ["finished_product_human_study", "preclinical_research"]) {
    const data = fixture();
    data.products.find((product) => product.product_id === SKIN).evidence_type = type;
    hasReason(engine(data).assess(SKIN, PREVIEW), "evidence_type_not_supported_by_runtime");
  }
  const data = fixture();
  data.products.find((product) => product.product_id === SKIN).product_efficacy_established = true;
  hasReason(engine(data).assess(SKIN, PREVIEW), "unsupported_product_efficacy_promotion");
});

test("quantitative product claims, changed claim scopes, and exact-formula upgrades are blocked", () => {
  const quantitative = fixture();
  quantitative.claims[0].quantitative_product_claim = true;
  hasReason(engine(quantitative).assess(SKIN, PREVIEW), "quantitative_product_claim_not_supported");
  const scope = fixture();
  scope.claims[0].claim_scope = "finished_product_efficacy";
  hasReason(engine(scope).assess(SKIN, PREVIEW), "claim_scope_not_supported_by_runtime");
  const direct = fixture();
  direct.products[0].evidence_links[0].direct_product_match = true;
  direct.products[0].evidence_links[0].formulation_match = "exact";
  hasReason(engine(direct).assess(SKIN, PREVIEW), "unsupported_study_correspondence");
});

test("review expiry and superseded sources prevent rendering", () => {
  const expired = engine().renderClaim(SKIN, SKIN_CLAIM, { ...PREVIEW, asOf: "2027-02-26" });
  hasReason(expired, "dataset_review_expired");
  assert.equal(expired.text, null);
  const data = fixture();
  data.sources.find((source) => source.id === "pubmed-34214362").status = "superseded";
  hasReason(engine(data).assess(SKIN, PREVIEW), "source_not_active");
});

test("record-specific dates and revoked claim status are checked", () => {
  const mutations = [
    ["formulation_review_expired", (data) => { data.formulations[0].verified_on = "2026-10-01"; data.formulations[0].review_due = "2026-11-26"; }],
    ["claim_review_expired", (data) => { data.claims[0].reviewed_on = "2026-10-01"; data.claims[0].review_due = "2026-11-26"; }],
    ["study_review_expired", (data) => { data.studies[0].reviewed_on = "2026-10-01"; data.studies[0].review_due = "2026-11-26"; }],
    ["product_review_expired", (data) => { data.products[0].reviewed_on = "2026-10-01"; data.products[0].review_due = "2026-11-26"; }],
    ["claim_not_reviewed", (data) => { data.claims[0].review_status = "revoked"; }],
    ["source_not_verified_as_of_date", (data) => { data.sources[0].accessed_on = "2026-11-28"; }]
  ];
  for (const [reason, mutate] of mutations) {
    const data = fixture();
    mutate(data);
    hasReason(engine(data).assess(SKIN, PREVIEW), reason);
  }
});

test("past evaluation, malformed dates, and invalid modes fail closed", () => {
  hasReason(engine().assess(SKIN, { ...PREVIEW, asOf: "2026-11-26" }), "dataset_not_reviewed_as_of_date");
  hasReason(engine().assess(SKIN, { ...PREVIEW, asOf: "2026-02-30" }), "invalid_as_of");
  hasReason(engine().assess(SKIN, { ...PREVIEW, mode: "force" }), "invalid_mode");
});

test("known ingredient allergy matching is normalized but never generalized to safety", () => {
  const matched = engine().assess(SKIN, { ...PREVIEW, knownAllergens: ["  CENTELLA   ASIATICA EXTRACT "] });
  hasReason(matched, "known_allergen_match");
  assert.equal(matched.allergy_screening.status, "known_allergen_exact_match");
  const absent = engine().assess(SKIN, { ...PREVIEW, knownAllergens: ["Ceramide NP"] });
  assert.equal(absent.eligible, true);
  assert.equal(absent.allergy_screening.status, "no_exact_match_in_listed_inci");
  assert.match(absent.allergy_screening.limitation, /not comprehensive/u);
});

test("aliases, free-text allergy notes, partial lists and ambiguous formulas require review", () => {
  for (const allergen of ["cica", "I reacted to a moisturizer", "glycerol"]) {
    hasReason(engine().assess(SKIN, { ...PREVIEW, knownAllergens: [allergen] }), "allergen_name_requires_review");
  }
  hasReason(engine().assess(ILLIYOON, { ...PREVIEW, knownAllergens: ["Ceramide NP"] }), "allergy_screening_requires_review");
  const data = fixture();
  data.formulations[0].inci_is_complete = false;
  hasReason(engine(data).assess(SKIN, { ...PREVIEW, knownAllergens: ["Ceramide NP"] }), "allergy_screening_requires_review");
});

test("a caller cannot replace the active formulation or override approved wording", () => {
  hasReason(engine().assess(SKIN, { ...PREVIEW, formulationId: seed.formulations[1].id }), "formulation_id_mismatch");
  hasReason(engine().renderClaim(SKIN, SKIN_CLAIM, { ...PREVIEW, text: "Clinically proven to cure acne", mandatory_caveat: "" }), "unsupported_options");
  hasReason(engine().assess(SKIN, { ...PREVIEW, knownAllergens: "none" }), "invalid_known_allergens");
  hasReason(engine().assess(SKIN, { ...PREVIEW, knownAllergens: null }), "invalid_known_allergens");
});

test("catalog drift, duplicate IDs and missing current-catalog input are configuration errors", () => {
  const data = fixture();
  assert.throws(() => engine(data, data.catalog.product_ids.slice(1)), EvidenceRegistryError);
  assert.throws(() => engine(data, [...data.catalog.product_ids, data.catalog.product_ids[0]]), EvidenceRegistryError);
  assert.throws(() => createEvidenceEngine(data), EvidenceRegistryError);
  data.claims.push(structuredClone(data.claims[0]));
  assert.throws(() => engine(data), /duplicate/u);
});

test("missing sources, studies and outcome references are configuration errors", () => {
  const changes = [
    (data) => { data.claims[0].source_ids.push("missing-source"); },
    (data) => { data.claims[0].study_ids.push("missing-study"); },
    (data) => { data.products[0].evidence_links[0].outcome_ids.push("invented-outcome"); },
    (data) => { data.products[0].evidence_links[0].outcome_ids = []; },
    (data) => { data.claims[0].source_ids.push("catalog-pr5"); }
  ];
  for (const change of changes) { const data = fixture(); change(data); assert.throws(() => engine(data), EvidenceRegistryError); }
});

test("every study, product and claim requires explicit review dates", () => {
  for (const section of ["studies", "products", "claims"]) {
    for (const field of ["reviewed_on", "review_due"]) {
      const data = fixture(); delete data[section][0][field];
      assert.throws(() => engine(data), /reviewed_on and review_due/u, `${section}.${field}`);
    }
  }
});

test("study outcome and intervention arrays are mandatory, nonempty and uniquely identified", () => {
  for (const field of ["outcomes", "interventions"]) {
    const missing = fixture(); delete missing.studies[0][field];
    assert.throws(() => engine(missing), EvidenceRegistryError, `missing ${field}`);
    const empty = fixture(); empty.studies[0][field] = [];
    assert.throws(() => engine(empty), /nonempty/u, `empty ${field}`);
    const duplicate = fixture(); duplicate.studies[0][field].push(structuredClone(duplicate.studies[0][field][0]));
    assert.throws(() => engine(duplicate), /duplicate/u, `duplicate ${field}`);
  }
  const wrongIntervention = fixture(); wrongIntervention.studies[0].outcomes[0].intervention_id = "unrelated-intervention";
  assert.throws(() => engine(wrongIntervention), /missing intervention/u);
});

test("study outcomes, reporting issues and funding must cite their own existing study sources", () => {
  const targets = [
    (data) => data.studies[0].outcomes[0],
    (data) => data.studies[0].reporting_issues[0],
    (data) => data.studies[0].funding
  ];
  for (const target of targets) {
    for (const sourceId of ["missing-source", "catalog-pr5"]) {
      const data = fixture(); target(data).source_ids = [sourceId];
      assert.throws(() => engine(data), EvidenceRegistryError);
    }
    const missing = fixture(); delete target(missing).source_ids;
    assert.throws(() => engine(missing), EvidenceRegistryError);
  }
});

test("catalog provenance and research-queue references are checked even though they do not grant claims", () => {
  const changes = [
    (data) => { data.products[0].catalog_source_ids = ["missing-source"]; },
    (data) => { data.products[0].catalog_retailer_source_id = "missing-source"; },
    (data) => { data.research_queue[0].source_ids = ["missing-source"]; },
    (data) => { data.research_queue[0].product_ids = ["invented-product"]; },
    (data) => { delete data.research_queue; },
    (data) => { data.research_queue.push(structuredClone(data.research_queue[0])); }
  ];
  for (const change of changes) { const data = fixture(); change(data); assert.throws(() => engine(data), EvidenceRegistryError); }
});

test("unrecognized schema versions and source/review statuses are configuration errors", () => {
  for (const version of ["1", "1.0", "1.999.0", "2.0.0"]) {
    const data = fixture(); data.schema_version = version;
    assert.throws(() => engine(data), /unsupported schema_version/u);
  }
  const source = fixture(); source.sources[0].status = "probably-active";
  assert.throws(() => engine(source), /valid date and status/u);
  const review = fixture(); review.studies[0].review_status = "looks-good";
  assert.throws(() => engine(review), /valid review_status/u);
});

test("cross-product formulation and claim links are configuration errors", () => {
  const formulation = fixture();
  formulation.products[0].formulation_ids.push(formulation.formulations[1].id);
  assert.throws(() => engine(formulation), /another product's formulation/u);
  const claim = fixture();
  claim.products[0].claim_ids.push(ILLIYOON_CLAIM);
  assert.throws(() => engine(claim), /another product's claim/u);
});

test("unsafe source URLs and prototype-bearing JSON cannot enter the engine", () => {
  for (const url of ["javascript:alert(1)", "http://example.test", "https://user:password@example.test"]) {
    const data = fixture(); data.sources[0].url = url;
    assert.throws(() => engine(data), /HTTPS URL/u);
  }
  const data = fixture();
  data.untrusted = JSON.parse('{"__proto__":{"polluted":true}}');
  assert.throws(() => engine(data), /unsafe property/u);
  assert.equal({}.polluted, undefined);
  hasReason(engine().assess(SKIN, Object.create({ mode: "preview", concern: "hydration" })), "invalid_options");
});

test("engine snapshots isolate subsequent caller changes and returned data mutations", () => {
  const data = fixture(); const instance = engine(data);
  data.claims[0].text = "The model's unsupported claim";
  const result = instance.renderClaim(SKIN, SKIN_CLAIM, PREVIEW);
  assert.ok(!result.text.includes("unsupported claim"));
  result.claim.mandatory_caveat = "";
  result.sources[0].url = "https://unrelated.example";
  const again = instance.renderClaim(SKIN, SKIN_CLAIM, PREVIEW);
  assert.equal(again.claim.mandatory_caveat, seed.claims[0].mandatory_caveat);
  assert.equal(again.sources[0].url, seed.sources[0].url);
});

test("only explicitly approved dataset and records can become publishable", () => {
  const data = fixture(); data.review.status = "approved";
  hasReason(engine(data).assess(SKIN, { concern: "hydration", asOf: PREVIEW.asOf }), "product_not_reviewed");
  for (const section of [data.products, data.studies, data.claims]) for (const record of section) record.review_status = "approved";
  const result = engine(data).renderClaim(SKIN, SKIN_CLAIM, { concern: "hydration", asOf: PREVIEW.asOf });
  assert.equal(result.publishable, true);
  assert.ok(result.text.endsWith(seed.claims[0].mandatory_caveat));
  assert.equal(engine(data).renderClaim(SKIN, SKIN_CLAIM, PREVIEW).publishable, false, "preview is never publishable");
});

test("model context contains only permitted deterministic claims, with blocked IDs explained", () => {
  const context = engine().buildModelContext([SKIN, ILLIYOON, "cosrx-lowph-cleanser", "invented-product", SKIN], PREVIEW);
  assert.equal(context.candidates.length, 1);
  assert.equal(context.blocked.length, 3);
  assert.equal(context.publishable, false);
  assert.equal(context.candidates[0].claims[0].claim_id, SKIN_CLAIM);
  assert.ok(context.candidates[0].claims[0].text.endsWith(seed.claims[0].mandatory_caveat));
  for (const forbidden of ["ratingCount", "retailer", "price", "viral", "efficacy_score"]) assert.equal(Object.hasOwn(context.candidates[0], forbidden), false);
  assert.deepEqual(engine().buildModelContext([], PREVIEW).candidates, []);
  assert.deepEqual(engine().buildModelContext(["__proto__"], PREVIEW).reasons, ["invalid_product_ids"]);
});
