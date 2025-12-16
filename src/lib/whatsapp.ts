export function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function buildWhatsAppLink(phone: string, message: string) {
  const normalized = normalizePhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${normalized}&text=${encoded}`;
}


