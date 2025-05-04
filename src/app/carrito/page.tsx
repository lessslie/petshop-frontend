"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export default function CarritoPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    setCart(stored ? JSON.parse(stored) : []);
    setLoading(false);
  }, []);

  const handleQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Vaciar carrito completamente
  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    toast.success("Carrito vaciado");
  };

  const handleCheckout = async () => {
    // Aquí podrías pedir datos del usuario, dirección, etc.
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Debes iniciar sesión para comprar");
      router.push("/login");
      return;
    }
    try {
      const orderItems = cart.map(({ id, quantity, price, imageUrl }) => ({
        productId: id,
        quantity,
        price,
        image: imageUrl || ""
      }));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ items: orderItems })
      });
      if (!res.ok) throw new Error("No se pudo crear la orden");
      const data = await res.json();
      if (data.mercadoPagoUrl) {
        // Redirigir a Mercado Pago
        window.location.href = data.mercadoPagoUrl;
        return;
      }
      localStorage.removeItem("cart");
      setCart([]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    } catch {
      alert("Error al finalizar la compra");
    }
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (loading) return <main className="flex items-center justify-center min-h-[60vh]">Cargando carrito...</main>;

  return (
    <main className="min-h-[80vh] flex flex-col items-center bg-gray-50 py-10 px-2 sm:px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span role="img" aria-label="carrito">🛒</span> Tu carrito
      </h1>
      {cart.length === 0 ? (
        <div className="text-gray-500 mt-12 text-lg">Tu carrito está vacío.</div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition mb-4"
            onClick={handleClearCart}
          >
            Vaciar carrito
          </button>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 py-4 last:border-b-0">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain rounded" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{item.name}</div>
                <div className="text-teal-700 font-bold">${item.price.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handleQuantity(item.id, -1)}
                  >-</button>
                  <span className="font-mono w-6 text-center">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handleQuantity(item.id, 1)}
                  >+</button>
                  <button
                    className="ml-4 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={() => handleRemove(item.id)}
                  >Eliminar</button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-xl text-teal-700 font-bold">${total.toLocaleString()}</span>
          </div>
          <button
            className="mt-8 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition"
            onClick={handleCheckout}
          >
            <span role="img" aria-label="carrito">🛒</span> Finalizar compra
          </button>
        </div>
      )}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ¡Compra realizada con éxito!
        </div>
      )}
    </main>
  );
}
