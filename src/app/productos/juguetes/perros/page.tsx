"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  images?: string[];
}

export default function JuguetesPerrosPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3001/products/categoria/juguetes_perro")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar los productos");
        return res.json();
      })
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleBack() {
    router.back();
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center bg-gray-50 py-10 px-2 sm:px-4">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold self-start"
      >
        ← Volver atrás
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Juguetes para Perros</h1>
      {loading && <p className="text-gray-500">Cargando productos...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {productos.map((prod) => (
          <Link
            key={prod.id}
            href={`/productos/juguetes/${prod.id}`}
            className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-4 sm:p-6 hover:shadow-lg transition min-w-[200px] max-w-xs mx-auto w-full overflow-hidden cursor-pointer"
          >
            <div className="mb-3 w-full h-32 relative flex items-center justify-center">
              {prod.imageUrl ? (
                <Image
                  src={prod.imageUrl}
                  alt={prod.name}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  Sin imagen
                </div>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 mt-2 text-center break-words">
              {prod.name}
            </h2>
            <p className="text-gray-500 mb-2 text-center text-sm sm:text-base line-clamp-2">
              {prod.description}
            </p>
            <span className="text-teal-700 font-bold text-lg sm:text-xl mb-2">
              ${prod.price.toLocaleString()}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
