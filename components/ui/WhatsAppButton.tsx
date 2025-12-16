import { buildWhatsAppLink } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  phoneNumber?: string;
  message?: string;
  label?: string;
  className?: string;
  id?: string;
};

export function WhatsAppButton({
  phoneNumber = "05416356485",
  message = "Merhaba, Tatlı Bahçe'den sipariş vermek istiyorum.",
  label = "WhatsApp ile sipariş ver",
  className = "",
  id,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(phoneNumber, message);

  return (
    <a
      id={id}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-primary/40 transition hover:bg-primary-soft ${className}`}
    >
      <span className="text-lg">🟢</span>
      <span>{label}</span>
    </a>
  );
}


