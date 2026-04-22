"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">Algo salió mal</h1>
      <p className="max-w-md text-gray-600">
        Ocurrió un error inesperado. Intenta recargar la página.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
