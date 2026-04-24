"use client";
import UserDashboard from '@/modules/Students/UserDashboard';
import AuthGuard from '@/modules/global_components/components/AuthGuard';

export default function profile_page() {
  return (
    <AuthGuard allowedRoles={["student"]}>
      <UserDashboard />
    </AuthGuard>
  );
}
