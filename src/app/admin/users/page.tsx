// src/app/admin/users/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CreateUserForm } from '@/components/CreateUserForm';
import { UserRole } from '@/types';

export default function AdminUserManagementPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin: User Management</h1>
        <p className="text-gray-600">Only users with ADMIN or MANAGER roles can access this page.</p>
        <CreateUserForm />
        {/* Future: Add a component to list and manage existing users */}
      </div>
    </ProtectedRoute>
  );
}
