export function getCurrentDateFormatted() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeFormatted() {
  const d = new Date();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

export function formatReadableDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generates an array of bar widths to render a clean barcode pattern from a string
 */
export function generateBarcodePattern(text) {
  if (!text) return [];
  // Deterministic bar widths based on char codes
  const widths = [];
  widths.push(2, 1, 2); // Start guard
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    widths.push((code % 3) + 1);
    widths.push(((code >> 2) % 2) + 1);
    widths.push(((code >> 3) % 3) + 1);
    widths.push(1); // spacer
  }
  widths.push(2, 1, 2); // Stop guard
  return widths;
}
