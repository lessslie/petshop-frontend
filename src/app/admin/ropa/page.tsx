"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

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

export default function AdminRopa() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Product | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [especie, setEspecie] = useState<'ropa_perro' | 'ropa_gato'>('ropa_perro');

  function getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/categoria/${especie}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron cargar los productos');
        return res.json();
      })
      .then(data => setProductos(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [especie]);

  function handleEdit(product: Product) {
    setEditing(product);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    const token = getToken();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, { 
      method: 'DELETE', 
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo eliminar');
        setProductos(productos.filter(p => p.id !== id));
        setSuccessMsg('Prenda eliminada correctamente');
      })
      .catch(err => setError(err.message));
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditing(undefined);
  }

  return (
    <main className="min-h-[80vh] bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administrar Ropa</h1>
        <div className="flex gap-4 items-center">
          <select
            className="border rounded px-2 py-1"
            value={especie}
            onChange={e => setEspecie(e.target.value as 'ropa_perro' | 'ropa_gato')}
          >
            <option value="ropa_perro">Perro</option>
            <option value="ropa_gato">Gato</option>
          </select>
          <button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold shadow">+ Agregar prenda</button>
        </div>
      </div>
      {/* Alertas lindas */}
      {successMsg && (
        <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800 border border-green-300 flex items-center gap-2 animate-fade-in">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#bbf7d0"/><path d="M8 12l2 2 4-4" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="ml-auto text-green-700 hover:underline text-sm">Cerrar</button>
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-2 rounded bg-red-100 text-red-800 border border-red-300 flex items-center gap-2 animate-fade-in">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fecaca"/><path d="M15 9l-6 6M9 9l6 6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/></svg>
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-700 hover:underline text-sm">Cerrar</button>
        </div>
      )}
      {loading && <p>Cargando...</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-3">Imagen</th>
              <th className="py-2 px-3">Nombre</th>
              <th className="py-2 px-3">Precio</th>
              <th className="py-2 px-3">Stock</th>
              <th className="py-2 px-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.id} className="border-b last:border-b-0">
                <td className="p-2">
  {Array.isArray(prod.imageUrl) && prod.imageUrl.length > 0 ? (
  <div className="flex flex-col gap-1">
    <div className="flex gap-1">
      {prod.imageUrl.slice(0, 3).map((img: string, idx: number) => (
        <Image
          key={idx}
          src={img}
          alt={`${prod.name} ${idx + 1}`}
          width={40}
          height={40}
          style={{ objectFit: 'contain', borderRadius: 6 }}
        />
      ))}
    </div>
    {prod.videoUrl && (
      <video controls width={80} height={40} style={{ borderRadius: 6, marginTop: 4 }}>
        <source src={prod.videoUrl} type="video/mp4" />
        Tu navegador no soporta video.
      </video>
    )}
  </div>
) : (
  Array.isArray(prod.imageUrl) === false && typeof prod.imageUrl === 'string' && prod.imageUrl ? (
    <>
      <Image
        src={prod.imageUrl}
        alt={prod.name}
        width={40}
        height={40}
        style={{ objectFit: 'contain', borderRadius: 6 }}
      />
      {prod.videoUrl && (
        <video controls width={80} height={40} style={{ borderRadius: 6, marginTop: 4 }}>
          <source src={prod.videoUrl} type="video/mp4" />
          Tu navegador no soporta video.
        </video>
      )}
    </>
  ) : (
    <span className="text-gray-400">Sin imagen</span>
  )
)}
                </td>
                <td className="py-2 px-3">{prod.name}</td>
                <td className="py-2 px-3">${prod.price.toLocaleString()}</td>
                <td className="py-2 px-3">{prod.stock}</td>
                <td className="py-2 px-3 flex gap-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" onClick={() => handleEdit(prod)}>Editar</button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={() => handleDelete(prod.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal para editar/agregar producto */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-2 sm:mx-4 md:mx-0">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Editar prenda' : 'Agregar prenda'}</h2>
            <ProductForm 
              initial={editing}
              onClose={handleModalClose}
              onSaved={(prod, isEdit) => {
                setModalOpen(false);
                setEditing(undefined);
                if (isEdit) {
                  setProductos(productos.map(p => p.id === prod.id ? prod : p));
                  setSuccessMsg('Prenda editada correctamente');
                } else {
                  setProductos([prod, ...productos]);
                  setSuccessMsg('Prenda creada correctamente');
                }
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}

interface ProductFormProps {
  initial?: Product;
  onClose: () => void;
  onSaved: (prod: Product, isEdit: boolean) => void;
}

function ProductForm({ initial, onClose, onSaved }: ProductFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price || '',
    stock: initial?.stock || '',
    imageUrl1: initial?.imageUrl?.[0] || '',
    imageUrl2: initial?.imageUrl?.[1] || '',
    imageUrl3: initial?.imageUrl?.[2] || '',
    videoUrl: initial?.videoUrl || '',
    category: initial?.category || 'ropa_perro',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  useEffect(() => {
    if (!saving) setError('');
  }, [saving]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = getToken();
      const method = initial ? 'PUT' : 'POST';
      const url = initial ? `${process.env.NEXT_PUBLIC_API_URL}/products/${initial.id}` : `${process.env.NEXT_PUBLIC_API_URL}/products`;
      const imageUrl = [form.imageUrl1, form.imageUrl2, form.imageUrl3].filter(Boolean);
      const videoUrl = form.videoUrl || undefined;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          imageUrl,
          videoUrl,
          category: form.category,
        }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      const prod = await res.json();
      onSaved(prod, !!initial);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <label className="font-semibold flex flex-col gap-1">Nombre
        <input name="name" value={form.name} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
      </label>
      <label className="font-semibold flex flex-col gap-1">Descripción
        <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1 w-full resize-none" required rows={3} />
      </label>
      <label className="font-semibold flex flex-col gap-1">Precio
        <input name="price" type="number" value={form.price} onChange={handleChange} className="border rounded px-2 py-1 w-full" required min={0} />
      </label>
      <label className="font-semibold flex flex-col gap-1">Stock
        <input name="stock" type="number" value={form.stock} onChange={handleChange} className="border rounded px-2 py-1 w-full" required min={0} />
      </label>
      <label className="font-semibold flex flex-col gap-1">Categoría
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          required
        >
          <option value="ropa_perro">Ropa para perro</option>
          <option value="ropa_gato">Ropa para gato</option>
        </select>
      </label>
      <label className="font-semibold flex flex-col gap-1">URL de imagen 1
        <input name="imageUrl1" value={form.imageUrl1} onChange={handleChange} className="border rounded px-2 py-1 w-full" placeholder="https://..." />
      </label>
      <label className="font-semibold flex flex-col gap-1">URL de imagen 2
        <input name="imageUrl2" value={form.imageUrl2} onChange={handleChange} className="border rounded px-2 py-1 w-full" placeholder="https://..." />
      </label>
      <label className="font-semibold flex flex-col gap-1">URL de imagen 3
        <input name="imageUrl3" value={form.imageUrl3} onChange={handleChange} className="border rounded px-2 py-1 w-full" placeholder="https://..." />
      </label>
      <label className="font-semibold flex flex-col gap-1">URL de video (opcional)
        <input name="videoUrl" value={form.videoUrl} onChange={handleChange} className="border rounded px-2 py-1 w-full" placeholder="https://..." />
      </label>
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full sm:w-auto" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 w-full sm:w-auto" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
