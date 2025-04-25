export default function PaymentPending() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white rounded-lg shadow-lg p-8 mt-10">
        <h1 className="text-3xl font-bold mb-4 text-yellow-700">Pago pendiente</h1>
        <p className="mb-6 text-gray-700">Tu pago está siendo procesado. Te notificaremos por correo cuando se confirme.</p>
        <a href="/" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">Volver al inicio</a>
      </div>
    </main>
  );
}
