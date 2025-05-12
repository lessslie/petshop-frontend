"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

// Tipo Turno para admin
export type Turno = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  dogName: string;
  date: string;
  time: string;
  serviceType: string;
  dogSize?: string;
  price?: number;
  paymentStatus?: string;
};

export default function AdminTurnos() {
  const { user } = useUserContext();
  const [token, setToken] = useState<string | null>(null);
  const role = user?.role;
  const isLoggedIn = !!user;
  const router = useRouter();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Turno|null>(null);
  const [turnoEditando, setTurnoEditando] = useState<Turno|null>(null);
  const [editForm, setEditForm] = useState({
    dogName: '',
    date: '',
    time: '',
    dogSize: '',
    serviceType: '',
  });

  // --- PAGINACIÓN ---
  // Nuevo estado para la página actual y cantidad por página
  const [pagina, setPagina] = useState(1); // <-- NUEVO: página actual
  const turnosPorPagina = 10; // <-- NUEVO: solo 10 turnos por página

  // Ordenar los turnos por fecha y hora ascendente (más próximo primero)
  const turnosOrdenados = [...turnos].sort((a, b) => {
    const fechaA = new Date(`${a.date}T${a.time}`);
    const fechaB = new Date(`${b.date}T${b.time}`);
    return fechaA.getTime() - fechaB.getTime();
  });

  // PAGINACIÓN sobre turnos ordenados
  const indiceInicio = (pagina - 1) * turnosPorPagina;
  const indiceFin = indiceInicio + turnosPorPagina;
  const turnosPagina = turnosOrdenados.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(turnosOrdenados.length / turnosPorPagina); // <-- NUEVO

  // Accede a localStorage solo en el cliente
  useEffect(() => {
    setToken(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  }, []);

  useEffect(() => {
    if (!token || !isLoggedIn) return;
    if (role !== "admin") {
      router.push("/dashboard");
      return;
    }
    // Si necesitas obtener los turnos de un usuario específico, usa la ruta correcta:
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/appointments/${userId}`, { ... })
    // Si es para todos los turnos (admin), la ruta /turnos está bien.
    // Si tienes algún fetch con /turnos/user/, cámbialo a /turnos/appointments/.
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // DEBUG: mostrar los datos recibidos
        console.log('Turnos recibidos:', data);
        if (Array.isArray(data)) {
          setTurnos(data);
          setError("");
        } else {
          setTurnos([]);
          setError(
            typeof data === "object" && data.message
              ? data.message
              : "Error inesperado al obtener los turnos."
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setTurnos([]);
        setError("Error de red al obtener los turnos.");
        setLoading(false);
      });
  }, [token, isLoggedIn, role, router]);

  // Función para eliminar turno
  const eliminarTurno = async (turnoId: string) => {
    if (!confirm("¿Estás seguro de eliminar este turno?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/${turnoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTurnos((turnos) => turnos.filter((t) => t.id !== turnoId));
        setMensaje("Turno eliminado correctamente.");
        setTimeout(() => setMensaje(""), 2500);
      } else {
        setError("Error al eliminar el turno.");
        setTimeout(() => setError(""), 2500);
      }
    } catch {
      setError("Error de red al eliminar el turno.");
      setTimeout(() => setError(""), 2500);
    }
  };

  const handleEditarTurno = (turno: Turno) => {
    setTurnoEditando(turno);
    setEditForm({
      dogName: turno.dogName,
      date: turno.date,
      time: turno.time,
      dogSize: turno.dogSize || '',
      serviceType: turno.serviceType,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnoEditando) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/${turnoEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dogName: editForm.dogName,
          date: editForm.date,
          time: editForm.time,
          dogSize: editForm.dogSize,
          serviceType: editForm.serviceType,
        }),
      });

      if (res.ok) {
        const updatedTurno = await res.json();
        setTurnos(turnos.map(t => t.id === updatedTurno.id ? updatedTurno : t));
        setTurnoEditando(null);
        setMensaje("Turno actualizado correctamente.");
        setTimeout(() => setMensaje(""), 2500);
      } else {
        setError("Error al actualizar el turno.");
        setTimeout(() => setError(""), 2500);
      }
    } catch {
      setError("Error de red al actualizar el turno.");
      setTimeout(() => setError(""), 2500);
    }
  };

  if (!isLoggedIn || role !== "admin") return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Turnos</h1>
      {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
      {mensaje && <div className="mb-2 text-green-600 font-semibold">{mensaje}</div>}
      {/* Filtro de fecha */}
      <input
        type="date"
        value={filtroFecha}
        onChange={(e) => setFiltroFecha(e.target.value)}
        className="mb-4 p-2 border rounded"
        placeholder="Filtrar por fecha"
      />
      {loading ? (
        <p>Cargando turnos...</p>
      ) : (
        // Grid responsive: 1 columna en mobile, 2 columnas desde md+
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {turnosPagina.length === 0 ? (
            <div className="text-center text-gray-600 col-span-full">No hay turnos para mostrar.</div>
          ) : (
            turnosPagina.map((turno) => (
              <div key={turno.id} className="bg-white rounded-xl shadow p-4 border border-gray-200 w-full flex flex-col items-center gap-4">
                <div className="w-full flex flex-col gap-1 items-center md:items-start">
                  <div className="mb-1"><span className="font-semibold">Cliente:</span> {turno.userName}</div>
                  <div className="mb-1 w-full overflow-hidden"><span className="font-semibold">Email:</span> <span className="break-words overflow-ellipsis">{turno.email}</span></div>
                  <div className="mb-1"><span className="font-semibold">Mascota:</span> {turno.dogName}</div>
                  <div className="mb-1"><span className="font-semibold">Fecha:</span> {turno.date}</div>
                  <div className="mb-1"><span className="font-semibold">Hora:</span> {turno.time}</div>
                  <div className="mb-1"><span className="font-semibold">Tamaño:</span> {turno.dogSize}</div>
                  <div className="mb-1"><span className="font-semibold">Servicio:</span> {turno.serviceType}</div>
                  <div className="mb-1"><span className="font-semibold">Precio:</span> ${turno.price}</div>
                  <div className="mb-1"><span className="font-semibold">Estado de pago:</span> {turno.paymentStatus}</div>
                </div>
                <div className="flex gap-2 mt-2 w-full justify-center md:justify-center">
                  <button onClick={() => handleEditarTurno(turno)} className="bg-teal-600 hover:bg-teal-700 text-white py-1 px-3 rounded text-sm">Editar</button>
                  <button onClick={() => eliminarTurno(turno.id)} className="bg-pink-600 hover:bg-pink-700 text-white py-1 px-3 rounded text-sm">Eliminar</button>
                  <button onClick={() => setClienteSeleccionado(turno)} className="bg-gray-300 hover:bg-gray-400 text-gray-900 py-1 px-3 rounded text-sm">Ver Cliente</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* --- PAGINACIÓN: botones debajo de las tarjetas --- */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        <button
          onClick={() => setPagina(1)}
          disabled={pagina === 1}
          className={`px-3 py-1 rounded ${
            pagina === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          Primero
        </button>
        <button
          onClick={() => setPagina(p => Math.max(1, p - 1))}
          disabled={pagina === 1}
          className={`px-3 py-1 rounded ${
            pagina === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          Anterior
        </button>
        <span className="px-3 py-1 bg-gray-100 rounded">
          {pagina} de {totalPaginas || 1}
        </span>
        <button
          onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
          disabled={pagina === totalPaginas || totalPaginas === 0}
          className={`px-3 py-1 rounded ${
            pagina === totalPaginas || totalPaginas === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >Siguiente</button>
      </div>
      {clienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setClienteSeleccionado(null)}
              title="Cerrar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Datos del Cliente</h2>
            <div className="mb-2"><b>Nombre:</b> {clienteSeleccionado.userName || 'Sin nombre'}</div>
            <div className="mb-2"><b>Email:</b> {clienteSeleccionado.email || 'No disponible'}</div>
            <div className="mb-2"><b>Mascota:</b> {clienteSeleccionado.dogName}</div>
            <div className="mb-2"><b>Fecha:</b> {clienteSeleccionado.date}</div>
            <div className="mb-2"><b>Hora:</b> {clienteSeleccionado.time}</div>
            <div className="mb-2"><b>Servicio:</b> {clienteSeleccionado.serviceType}</div>
            {/* Puedes agregar más datos aquí si están disponibles en el turno */}
          </div>
        </div>
      )}
      {turnoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setTurnoEditando(null)}
              title="Cerrar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Editar Turno</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block font-semibold">Cliente</label>
                <input value={turnoEditando.userName} disabled className="w-full border rounded p-2 bg-gray-100" />
              </div>
              <div>
                <label className="block font-semibold">Mascota</label>
                <input name="dogName" value={editForm.dogName} onChange={handleEditChange} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-semibold">Fecha</label>
                <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-semibold">Hora</label>
                <input type="time" name="time" value={editForm.time} onChange={handleEditChange} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-semibold">Tamaño</label>
                <select name="dogSize" value={editForm.dogSize} onChange={handleEditChange} required className="w-full border rounded p-2">
                  <option value="">Selecciona</option>
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold">Servicio</label>
                <select name="serviceType" value={editForm.serviceType} onChange={handleEditChange} required className="w-full border rounded p-2">
                  <option value="bath">Baño</option>
                  <option value="bath and cut">Baño y Corte</option>
                </select>
              </div>
              <button type="submit" className="bg-teal-600 text-white py-2 rounded font-bold mt-2 hover:bg-teal-800">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
