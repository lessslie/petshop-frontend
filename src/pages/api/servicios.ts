import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Obtener precios desde el backend
    const r = await fetch(`${BACKEND_URL}/servicios`);
    const data = await r.json();
    return res.status(200).json(data);
  } else if (req.method === 'PUT') {
    // Actualizar precios en el backend
    const r = await fetch(`${BACKEND_URL}/servicios`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    if (!r.ok) return res.status(400).json({ error: 'No se pudo actualizar' });
    return res.status(200).json({ ok: true });
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
