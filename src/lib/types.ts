export type Language = {
  id: string;
  code: string;
  name: string;
  is_default: boolean;
  is_active: boolean;
};

export type Category = {
  id: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean;
};

export type CategoryTranslation = {
  id: string;
  category_id: string;
  language_code: string;
  name: string;
  description: string | null;
};

export type CategoryWithTranslations = Category & {
  name: string;
  description: string | null;
  language_code: string;
};

export type Subcategory = {
  id: string;
  category_id: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean;
};

export type SubcategoryWithTranslations = Subcategory & {
  name: string;
  description: string | null;
  language_code: string;
};

export type SubcategoryTranslation = {
  id: string;
  subcategory_id: string;
  language_code: string;
  name: string;
  description: string | null;
};

export type Product = {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  slug: string;
  sku: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  gallery_images: string[] | null;
  portion_size: string | null;
  calories: number | null;
  preparation_time: string | null;
  allergens: string[] | null;
  tags: string[] | null;
  is_available: boolean;
  is_featured: boolean;
  is_active: boolean;
  display_order: number | null;
};

export type ProductWithTranslations = Product & {
  language_code: string;
  name: string;
  description: string | null;
  short_description: string | null;
  ingredients: string | null;
};

export type ProductTranslation = {
  id: string;
  product_id: string;
  language_code: string;
  name: string;
  description: string | null;
  short_description: string | null;
  ingredients: string | null;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: string | null;
};

export type SiteSettingTranslation = {
  id: string;
  setting_id: string;
  language_code: string;
  translations: Record<string, unknown> | null;
};


