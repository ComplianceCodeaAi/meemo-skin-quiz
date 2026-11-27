import { readFileSync } from 'node:fs';
import { createEvidenceEngine } from './runtime.mjs';

const registry = JSON.parse(readFileSync(new URL('./meemo-evidence.v1.json', import.meta.url), 'utf8'));
const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const catalog = app.match(/const CATALOG = \[([\s\S]*?)\n\];/u);
if (!catalog) throw new Error('Current catalog could not be located. Supply its actual ID list.');
const currentCatalogIds = [...catalog[1].matchAll(/\bid:\s*"([^"]+)"/gu)].map(match => match[1]);
const engine = createEvidenceEngine(registry, currentCatalogIds);
const preview = { mode: 'preview', concern: 'hydration', asOf: '2026-11-27' };

const cases = {
  note: 'Fixed-date editorial preview, not live recommendations. No network calls or messages.',
  ingredient_context: engine.renderClaim('skin1004-centella-ampoule', 'skin1004-indirect-hydration-context', preview),
  formula_conflict: engine.assess('illiyoon-ceramide-cream', preview),
  unreviewed_catalog_product: engine.assess('cosrx-lowph-cleanser', preview),
  unsupported_acne_claim: engine.renderClaim('skin1004-centella-ampoule', 'skin1004-indirect-hydration-context', { ...preview, concern: 'acne' }),
  production_gate: engine.renderClaim('skin1004-centella-ampoule', 'skin1004-indirect-hydration-context', { concern: 'hydration', asOf: preview.asOf })
};
console.log(JSON.stringify(cases, null, 2));
