"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/modules/global_components/context_files/AuthContext";

type Role = "student" | "arrendador";

interface AuthGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ allowedRoles, children, redirectTo }: AuthGuardProps) {
  const { userType, loading } = useAuthContext() as {
    userType: Role | null;
    loading: boolean;
  };
  const router = useRouter();

  const defaultRedirect =
    allowedRoles.includes("student") && !allowedRoles.includes("arrendador")
      ? "/login-student"
      : "/login-landlord";
  const target = redirectTo || defaultRedirect;

  const allowed = !loading && userType !== null && allowedRoles.includes(userType);

  useEffect(() => {
    if (loading) return;
    if (!allowed) router.replace(target);
  }, [loading, allowed, target, router]);

  if (loading || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-brand-dark">Cargando...</div>
      </div>
    );
  }

  return <>{children}</>;
}
