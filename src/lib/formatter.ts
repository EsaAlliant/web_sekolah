export function formatDate(value: Date | string, locale = "id-ID") { return new Intl.DateTimeFormat(locale).format(new Date(value)); }
