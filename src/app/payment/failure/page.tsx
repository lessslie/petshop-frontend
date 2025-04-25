import Link from 'next/link';

export default function PaymentFailure() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white rounded-lg shadow-lg p-8 mt-10">
        <h1 className="text-3xl font-bold mb-4 text-red-700">El pago fue rechazado</h1>
        <p className="mb-6 text-gray-700">Ocurrió un problema con tu pago. Por favor, intenta nuevamente o utiliza otro medio de pago.</p>
        <Link href="/" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">Volver al inicio</Link>
      </div>
    </main>
  );
}
