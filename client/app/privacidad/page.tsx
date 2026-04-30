import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description: "Aviso de privacidad de Happy Roomie conforme a la LFPDPPP.",
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm text-brand-accent hover:text-brand-dark inline-flex items-center mb-6"
        >
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
          Aviso de Privacidad
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Última actualización: 29 de abril de 2026
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">1. Identidad del responsable</h2>
            <p>
              Happy Roomie (&quot;nosotros&quot;, &quot;la Plataforma&quot;), con domicilio en
              Guadalajara, Jalisco, México, es responsable del tratamiento de
              tus datos personales conforme a la Ley Federal de Protección de
              Datos Personales en Posesión de los Particulares (LFPDPPP).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">2. Datos personales que recolectamos</h2>
            <p>Para prestar el servicio recolectamos:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Datos de identificación:</strong> nombre, apellidos, fecha de nacimiento.</li>
              <li><strong>Datos de contacto:</strong> correo electrónico, teléfono.</li>
              <li><strong>Datos académicos (estudiantes):</strong> matrícula, institución, campus.</li>
              <li><strong>Datos de la propiedad (arrendadores):</strong> dirección, fotos, características, precio.</li>
              <li><strong>Foto de perfil</strong> (opcional).</li>
              <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, fecha de acceso.</li>
            </ul>
            <p className="mt-2">
              No recolectamos datos sensibles (origen racial, salud, creencias)
              salvo que tú los proporciones voluntariamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">3. Finalidades del tratamiento</h2>
            <p><strong>Finalidades primarias</strong> (necesarias para el servicio):</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Crear y administrar tu cuenta.</li>
              <li>Conectar a estudiantes con arrendadores.</li>
              <li>Mostrar propiedades en la Plataforma.</li>
              <li>Procesar y dar seguimiento a solicitudes de renta.</li>
              <li>Enviar notificaciones operativas (confirmación de cuenta, cambios de estado, etc.).</li>
              <li>Cumplir obligaciones legales y prevenir fraude.</li>
            </ul>
            <p className="mt-3"><strong>Finalidades secundarias</strong> (opcionales, requieren tu consentimiento):</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Envío de comunicaciones promocionales sobre Happy Roomie.</li>
              <li>Análisis estadísticos para mejorar el servicio.</li>
            </ul>
            <p className="mt-2">
              Puedes oponerte a las finalidades secundarias escribiéndonos al
              correo indicado en la sección 8.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">4. Cookies y tecnologías de rastreo</h2>
            <p>
              Usamos cookies y almacenamiento local del navegador para mantener
              tu sesión iniciada, recordar tus preferencias de búsqueda y
              analizar el uso de la Plataforma. Puedes desactivarlas desde tu
              navegador, aunque algunas funciones podrían dejar de funcionar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">5. Transferencias de datos</h2>
            <p>Compartimos algunos de tus datos con terceros para prestar el servicio:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Cloudinary</strong> (almacenamiento de imágenes y videos).</li>
              <li><strong>Resend</strong> (envío de correos transaccionales).</li>
              <li><strong>MongoDB Atlas</strong> (base de datos en la nube).</li>
              <li><strong>Vercel</strong> (hosting del frontend).</li>
            </ul>
            <p className="mt-2">
              Estos proveedores tratan tus datos únicamente bajo nuestras
              instrucciones y conforme a sus políticas de privacidad. No
              vendemos tus datos a terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">6. Derechos ARCO</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Acceder</strong> a tus datos personales que tenemos.</li>
              <li><strong>Rectificar</strong> datos inexactos o incompletos.</li>
              <li><strong>Cancelar</strong> tu cuenta y solicitar la eliminación de tus datos.</li>
              <li><strong>Oponerte</strong> a un tratamiento específico.</li>
              <li><strong>Revocar</strong> tu consentimiento en cualquier momento.</li>
            </ul>
            <p className="mt-2">
              Para ejercer cualquier derecho ARCO, envía tu solicitud al correo
              indicado en la sección 8 con copia de tu identificación oficial.
              Responderemos en un plazo máximo de 20 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">7. Conservación y seguridad</h2>
            <p>
              Conservamos tus datos mientras tu cuenta esté activa o sea
              necesario para los fines descritos. Implementamos medidas
              técnicas y administrativas razonables para proteger tu
              información (cifrado en tránsito, contraseñas hasheadas,
              accesos limitados).
            </p>
            <p className="mt-2">
              Ningún sistema es 100% seguro; en caso de una vulneración te
              notificaremos según lo exige la ley.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">8. Contacto</h2>
            <p>
              Para preguntas sobre este aviso o para ejercer tus derechos
              ARCO, escríbenos a{" "}
              <a href="mailto:privacidad@happyroomie.mx" className="text-brand-accent hover:text-brand-dark">
                privacidad@happyroomie.mx
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">9. Cambios al aviso</h2>
            <p>
              Cualquier modificación se publicará en esta página con la fecha
              de actualización. Te recomendamos revisarlo periódicamente.
            </p>
          </section>

          <p className="pt-8 text-xs text-gray-500 italic">
            Documento base elaborado conforme a la LFPDPPP. Para
            implementaciones comerciales formales, te recomendamos validarlo
            con un abogado especializado en protección de datos.
          </p>
        </div>
      </div>
    </main>
  );
}
