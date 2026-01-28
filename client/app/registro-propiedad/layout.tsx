import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registra tu Propiedad | Happy Roomie',
  description: 'Completa el formulario para publicar tu propiedad en Happy Roomie',
};

/**
 * Layout for Property Registration Flow
 * Minimal layout without navigation bar for focused form experience
 */
export default function RegistroPropiedadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}