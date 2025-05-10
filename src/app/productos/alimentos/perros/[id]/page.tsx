'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

export default function DetalleProductoPerro({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [producto, setProducto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Extraer el id de los parámetros que son ahora una promesa
    params.then(resolvedParams => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el producto');
        return res.json();
      })
      .then(data => setProducto(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleBack() {
    router.back();
  }

  // Función para agregar el producto al carrito
  function handleAddToCart(product: Product) {
    // Leer el carrito actual de localStorage (o array vacío si no existe)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Buscar si el producto ya está en el carrito
    const existing = cart.find((item: Product) => item.id === product.id);
    if (existing) {
      // Si ya está, solo aumentamos la cantidad
      existing.quantity += 1;
    } else {
      // Si no está, lo agregamos con cantidad 1
      cart.push({ ...product, quantity: 1 });
    }
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Feedback visual mejorado (toast simple)
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  }

  if (loading) return <main className="flex items-center justify-center min-h-[60vh]"><p className="text-gray-500">Cargando producto...</p></main>;
  if (error) return <main className="flex items-center justify-center min-h-[60vh]"><p className="text-red-600">{error}</p></main>;
  if (!producto) return null;

  return (
    <main className="min-h-[80vh] flex flex-col items-center bg-gray-50 py-10 px-2 sm:px-4">
      <button onClick={handleBack} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold self-start">← Volver atrás</button>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-w-xl w-full flex flex-col items-center">
        <div className="mb-3 w-full h-40 relative flex items-center justify-center">
          {producto.imageUrl ? (
            Array.isArray(producto.imageUrl) && producto.imageUrl.length > 1 ? (
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3000}
                className="w-full h-40"
              >
                {producto.imageUrl.map((img: string, idx: number) => (
                  <div key={idx} className="w-full h-40 flex items-center justify-center relative">
                    <Image src={img} alt={producto.name + ' ' + (idx + 1)} fill className="object-contain rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="w-full h-40 relative">
                <Image src={Array.isArray(producto.imageUrl) ? producto.imageUrl[0] : producto.imageUrl} alt={producto.name} fill className="object-contain rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Sin imagen</div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">{producto.name}</h1>
        <p className="text-gray-600 mb-3 text-center">{producto.description}</p>
        {/* Botón centrado arriba del precio */}
        <button
          className="mb-3 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold shadow-lg transition"
          onClick={() => handleAddToCart(producto)}
        >
          Agregar al carrito
        </button>
        <span className="text-teal-700 font-bold text-xl mb-2">${producto.price.toLocaleString()}</span>
        <span className="text-gray-500 text-sm mb-2">Stock: {producto.stock}</span>
        {Array.isArray(producto.imageUrl) && producto.imageUrl.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {producto.imageUrl.map((img: string, idx: number) => (
              <div key={idx} className="w-20 h-20 relative">
                <Image src={img} alt={`Imagen adicional ${idx+1}`} fill className="object-cover rounded-md" />
              </div>
            ))}
          </div>
        )}
        {producto.videoUrl && (
          <video controls width={300} className="rounded-lg mx-auto mt-4 max-h-60">
            <source src={producto.videoUrl} type="video/mp4" />
            Tu navegador no soporta video.
          </video>
        )}
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