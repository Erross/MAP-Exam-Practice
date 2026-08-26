import assert from 'node:assert/strict';
import { BANKS } from '../js/banks.js';

const RARE_TYPES = ['matching_table','drag_drop','number_line','angle_input','coordinate_line','line_plot','clock_input','hotspot'];
const found = new Map(RARE_TYPES.map(type => [type, []]));
for (const [assessmentId, bank] of Object.entries(BANKS)) {
  for (const item of bank) if (found.has(item.itemType)) found.get(item.itemType).push({ assessmentId, item });
}

for (const type of RARE_TYPES) {
  const entries = found.get(type);
  assert(entries.length > 0, `${type}: expected at least one browser-effective item`);
  for (const { assessmentId, item } of entries) {
    assert(item.prompt?.trim(), `${item.id}: ${type} prompt missing`);
    if (type === 'matching_table') {
      assert((item.rows?.length ?? 0) >= 2, `${item.id}: matching_table needs rows`);
      assert((item.columns?.length ?? 0) >= 2, `${item.id}: matching_table needs columns`);
      assert.equal(Object.keys(item.scoring?.matches ?? {}).length, item.rows.length, `${item.id}: matching_table scoring must cover every row`);
    } else if (type === 'drag_drop') {
      const choices = item.tokens ?? item.options ?? [];
      assert(choices.length >= 2, `${item.id}: drag_drop needs at least two tokens`);
      assert(Array.isArray(item.scoring?.order), `${item.id}: drag_drop needs an explicit scoring order`);
      assert.equal(item.scoring.order.length, choices.length, `${item.id}: drag_drop order must use every token`);
      assert.equal(new Set(item.scoring.order).size, choices.length, `${item.id}: drag_drop order must not repeat tokens`);
    } else if (type === 'number_line' || type === 'angle_input') {
      assert.equal(typeof item.scoring?.answer, 'number', `${item.id}: ${type} needs a numeric key`);
    } else if (type === 'coordinate_line') {
      for (const key of ['x1','y1','x2','y2']) assert.equal(typeof item.scoring?.answer?.[key], 'number', `${item.id}: coordinate_line ${key} missing`);
    } else if (type === 'line_plot') {
      assert((item.fields?.length ?? 0) >= 2, `${item.id}: line_plot needs labeled values`);
      assert(Array.isArray(item.scoring?.answer), `${item.id}: line_plot needs count array`);
      assert.equal(item.scoring.answer.length, item.fields.length, `${item.id}: line_plot counts must match fields`);
    } else if (type === 'clock_input') {
      assert(Number.isInteger(item.scoring?.answer?.hour), `${item.id}: clock hour missing`);
      assert(Number.isInteger(item.scoring?.answer?.minute), `${item.id}: clock minute missing`);
    } else if (type === 'hotspot') {
      const regions = item.regions ?? item.options ?? [];
      assert(regions.length >= 2, `${item.id}: hotspot needs at least two selectable regions`);
      assert(regions.includes(item.scoring?.answer), `${item.id}: hotspot key must identify one selectable region`);
    }
  }
  const examples = entries.slice(0, 3).map(({assessmentId,item}) => `${assessmentId}/${item.id}: ${item.prompt}`).join(' | ');
  console.log(`${type}: ${entries.length} item(s). ${examples}`);
}
console.log('PASS: rare MAP interaction types have complete source-side response/scoring surfaces suitable for dedicated rendering.');
