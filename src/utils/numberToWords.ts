const units = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(n: number): string {
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

/**
 * Converts a number to words following the Indian Numbering System.
 * Scales: Thousand, Lakh, Crore.
 */
export function numberToIndianWords(num: number): string {
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

    // Crores (1,00,00,000)
    const crores = Math.floor(n / 10000000);
    if (crores > 0) {
      words += numberToIndianWords(crores) + ' Crore ';
      n %= 10000000;
    }

    // Lakhs (1,00,000)
    const lakhs = Math.floor(n / 100000);
    if (lakhs > 0) {
      words += convertLessThanThousand(lakhs) + ' Lakh ';
      n %= 100000;
    }

    // Thousands (1,000)
    const thousands = Math.floor(n / 1000);
    if (thousands > 0) {
      words += convertLessThanThousand(thousands) + ' Thousand ';
      n %= 1000;
    }

    // Remaining hundreds and below
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
