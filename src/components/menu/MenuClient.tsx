"use client";

import { useMemo, useState } from "react";
import type { MenuTreeItem } from "@/src/lib/queries/menu";
import type { Locale } from "@/src/lib/i18n/config";
import { WhatsAppButton } from "@/src/components/ui/WhatsAppButton";

type MenuClientProps = {
  tree: MenuTreeItem[];
  locale: Locale;
  whatsappPhone: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
};

const SUBCATEGORY_ICONS: Record<string, string> = {
  kahvalti: "🍳",
  breakfast: "🍳",
  corba: "🥣",
  soup: "🥣",
  izgara: "🍖",
  grill: "🍖",
  burger: "🍔",
  pizza: "🍕",
  meze: "🥗",
  salad: "🥗",
  salata: "🥗",
  tatli: "🍰",
  dessert: "🍰",
  icecek: "🥤",
  drinks: "🥤",
  beverage: "🥤",
  makarna: "🍝",
  pasta: "🍝",
  doner: "🥙",
  pide: "🥙",
};

function getSubcategoryIcon(subcategory: { slug?: string; name?: string }) {
  const key = (subcategory.slug ?? subcategory.name ?? "").toLowerCase();
  return SUBCATEGORY_ICONS[key] ?? "📌";
}

function formatPrice(value: number) {
  return `${value.toLocaleString("tr-TR")} TL`;
}

