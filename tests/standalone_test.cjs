const assert = require('assert');

// 1. Calculator functions
function calculateWeight(kgs, gms) {
  const k = typeof kgs === 'number' && kgs >= 0 ? kgs : 0;
  const g = typeof gms === 'number' && gms >= 0 ? gms : 0;
  const totalWeight = k + (g / 1000);
  return Math.round(totalWeight * 1000) / 1000;
}

function calculateRowAmount(weight, rate) {
  const r = typeof rate === 'number' && rate >= 0 ? rate : 0;
  const totalAmount = weight * r;
  return Math.round(totalAmount * 100) / 100;
}

function splitRupeesAndPaise(amount) {
  const roundedAmount = Math.round(amount * 100) / 100;
  const rs = Math.floor(roundedAmount);
  const ps = Math.round((roundedAmount - rs) * 100);
  return { rs, ps };
}

// 2. Number to Indian Words
const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertLessThanThousand(n) {
  let str = '';
  if (n >= 100) {
    str += units[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += tens[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += units[n] + ' ';
  }
  return str.trim();
}

function numberToIndianWords(num) {
  if (isNaN(num) || num < 0) return 'Zero';
  if (num === 0) return 'Zero';

  const rounded = Math.round(num * 100) / 100;
  const rs = Math.floor(rounded);
  const ps = Math.round((rounded - rs) * 100);

  let words = '';

  if (rs === 0) {
    words = 'Zero';
  } else {
    let n = rs;
    const crores = Math.floor(n / 10000000);
    if (crores > 0) {
      words += numberToIndianWords(crores) + ' Crore ';
      n %= 10000000;
    }
    const lakhs = Math.floor(n / 100000);
    if (lakhs > 0) {
      words += convertLessThanThousand(lakhs) + ' Lakh ';
      n %= 100000;
    }
    const thousands = Math.floor(n / 1000);
    if (thousands > 0) {
      words += convertLessThanThousand(thousands) + ' Thousand ';
      n %= 1000;
    }
    if (n > 0) {
      words += convertLessThanThousand(n);
    }
  }

  words = words.trim();
  let finalResult = `Rupees ${words}`;
  if (ps > 0) {
    const psWords = convertLessThanThousand(ps);
    finalResult += ` and ${psWords} Paise`;
  }
  finalResult += ' Only';
  return finalResult;
}

console.log('--- EXECUTING STANDALONE ALGORITHM VERIFICATION ---');

// Test 1: User's prompt example (1340 kg + 200 gms = 1340.200 kg)
const w = calculateWeight(1340, 200);
console.log(`[TEST 1] Weight = ${w} kg`);
assert.strictEqual(w, 1340.2);

// Test 2: User's prompt example (1340.200 * 153 = 205050.60)
const amt = calculateRowAmount(w, 153);
console.log(`[TEST 2] Amount = ₹${amt}`);
assert.strictEqual(amt, 205050.6);

// Test 3: Rs and Ps split
const { rs, ps } = splitRupeesAndPaise(amt);
console.log(`[TEST 3] Rs = ${rs}, Ps = ${ps}`);
assert.strictEqual(rs, 205050);
assert.strictEqual(ps, 60);

// Test 4: Indian currency words
const words = numberToIndianWords(amt);
console.log(`[TEST 4] Words = "${words}"`);
assert.strictEqual(words, 'Rupees Two Lakh Five Thousand Fifty and Sixty Paise Only');

console.log('✅ ALL STANDALONE VERIFICATION TESTS PASSED!');
