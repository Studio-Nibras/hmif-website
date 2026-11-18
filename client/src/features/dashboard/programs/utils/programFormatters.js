export function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return "Tanggal belum ditentukan";

  if (startDate && endDate) {
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  }

  if (startDate) return `Mulai ${formatDate(startDate)}`;

  return `Sampai ${formatDate(endDate)}`;
}
