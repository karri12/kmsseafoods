// Unit verification test suite for KMS Sea Foods calculation & number to words engine

import assert from 'node:assert';
import { calculateWeight, calculateRowAmount, splitRupeesAndPaise, formatIndianCurrency } from '../src/utils/calculator.ts';
import { numberToIndianWords } from '../src/utils/numberToWords.ts';

console.log('--- RUNNING KMS SEA FOODS ENGINE TESTS ---');

// Test 1: Weight calculation
const weight1 = calculateWeight(1340, 200);
console.log(`Test 1: 1340 kg + 200 gms = ${weight1} kg`);
assert.strictEqual(weight1, 1340.200);

// Test 2: Amount calculation
const amount1 = calculateRowAmount(weight1, 153);
console.log(`Test 2: 1340.200 kg * 153 = ₹${amount1}`);
assert.strictEqual(amount1, 205050.60);

// Test 3: Split Rs and Ps
const { rs, ps } = splitRupeesAndPaise(amount1);
console.log(`Test 3: Split ₹205050.60 -> Rs. ${rs}, Ps. ${ps}`);
assert.strictEqual(rs, 205050);
assert.strictEqual(ps, 60);

// Test 4: Indian currency words
const words1 = numberToIndianWords(amount1);
console.log(`Test 4: Currency Words -> "${words1}"`);
assert.strictEqual(words1, 'Rupees Two Lakh Five Thousand Fifty and Sixty Paise Only');

// Test 5: Edge cases
const weight2 = calculateWeight('', '');
assert.strictEqual(weight2, 0);

const amount2 = calculateRowAmount(0, 150);
assert.strictEqual(amount2, 0);

const words2 = numberToIndianWords(0);
assert.strictEqual(words2, 'Rupees Zero Only');

const words3 = numberToIndianWords(100500);
console.log(`Test 6: ₹100,500 -> "${words3}"`);
assert.strictEqual(words3, 'Rupees One Lakh Five Hundred Only');

console.log('✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
