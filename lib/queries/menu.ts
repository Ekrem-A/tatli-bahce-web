import { getServerClient } from "@/lib/supabaseClient";
import type {
  Category,
  CategoryTranslation,
  CategoryWithTranslations,
  Subcategory,
  SubcategoryTranslation,
  SubcategoryWithTranslations,
  Product,
  ProductTranslation,
  ProductWithTranslations,
} from "@/lib/types";

export type MenuTreeItem = {
  category: CategoryWithTranslations;
  subcategories: {
    subcategory: SubcategoryWithTranslations;
    products: ProductWithTranslations[];
  }[];
  uncategorizedProducts: ProductWithTranslations[];
};

function mergeCategories(
  categories: Category[],
  translations: CategoryTranslation[],
  languageCode: string,
): CategoryWithTranslations[] {
  const byCategory = new Map<string, CategoryTranslation[]>();
  for (const tr of translations) {
    const arr = byCategory.get(tr.category_id) ?? [];
    arr.push(tr);
    byCategory.set(tr.category_id, arr);
  }

  return categories
    .filter((c) => c.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((cat) => {
      const tr = (byCategory.get(cat.id) ?? []).find(
        (t) => t.language_code === languageCode,
      );
      return {
        ...cat,
        name: tr?.name ?? cat.slug,
        description: tr?.description ?? null,
        language_code: tr?.language_code ?? languageCode,
      };
    });
}

function mergeSubcategories(
  subcategories: Subcategory[],
  translations: SubcategoryTranslation[],
  languageCode: string,
): SubcategoryWithTranslations[] {
  const bySub = new Map<string, SubcategoryTranslation[]>();
  for (const tr of translations) {
    const arr = bySub.get(tr.subcategory_id) ?? [];
    arr.push(tr);
    bySub.set(tr.subcategory_id, arr);
  }

  return subcategories
    .filter((s) => s.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((sub) => {
      const tr = (bySub.get(sub.id) ?? []).find(
        (t) => t.language_code === languageCode,
      );
      return {
        ...sub,
        name: tr?.name ?? sub.slug,
        description: tr?.description ?? null,
        language_code: tr?.language_code ?? languageCode,
      };
    });
}

function mergeProducts(
  products: Product[],
  translations: ProductTranslation[],
  languageCode: string,
): ProductWithTranslations[] {
  const byProduct = new Map<string, ProductTranslation[]>();
  for (const tr of translations) {
    const arr = byProduct.get(tr.product_id) ?? [];
    arr.push(tr);
    byProduct.set(tr.product_id, arr);
  }

  return products
    .filter((p) => p.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((prod) => {
      const tr = (byProduct.get(prod.id) ?? []).find(
        (t) => t.language_code === languageCode,
      );
      return {
        ...prod,
        language_code: tr?.language_code ?? languageCode,
        name: tr?.name ?? prod.slug,
        description: tr?.description ?? null,
        short_description: tr?.short_description ?? null,
        ingredients: tr?.ingredients ?? null,
      };
    });
}

export async function getMenuCategories(
  languageCode: string,
): Promise<CategoryWithTranslations[]> {
  const supabase = getServerClient();

  const [{ data: categories }, { data: translations }] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase
      .from("category_translations")
      .select("*")
      .eq("language_code", languageCode),
  ]);

  if (!categories) return [];

  return mergeCategories(
    (categories ?? []) as Category[],
    (translations ?? []) as CategoryTranslation[],
    languageCode,
  );
}

export async function getMenuTree(languageCode: string): Promise<MenuTreeItem[]> {
  const supabase = getServerClient();

  const [
    { data: categories },
    { data: categoryTranslations },
    { data: subcategories },
    { data: subcategoryTranslations },
    { data: products },
    { data: productTranslations },
  ] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("category_translations").select("*"),
    supabase.from("subcategories").select("*"),
    supabase.from("subcategory_translations").select("*"),
    supabase.from("products").select("*"),
    supabase.from("product_translations").select("*"),
  ]);

  const mergedCategories =
    categories && categoryTranslations
      ? mergeCategories(
          categories as Category[],
          categoryTranslations as CategoryTranslation[],
          languageCode,
        )
      : [];

  const mergedSubcategories =
    subcategories && subcategoryTranslations
      ? mergeSubcategories(
          subcategories as Subcategory[],
          subcategoryTranslations as SubcategoryTranslation[],
          languageCode,
        )
      : [];

  const mergedProducts =
    products && productTranslations
      ? mergeProducts(
          products as Product[],
          productTranslations as ProductTranslation[],
          languageCode,
        )
      : [];

  const subcategoriesByCategory = new Map<string, SubcategoryWithTranslations[]>();
  const productsBySubcategory = new Map<string, ProductWithTranslations[]>();
  const productsByCategory = new Map<string, ProductWithTranslations[]>();

  for (const sub of mergedSubcategories) {
    const arr = subcategoriesByCategory.get(sub.category_id) ?? [];
    arr.push(sub);
    subcategoriesByCategory.set(sub.category_id, arr);
  }

  for (const product of mergedProducts) {
    if (product.subcategory_id) {
      const arr = productsBySubcategory.get(product.subcategory_id) ?? [];
      arr.push(product);
      productsBySubcategory.set(product.subcategory_id, arr);
    } else {
      const arr = productsByCategory.get(product.category_id) ?? [];
      arr.push(product);
      productsByCategory.set(product.category_id, arr);
    }
  }

  const tree: MenuTreeItem[] = mergedCategories.map((category) => {
    const catSubcategories = subcategoriesByCategory.get(category.id) ?? [];

    const subcategoryBlocks = catSubcategories.map((sub) => ({
      subcategory: sub,
      products: productsBySubcategory.get(sub.id) ?? [],
    }));

    return {
      category,
      subcategories: subcategoryBlocks,
      uncategorizedProducts: productsByCategory.get(category.id) ?? [],
    };
  });

  return tree;
}

