"""Validate the registry plus critical rejection cases; no network access.

Development dependency: jsonschema>=4.22,<5
"""

import copy
import json
from pathlib import Path

try:
    from jsonschema import Draft202012Validator, FormatChecker
except ImportError as exc:
    raise SystemExit("Install the optional development dependency: python3 -m pip install 'jsonschema>=4.22,<5'") from exc

ROOT = Path(__file__).resolve().parent
schema = json.loads((ROOT / 'meemo-evidence.schema.json').read_text())
registry = json.loads((ROOT / 'meemo-evidence.v1.json').read_text())
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema, format_checker=FormatChecker())
errors = sorted(validator.iter_errors(registry), key=lambda error: str(list(error.path)))
if errors:
    for error in errors:
        print('/'.join(map(str, error.path)) + ': ' + error.message)
    raise SystemExit(1)

def reject(label, mutate):
    candidate = copy.deepcopy(registry)
    mutate(candidate)
    if validator.is_valid(candidate):
        raise AssertionError('Schema unexpectedly accepted: ' + label)
    return label

checks = [
    reject('unknown concentration replaced with a measured zero',
           lambda data: data['formulations'][0]['concentrations'][0].update(value=0)),
    reject('ingredient study promoted to product efficacy',
           lambda data: data['products'][0].update(product_efficacy_established=True)),
    reject('ingredient claim gains a quantitative product promise',
           lambda data: data['claims'][0].update(quantitative_product_claim=True)),
    reject('invalid calendar date',
           lambda data: data['review'].update(reviewed_on='2026-02-30')),
    reject('unsupported evidence category',
           lambda data: data['products'][0].update(evidence_type='viral_and_clinically_proven')),
    reject('invented precision outside the schema',
           lambda data: data['products'][0].update(efficacy_score=99)),
    reject('unresolved formula assigned an active version',
           lambda data: data['products'][1].update(active_formulation_id=data['formulations'][1]['id'])),
    reject('finished-product grade without an exact study link',
           lambda data: data['products'][0].update(evidence_type='finished_product_human_study')),
]
print('PASS: JSON Schema 2020-12 and registry; ' + str(len(checks)) + ' negative validation checks.')
