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
  imageUrl?: string;
  images?: string[];
}

export default function AdminJuguetes() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Product | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [especie, setEspecie] = useState<'juguetes_perro' | 'juguetes_gato'>('juguetes_perro');

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
        setSuccessMsg('Juguete eliminado correctamente');
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
        <h1 className="text-2xl font-bold">Administrar Juguetes</h1>
        <div className="flex gap-4 items-center">
          <select
            className="border rounded px-2 py-1"
            value={especie}
            onChange={e => setEspecie(e.target.value as 'juguetes_perro' | 'juguetes_gato')}
          >
            <option value="juguetes_perro">Perro</option>
            <option value="juguetes_gato">Gato</option>
          </select>
          <button onClick={() => { setEditing(undefined); setModalOpen(true); }} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-semibold shadow">+ Agregar juguete</button>
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
                <td className="py-2 px-3">
                  {prod.imageUrl ? (
                    <Image
                      src={prod.imageUrl}
                      alt={prod.name}
                      width={80}
                      height={80}
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Editar juguete' : 'Agregar juguete'}</h2>
            <ProductForm 
              initial={editing}
              onClose={handleModalClose}
              onSaved={(prod, isEdit) => {
                setModalOpen(false);
                setEditing(undefined);
                if (isEdit) {
                  setProductos(productos.map(p => p.id === prod.id ? prod : p));
                  setSuccessMsg('Juguete editado correctamente');
                } else {
                  setProductos([prod, ...productos]);
                  setSuccessMsg('Juguete creado correctamente');
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
    imageUrl: initial?.imageUrl || '',
    category: initial?.category || 'juguetes_perro',
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
      const url = initial ? `${process.env.NEXT_PUBLIC_API_URL}/products/${initial.id}` : '${process.env.NEXT_PUBLIC_API_URL}/products';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
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
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label className="font-semibold">Nombre
        <input name="name" value={form.name} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
      </label>
      <label className="font-semibold">Descripción
        <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
      </label>
      <label className="font-semibold">Precio
        <input name="price" type="number" value={form.price} onChange={handleChange} className="border rounded px-2 py-1 w-full" required min={0} />
      </label>
      <label className="font-semibold">Stock
        <input name="stock" type="number" value={form.stock} onChange={handleChange} className="border rounded px-2 py-1 w-full" required min={0} />
      </label>
      <label className="font-semibold">Categoría
        <select name="category" value={form.category} onChange={handleChange} className="border rounded px-2 py-1 w-full" required>
          <option value="juguetes_perro">Juguete para perro</option>
          <option value="juguetes_gato">Juguete para gato</option>
        </select>
      </label>
      <label className="font-semibold">URL de imagen
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
      </label>
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
