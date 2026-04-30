import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos de uso de la plataforma Happy Roomie.",
};

export default function TerminosPage() {
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
          Términos y Condiciones de Uso
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Última actualización: 29 de abril de 2026
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">1. Aceptación de los términos</h2>
            <p>
              Al registrarte y utilizar Happy Roomie (la &quot;Plataforma&quot;), aceptas
              estos Términos y Condiciones en su totalidad. Si no estás de
              acuerdo con alguna parte, te pedimos no usar la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">2. Descripción del servicio</h2>
            <p>
              Happy Roomie es un marketplace que conecta a estudiantes
              universitarios con arrendadores de habitaciones y propiedades
              cercanas a campus universitarios en México. La Plataforma
              facilita el contacto y la búsqueda; <strong>no es parte del contrato
              de arrendamiento</strong> que se celebre entre las partes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">3. Cuentas y elegibilidad</h2>
            <p>Para usar la Plataforma debes:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Ser mayor de edad (18 años) o contar con autorización de tu tutor.</li>
              <li>Proporcionar información verídica y mantenerla actualizada.</li>
              <li>Mantener la confidencialidad de tu contraseña.</li>
              <li>Si te registras como estudiante, contar con matrícula vigente en una institución educativa.</li>
              <li>Si te registras como arrendador, ser el propietario o estar autorizado para arrendar la propiedad.</li>
            </ul>
            <p className="mt-2">
              Eres responsable de toda la actividad que ocurra bajo tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">4. Conductas prohibidas</h2>
            <p>Está prohibido:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Publicar información falsa, engañosa o de propiedades que no controlas.</li>
              <li>Acosar, discriminar o amenazar a otros usuarios.</li>
              <li>Solicitar pagos fuera de los canales permitidos por la Plataforma.</li>
              <li>Usar la Plataforma para actividades ilegales o que violen derechos de terceros.</li>
              <li>Suplantar la identidad de otra persona o entidad.</li>
              <li>Realizar scraping automatizado o extracción masiva de datos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">5. Contenido del usuario</h2>
            <p>
              Al subir fotos, descripciones o cualquier contenido relacionado a
              tu propiedad o perfil, declaras que tienes los derechos
              necesarios y otorgas a Happy Roomie una licencia no exclusiva
              para mostrar dicho contenido en la Plataforma con el fin de
              prestar el servicio.
            </p>
            <p className="mt-2">
              Nos reservamos el derecho de remover contenido que viole estos
              Términos o resulte ofensivo, sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">6. Limitación de responsabilidad</h2>
            <p>
              Happy Roomie actúa como intermediario y no garantiza la
              veracidad, calidad o seguridad de las propiedades, ni la conducta
              de los usuarios. <strong>El contrato de arrendamiento es exclusivamente
              entre el arrendador y el inquilino</strong>; cualquier disputa, daño,
              incumplimiento o controversia se resuelve directamente entre
              ellos.
            </p>
            <p className="mt-2">
              En la máxima medida permitida por la ley, Happy Roomie no será
              responsable por daños indirectos, lucro cesante o pérdida de
              datos derivados del uso de la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">7. Suspensión y terminación</h2>
            <p>
              Podemos suspender o terminar tu cuenta si incumples estos
              Términos, sin que ello genere obligación de devolución alguna.
              Tú puedes cerrar tu cuenta en cualquier momento desde tu perfil.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">8. Modificaciones</h2>
            <p>
              Podemos actualizar estos Términos. Los cambios sustanciales se
              comunicarán por correo o notificación en la Plataforma con al
              menos 15 días de anticipación. Si continúas usando la Plataforma
              después de la fecha de entrada en vigor, aceptas los nuevos
              Términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">9. Ley aplicable y jurisdicción</h2>
            <p>
              Estos Términos se rigen por las leyes de los Estados Unidos
              Mexicanos. Cualquier controversia se someterá a los tribunales
              competentes de Guadalajara, Jalisco, renunciando a cualquier
              otro fuero que pudiera corresponder.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-dark mt-8 mb-3">10. Contacto</h2>
            <p>
              Para dudas o aclaraciones sobre estos Términos, escríbenos a{" "}
              <a href="mailto:contacto@happyroomie.mx" className="text-brand-accent hover:text-brand-dark">
                contacto@happyroomie.mx
              </a>
              .
            </p>
          </section>

          <p className="pt-8 text-xs text-gray-500 italic">
            Este documento es una versión base. Para casos comerciales o
            disputas específicas, consulta con un abogado.
          </p>
        </div>
      </div>
    </main>
  );
}
