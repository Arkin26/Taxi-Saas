'use client';

import { useState } from 'react';
import {
  Car,
  FileText,
  Fuel,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  Hash,
} from 'lucide-react';

export default function CabDetailsForm() {
  const [formData, setFormData] = useState({
    cabId: '',
    licensePlate: '',
    model: '',
    brand: '',
    capacity: '',
    notes: '',
    fuelType: 'petrol',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cabCount, setCabCount] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(''); // Clear errors when user types
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Basic validation
      if (!formData.cabId.trim()) throw new Error('Cab ID is required');
      if (!formData.licensePlate.trim()) throw new Error('License plate is required');
      if (!formData.model.trim()) throw new Error('Model is required');
      if (!formData.brand.trim()) throw new Error('Brand is required');
      if (!formData.capacity.trim()) throw new Error('Capacity is required');
      if (!formData.fuelType) throw new Error('Fuel type is required');

      const payload = {
        cabId: formData.cabId.trim(),
        licensePlate: formData.licensePlate.trim().toUpperCase(),
        model: formData.model.trim(),
        brand: formData.brand.trim(),
        capacity: parseInt(formData.capacity),
        notes: formData.notes.trim() || undefined,
        fuelType: formData.fuelType,
      };

      const res = await fetch('/api/cabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('API Response:', result);

      if (res.ok) {
        setSuccessMessage(`✅ Cab registered successfully! Cab ID: ${result.cab?.cabId}`);
        setCabCount((prev) => prev + 1);

        // Reset form
        setFormData({
          cabId: '',
          licensePlate: '',
          model: '',
          brand: '',
          capacity: '',
          notes: '',
          fuelType: 'petrol',
        });

        setTimeout(() => setSuccessMessage(''), 8000);
      } else {
        throw new Error(result.error || 'Unknown server error');
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Vehicle Registration
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Register a new vehicle in your fleet. Fill in the basic vehicle details to get started.
          </p>
          {cabCount > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              {cabCount} vehicle{cabCount > 1 ? 's' : ''} registered successfully
            </div>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">

            {/* Vehicle Info */}
            <div className="space-y-6">
              <SectionHeader icon={<Car />} title="Vehicle Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWithIcon
                  label="Cab ID"
                  name="cabId"
                  icon={<Hash className="w-5 h-5" />}
                  value={formData.cabId}
                  onChange={handleChange}
                  required
                  placeholder="CAB001, CAB002, etc."
                />
                <InputWithIcon
                  label="License Plate"
                  name="licensePlate"
                  icon={<FileText className="w-5 h-5" />}
                  value={formData.licensePlate}
                  onChange={handleChange}
                  required
                  placeholder="MH12AB1234"
                />
                <InputWithIcon
                  label="Brand"
                  name="brand"
                  icon={<Car className="w-5 h-5" />}
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="Maruti Suzuki, Toyota, etc."
                />
                <InputWithIcon
                  label="Model"
                  name="model"
                  icon={<Car className="w-5 h-5" />}
                  value={formData.model}
                  onChange={handleChange}
                  required
                  placeholder="Swift Dzire, Innova, etc."
                />
                <InputWithIcon
                  label="Capacity"
                  name="capacity"
                  type="number"
                  icon={<Users className="w-5 h-5" />}
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  placeholder="4, 6, 8, etc."
                />
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Fuel Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-green-500 transition-colors">
                      <Fuel className="w-5 h-5" />
                    </span>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:border-green-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white appearance-none"
                    >
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Notes Section */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes about the vehicle..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-0 transition-all duration-200 resize-none bg-gray-50/50 hover:bg-white focus:bg-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering Vehicle...
                  </>
                ) : cabCount > 0 ? (
                  <>
                    <Car className="w-5 h-5" />
                    Add Another Vehicle
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Register Vehicle
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    </div>
  );
}

function InputWithIcon({
  label,
  name,
  icon,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder,
}: {
  label: string;
  name: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (e: any) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-green-500 transition-colors">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          min={type === 'number' ? '1' : undefined}
          className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white placeholder-gray-500 ${
            icon ? 'pl-12' : ''
          }`}
        />
      </div>
    </div>
  );
}

