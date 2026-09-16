const fcfa = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export function formatFCFA(amount: number): string {
  return `${fcfa.format(amount)} FCFA`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
