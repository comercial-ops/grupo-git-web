export type Product = {
  id: string;
  name: string;
  reference: string;
  description: string;
  price: number;
  image_url: string | null;
  created_at: string;
};

export type Catalog = {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
};
