const process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  images?: string[];
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudieron obtener los productos');
  return res.json();
}