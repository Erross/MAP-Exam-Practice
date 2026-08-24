import assert from 'node:assert/strict';
import fs from 'node:fs';

import { BANKS } from '../js/banks.js';
import { ATTEMPT_VERSION, materializeItems, newAttempt } from '../js/core/session.js';

const dragItems = Object.values(BANKS).flat().filter(item => item.itemType === 'drag_drop');
assert.equal(dragItems.length, 3, 'expected the three released MAP ordering items');
assert.equal(ATTEMPT_VERSION, 3, 'token-presentation persistence requires attempt schema v3');

const attempt = newAttempt('ordering-fixture', 1, dragItems, () => 0);
assert.equal(Object.keys(attempt.tokenOrders).length, dragItems.length, 'every ordering item must persist a token permutation');

const displayed = materializeItems(dragItems, attempt);
for (let index = 0; index < dragItems.length; index += 1) {
  const source = dragItems[index];
  const materialized = displayed[index];
  assert.deepEqual(new Set(materialized.tokens), new Set(source.tokens), `${source.id}: materialized tokens must preserve the semantic token set`);
  assert.notDeepEqual(materialized.tokens, source.tokens, `${source.id}: deterministic fixture should visibly reorder source tokens`);
  assert.deepEqual(materializeItems([source], attempt)[0].tokens, materialized.tokens, `${source.id}: resume must reproduce the exact token order`);
}

const renderer = fs.readFileSync(new URL('../js/renderers.js', import.meta.url), 'utf8');
const start = renderer.indexOf('function ordering(');
const end = renderer.indexOf('\nfunction dataEntry', start);
assert(start >= 0 && end > start, 'ordering renderer missing');
const ordering = renderer.slice(start, end);
assert.match(ordering, /new Set\(current\)\.size===tokens\.length/, 'saved ordering response must be a token permutation');
assert.match(ordering, /Move .* earlier/);
assert.match(ordering, /Move .* later/);
assert.match(ordering, /Use this order/);
assert.doesNotMatch(ordering, /createElement\("select"\)/, 'ordering must not use duplicate-permitting position dropdowns');

console.log('PASS: drag/drop ordering tokens are deterministically randomized, persisted across resume, and edited as a permutation-only sequence.');
