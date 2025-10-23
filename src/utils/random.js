// Gjeneron numër me gjatësi fikse shifrash
export function randomDigits(digit) {
  const d = Math.max(1, Math.min(10, digit));
  const first = Math.floor(Math.random() * 9) + 1; // 1..9 (pa 0 në fillim)
  let s = String(first);
  for (let i = 1; i < d; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export function generateNumber(settings, isFirstNumber = false) {
  let number = randomDigits(settings.digit);

  // Numri i parë nuk duhet të jetë kurrë negativ
  if (settings.negativeShow && !isFirstNumber && Math.random() < 0.3) {
    number = '-' + number;
  }

  if (settings.decimalShow) {
    const len = Math.max(1, Math.min(6, settings.decimalLength));
    const max = 10 ** len;
    const n = Math.floor(Math.random() * max);
    const decimalPart = String(n).padStart(len, '0'); // p.sh. 2 shifra: 05
    number += '.' + decimalPart;
  }

  return number;
}

export function pickRandomBeads(beads, count) {
  const copy = beads.slice();
  // shuffle i thjeshtë (Fisher-Yates)
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}
