"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { arrendadorService } from "@/lib/api/arrendadorService";

export default function LoginArrendador() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailInvalid = emailTouched && email.length > 0 && !emailRegex.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await arrendadorService.login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <img
            src="/happy-roomie-lateral-navy.svg"
            alt="Happy Roomie Logo"
            className="h-12 w-auto"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-brand-dark">
          Inicia sesión como Arrendador
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Eres estudiante?{" "}
          <Link
            href="/login-student"
            className="font-medium text-brand-accent hover:text-brand-dark transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-dark"
              >
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent sm:text-sm ${
                    emailInvalid ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="tu@ejemplo.com"
                />
                {emailInvalid && (
                  <p className="mt-1 text-xs text-red-600">Formato de correo inválido</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-dark"
              >
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <span
                  title="Próximamente"
                  className="text-gray-400 cursor-help"
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brand-dark bg-brand-accent hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿Primera vez en Happy Roomie?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/lessor"
                className="w-full flex justify-center py-2 px-4 border border-brand-dark text-sm font-medium rounded-md text-brand-dark bg-white hover:bg-gray-50 transition-colors"
              >
                Crear cuenta de Arrendador
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            Al iniciar sesión, aceptas nuestros{" "}
            <Link
              href="/terminos"
              className="text-brand-accent hover:text-brand-dark"
            >
              Términos de Servicio
            </Link>{" "}
            y{" "}
            <Link
              href="/privacidad"
              className="text-brand-accent hover:text-brand-dark"
            >
              Política de Privacidad
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
