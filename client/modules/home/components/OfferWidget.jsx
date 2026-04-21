"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { petitionService } from "@/lib/api/petitionService";

const STEP_OPTIONS = [100, 500];

export default function OfferWidget({ propertyId, listedPrice }) {
  const router = useRouter();
  const [offerAmount, setOfferAmount] = useState(listedPrice || 0);
  const [step, setStep] = useState(500);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null;
  const isStudent = userType === "student" && !!userId;

  const adjust = (delta) => {
    const next = offerAmount + delta;
    if (next >= 500 && next <= listedPrice * 2) {
      setOfferAmount(next);
    }
  };

  const handleSubmit = async () => {
    if (!isStudent) {
      router.push("/login-student");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await petitionService.create(propertyId, userId, offerAmount);
      setSent(true);
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || "Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (v) => typeof v === "number" ? v.toLocaleString("es-MX") : v;
  const diff = offerAmount - listedPrice;
  const diffPercent = listedPrice ? Math.round((diff / listedPrice) * 100) : 0;

  if (sent) {
    return (
      <div className="mt-8 border-t pt-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-bold text-green-800 mb-1">Solicitud enviada</h3>
          <p className="text-sm text-green-700">
            Tu oferta de <span className="font-bold">${formatPrice(offerAmount)}/mes</span> fue enviada al arrendador.
            Revisa tu dashboard para ver el estado.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-6 py-2 bg-brand-dark text-white rounded-lg text-sm font-medium hover:bg-brand-dark/90 transition"
          >
            Ir a mis solicitudes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-bold text-[#042A5C] mb-4">Solicitar esta propiedad</h2>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500 mb-1">Precio publicado</p>
          <p className="text-2xl font-bold text-[#042A5C]">${formatPrice(listedPrice)}<span className="text-base font-normal text-gray-500">/mes</span></p>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-500 mb-2">Tu oferta</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => adjust(-step)}
              disabled={offerAmount - step < 500}
              className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold text-lg flex items-center justify-center hover:bg-red-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Disminuir oferta"
            >
              -
            </button>

            <span className="text-3xl font-bold text-[#042A5C] min-w-[160px]">
              ${formatPrice(offerAmount)}
            </span>

            <button
              onClick={() => adjust(step)}
              disabled={offerAmount + step > listedPrice * 2}
              className="w-10 h-10 rounded-full bg-green-100 text-green-600 font-bold text-lg flex items-center justify-center hover:bg-green-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Aumentar oferta"
            >
              +
            </button>
          </div>

          {diff !== 0 && (
            <p className={`text-sm mt-2 font-medium ${diff < 0 ? "text-red-500" : "text-green-600"}`}>
              {diff > 0 ? "+" : ""}{formatPrice(diff)} ({diffPercent > 0 ? "+" : ""}{diffPercent}%)
            </p>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-5">
          {STEP_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                step === s
                  ? "bg-brand-dark text-white"
                  : "bg-white text-brand-dark border border-gray-200 hover:bg-gray-100"
              }`}
            >
              +/- ${s}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-[#FDD76C] text-[#042A5C] rounded-lg font-bold text-base hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : isStudent ? `Enviar solicitud por $${formatPrice(offerAmount)}/mes` : "Inicia sesion para solicitar"}
        </button>
      </div>
    </div>
  );
}
