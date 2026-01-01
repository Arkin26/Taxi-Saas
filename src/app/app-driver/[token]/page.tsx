'use client';

import { useParams } from 'next/navigation';
import DriverForm from '@/app/dashboard/[token]/sidebar-pages/driver'; // adjust if named differently

export default function AddDriverPage() {
  const { taxiId } = useParams();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Driver for Taxi ID: {taxiId}</h1>
      <DriverForm taxiId={taxiId as string} />
    </div>
  );
}
