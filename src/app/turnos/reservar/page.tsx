'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUserContext } from '@/context/UserContext';
import { Suspense } from 'react';

const getNextTwoWeeksWeekdays = () => {
  const days = [];
  const today = new Date();
  const d = new Date(today);
  while (days.length < 10) {
    if (d.getDay() > 0 && d.getDay() < 6) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
};

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ReservaTurnoPage />
    </Suspense>
  );
}

function ReservaTurnoPage() {
  const searchParams = useSearchParams();
  const { user } = useUserContext();
  const userId = user?.userId || '';
  const isLoggedIn = !!user;
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [step, setStep] = useState<'select-day'|'select-hour'|'form'|'done'>('select-day');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [form, setForm] = useState({
    dogName: '',
    dogSize: searchParams.get('size') || '',
    serviceType: searchParams.get('servicio') || '',
    userId: userId || '',
  });
  const [error, setError] = useState('');

  const weekDays = getNextTwoWeeksWeekdays();

  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/available-slots/${selectedDate}`)
        .then(res => res.json())
        .then(slots => {
          setAvailableSlots(slots);
          setLoadingSlots(false);
        })
        .catch(() => {
          setAvailableSlots([]);
          setLoadingSlots(false);
        });
    }
  }, [selectedDate]);

  useEffect(() => {
    if (userId) {
      console.log('userId en ReservaTurnoPage:', userId);
      setForm((prev) => ({ ...prev, userId }));
    }
  }, [userId]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date.toISOString().slice(0, 10));
    setStep('select-hour');
    setSelectedSlot('');
    setError('');
  };

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    setStep('form');
  };

  // Cambia el tipo del handler para aceptar input y select
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          date: selectedDate,
          time: selectedSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al reservar turno');
        return;
      }
      // Lógica para redirigir al pago si el turno se creó correctamente
      // Suponiendo que el backend retorna el turno creado con su id
      if (data && data.id) {
        window.location.href = `/turnos/pagar/${data.id}`;
      } else {
        setStep('done');
      }
    } catch {
      setError('Error de red');
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10 px-2">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reservar Turno</h1>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 flex flex-col items-center">
          <p className="text-gray-600 mb-4">Debes iniciar sesión para reservar un turno.</p>
          <Link href="/login" className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-300 hover:text-blue-900 transition">Ir al login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10 px-2">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reservar Turno</h1>
      {step === 'select-day' && (
        <div className="mb-8 w-full max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Selecciona un día (lunes a viernes):</h2>
          <div className="flex flex-col gap-2">
            {[0,1].map(week => (
              <div className="flex gap-4 justify-center flex-nowrap" key={week}>
                {weekDays.slice(week*5, week*5+5).map((d) => (
                  <button
                    key={d.toISOString()}
                    className={`px-4 py-2 rounded-lg border text-gray-700 font-semibold shadow bg-white hover:bg-blue-100 transition ${selectedDate === d.toISOString().slice(0,10) ? 'bg-blue-200 border-blue-400' : 'border-gray-200'}`}
                    onClick={() => handleDayClick(d)}
                  >
                    <div className="capitalize">{d.toLocaleDateString('es-AR', { weekday: 'short' })}</div>
                    <div className="font-bold">{d.getDate()}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'select-hour' && (
        <div className="mb-8 w-full max-w-xl">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Horarios disponibles para el {selectedDate}:</h2>
          {loadingSlots ? (
            <div className="text-gray-500">Cargando horarios...</div>
          ) : availableSlots.length === 0 ? (
            <div className="text-gray-500">No hay horarios disponibles para este día.</div>
          ) : (
            <div className="flex gap-3 flex-wrap justify-center">
              {availableSlots
                .filter((_, i) => {
                  // Mostrar solo slots cada 1:30hs (el backend ya filtra ocupados)
                  // Mostrar el primer slot y luego saltar 3 (0, 3, 6...)
                  return i % 3 === 0;
                })
                .map(slot => (
                  <button
                    key={slot}
                    className="px-4 py-2 rounded-lg border text-gray-700 font-semibold shadow bg-white hover:bg-blue-100 transition"
                    onClick={() => handleSlotClick(slot)}
                  >
                    {slot}
                  </button>
                ))}
            </div>
          )}
          <button className="mt-6 px-4 py-2 text-blue-600 hover:underline" onClick={() => setStep('select-day')}>Volver a elegir día</button>
        </div>
      )}

      {step === 'form' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col gap-4 w-full max-w-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Completa los datos del turno</h2>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nombre del perro</label>
            <input name="dogName" required value={form.dogName} onChange={handleFormChange} className="w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Tamaño</label>
            <select name="dogSize" required value={form.dogSize} onChange={handleFormChange} className="w-full border rounded-md p-2">
              <option value="">Seleccionar</option>
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Servicio</label>
            <select name="serviceType" required value={form.serviceType} onChange={handleFormChange} className="w-full border rounded-md p-2">
              <option value="">Seleccionar</option>
              <option value="bath">Baño</option>
              <option value="bath and cut">Baño y corte</option>
            </select>
          </div>
          <button type="submit" className="w-full px-5 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-300 hover:text-blue-900 transition">
            Confirmar turno para {selectedDate} a las {selectedSlot}
          </button>
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>
      )}

      {step === 'done' && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">¡Turno reservado!</h2>
          <p className="text-gray-600 mb-4">Recibirás una confirmación por email.</p>
        </div>
      )}
    </main>
  );
}
