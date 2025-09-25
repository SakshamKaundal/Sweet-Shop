'use client';

import { AdminSweetCard } from "@/components/admin/AdminSweetCard";
import { Sweet } from "@/components/SweetCard";

interface AdminSweetsGridProps {
  sweets: Sweet[];
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: string) => void;
}

export const AdminSweetsGrid = ({ sweets, onEdit, onDelete }: AdminSweetsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {sweets.map((sweet) => (
        <AdminSweetCard
          key={sweet.id}
          sweet={sweet}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