export function MenuClient({ tree, locale, whatsappPhone }: MenuClientProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    tree[0]?.category.id ?? null,
  );
  const [cart, setCart] = useState<Record<string, number>>({});

  const allProducts = useMemo(() => {
    const items: CartItem[] = [];
    for (const { category, subcategories, uncategorizedProducts } of tree) {
      for (const { products } of subcategories) {
        for (const p of products) {
          items.push({
            id: p.id,
            name: p.name,
            price: p.discount_price ?? p.price,
          });
        }
      }
      for (const p of uncategorizedProducts) {
        items.push({
          id: p.id,
          name: p.name,
          price: p.discount_price ?? p.price,
        });
      }
    }
    return items;
  }, [tree]);

  const cartSummary = useMemo(() => {
    let total = 0;
    let count = 0;
    const detailed: { id: string; name: string; qty: number; lineTotal: number }[] =
      [];

    for (const [id, qty] of Object.entries(cart)) {
      if (!qty) continue;
      const product = allProducts.find((p) => p.id === id);
      if (!product) continue;
      const lineTotal = product.price * qty;
      total += lineTotal;
      count += qty;
      detailed.push({
        id,
        name: product.name,
        qty,
        lineTotal,
      });
    }

    return { total, count, detailed };
  }, [allProducts, cart]);

  function addToCart(productId: string) {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) + 1,
    }));
  }

  function decreaseFromCart(productId: string) {
    setCart((prev) => {
      const current = prev[productId] ?? 0;
      if (current <= 1) {
        const { [productId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: current - 1 };
    });
  }

  function getQty(productId: string) {
    return cart[productId] ?? 0;
  }

  function buildCartMessage() {
    if (cartSummary.count === 0) {
      return (
        locale === "tr"
          ? "Merhaba, Tatlı Bahçe'den sipariş vermek istiyorum."
          : "Hello, I would like to order from Tatlı Bahçe."
      );
    }

    const headerTr = "Merhaba, Tatlı Bahçe'den sipariş vermek istiyorum.\n\nÜrünler:\n";
    const headerEn =
      "Hello, I would like to order from Tatlı Bahçe.\n\nItems:\n";

    const header = locale === "tr" ? headerTr : headerEn;

    const lines = cartSummary.detailed.map((item) => {
      const base = `- ${item.name} x${item.qty}`;
      const priceText = ` ~ ${formatPrice(item.lineTotal)}`;
      return `${base}${priceText}`;
    });

    const totalLineTr = `\nToplam yaklaşık: ${formatPrice(cartSummary.total)}`;
    const totalLineEn = `\nApprox. total: ${formatPrice(cartSummary.total)}`;

    return header + lines.join("\n") + (locale === "tr" ? totalLineTr : totalLineEn);
  }

  const cartMessage = buildCartMessage();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">
          {locale === "tr" ? "Menü" : "Menu"}
        </h1>
        <p className="max-w-2xl text-sm text-zinc-700 md:text-base">
          {locale === "tr"
            ? "Tatlı Bahçe'de güne kahvaltıyla başlayabilir, ızgara çeşitlerimizle devam edip ev yapımı tatlılarımızla günü tatlıya bağlayabilirsiniz."
            : "Start your day with breakfast, continue with our grilled dishes and finish with homemade desserts at Tatlı Bahçe."}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {tree.map(({ category }) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategoryId(category.id)}
            className={`rounded-full border px-4 py-2 text-xs font-medium shadow-sm transition ${
              activeCategoryId === category.id
                ? "border-primary bg-primary text-white shadow-primary/40"
                : "border-primary/30 bg-white text-zinc-800 hover:border-primary hover:bg-primary/10"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {tree
          .filter(
            ({ category }) =>
              !activeCategoryId || category.id === activeCategoryId,
          )
          .map(({ category, subcategories, uncategorizedProducts }) => (
            <section
              key={category.id}
              className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {category.name}
                  </h2>
                  {category.description ? (
                    <p className="text-xs text-zinc-500">
                      {category.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <ul className="divide-y divide-zinc-100">
                {subcategories.map(({ subcategory, products }) => (
                  <li key={subcategory.id} className="py-3 first:pt-1 last:pb-1">
                    <div className="flex items-center gap-2">
                      <span aria-hidden className="text-lg">
                        {getSubcategoryIcon(subcategory)}
                      </span>
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {subcategory.name}
                      </h3>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {subcategory.description}
                    </p>
                    <ul className="mt-2 divide-y divide-zinc-100">
                      {products.map((item) => {
                        const qty = getQty(item.id);
                        return (
                          <li
                            key={item.id}
                            className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between"
                          >
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-zinc-900 md:text-base">
                                  {item.name}
                                </p>
                                {item.is_featured ? (
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                                    {locale === "tr"
                                      ? "En çok tercih edilen"
                                      : "Most popular"}
                                  </span>
                                ) : null}
                                {!item.is_available ? (
                                  <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                                    {locale === "tr"
                                      ? "Şu an mevcut değil"
                                      : "Currently unavailable"}
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 max-w-xl text-xs text-zinc-600 md:text-sm">
                                {item.short_description ?? item.description}
                              </p>
                            </div>

                            <div className="flex flex-col items-start gap-2 md:items-end">
                              <span className="rounded-full bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
                                {formatPrice(item.discount_price ?? item.price)}
                              </span>
                              <div className="flex items-center gap-2">
                                {qty > 0 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => decreaseFromCart(item.id)}
                                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:border-primary hover:text-primary"
                                    >
                                      -
                                    </button>
                                    <span className="text-xs font-semibold text-zinc-700">
                                      {qty}
                                    </span>
                                  </>
                                )}
                                <button
                                  type="button"
                                  onClick={() => addToCart(item.id)}
                                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-primary/40 hover:bg-primary-soft"
                                >
                                  {qty > 0
                                    ? locale === "tr"
                                      ? "Bir tane daha ekle"
                                      : "Add one more"
                                    : locale === "tr"
                                      ? "Sepete ekle"
                                      : "Add to cart"}
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}

                {uncategorizedProducts.map((item) => {
                  const qty = getQty(item.id);
                  return (
                    <li
                      key={item.id}
                      className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-zinc-900 md:text-base">
                            {item.name}
                          </p>
                          {item.is_featured ? (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                              {locale === "tr"
                                ? "En çok tercih edilen"
                                : "Most popular"}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 max-w-xl text-xs text-zinc-600 md:text-sm">
                          {item.short_description ?? item.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-2 md:items-end">
                        <span className="rounded-full bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
                          {formatPrice(item.discount_price ?? item.price)}
                        </span>
                        <div className="flex items-center gap-2">
                          {qty > 0 && (
                            <>
                              <button
                                type="button"
                                onClick={() => decreaseFromCart(item.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:border-primary hover:text-primary"
                              >
                                -
                              </button>
                              <span className="text-xs font-semibold text-zinc-700">
                                {qty}
                              </span>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => addToCart(item.id)}
                            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-primary/40 hover:bg-primary-soft"
                          >
                            {qty > 0
                              ? locale === "tr"
                                ? "Bir tane daha ekle"
                                : "Add one more"
                              : locale === "tr"
                                ? "Sepete ekle"
                                : "Add to cart"}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
      </div>

      {/* Sepet özeti butonu */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center md:bottom-6">
        <div className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-zinc-200 bg-white/95 px-4 py-3 shadow-lg shadow-zinc-400/40 backdrop-blur">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {locale === "tr" ? "Sepet" : "Cart"}
            </span>
            <span className="text-xs text-zinc-700">
              {cartSummary.count > 0
                ? locale === "tr"
                  ? `${cartSummary.count} ürün • ${formatPrice(cartSummary.total)}`
                  : `${cartSummary.count} items • ${formatPrice(cartSummary.total)}`
                : locale === "tr"
                  ? "Sepetiniz boş. Ürün ekleyin."
                  : "Your cart is empty. Add some items."}
            </span>
          </div>
          <WhatsAppButton
            phoneNumber={whatsappPhone}
            message={cartMessage}
            label={
              locale === "tr"
                ? "WhatsApp ile sipariş ver"
                : "Order via WhatsApp"
            }
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}


