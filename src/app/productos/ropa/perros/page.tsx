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
  imageUrl?: string[];
  videoUrl?: string;
}

export default function RopaPerrosPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Estado para mostrar un toast/aviso bonito
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/categoria/ropa_perro`)
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

  // Función para agregar el producto al carrito
  function handleAddToCart(product: Product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: Product) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center bg-gray-50 py-10 px-2 sm:px-4">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold self-start"
      >
        ← Volver atrás
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ropa para Perros</h1>
      {loading && <p className="text-gray-500">Cargando productos...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {productos.map((prod) => (
          <Link
            key={prod.id}
            href={`/productos/ropa/${prod.id}`}
            className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-4 sm:p-6 hover:shadow-lg transition min-w-[200px] max-w-xs mx-auto w-full overflow-hidden cursor-pointer"
          >
            <div className="mb-3 w-full h-32 relative flex items-center justify-center">
              {Array.isArray(prod.imageUrl) && prod.imageUrl.length > 0 ? (
                <div className="flex gap-2 justify-center mb-2">
                  {prod.imageUrl.slice(0, 3).map((img: string, idx: number) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`${prod.name} ${idx + 1}`}
                      width={120}
                      height={120}
                      className="rounded-lg object-contain"
                    />
                  ))}
                </div>
              ) : (
                typeof prod.imageUrl === 'string' && prod.imageUrl ? (
                  <Image
                    src={prod.imageUrl}
                    alt={prod.name}
                    width={300}
                    height={300}
                    className="rounded-lg object-contain mx-auto"
                  />
                ) : (
                  <div className="w-full h-60 flex items-center justify-center bg-gray-100 text-gray-400">Sin imagen</div>
                )
              )}
              {prod.videoUrl && (
                <video controls width={300} className="rounded-lg mx-auto mt-2 max-h-60">
                  <source src={prod.videoUrl} type="video/mp4" />
                  Tu navegador no soporta video.
                </video>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 mt-2 text-center break-words">
              {prod.name}
            </h2>
            <p className="text-gray-500 mb-2 text-center text-sm sm:text-base line-clamp-2">
              {prod.description}
            </p>
            {/* Botón para agregar al carrito */}
            <button
              className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition"
              onClick={() => handleAddToCart(prod)}
            >
              Agregar al carrito
            </button>
            <span className="text-teal-700 font-bold text-lg sm:text-xl mb-2">${prod.price?.toLocaleString()}</span>
          </Link>
        ))}
      </div>
      {/* Toast bonito para feedback visual */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ¡Producto agregado al carrito!
        </div>
      )}
    </main>
  );
}
