import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white rounded-lg shadow-lg p-8 mt-10">
        <h1 className="text-3xl font-bold mb-4 text-green-700">¡Pago realizado con éxito!</h1>
        <p className="mb-6 text-gray-700">Tu turno ha sido confirmado y el pago procesado correctamente.<br />Revisa tu correo para más información.</p>
        <Link href="/" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">Volver al inicio</Link>
      </div>
    </main>
  );
}
