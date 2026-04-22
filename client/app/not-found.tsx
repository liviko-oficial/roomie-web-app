import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700">Página no encontrada</h2>
      <p className="max-w-md text-gray-600">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
