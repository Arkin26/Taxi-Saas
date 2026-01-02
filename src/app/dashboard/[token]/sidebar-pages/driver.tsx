'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Upload,
  FileText,
  MapPin,
  UserRound,
  Phone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

interface DriverDetailsFormProps {
  taxiId: string;
}

export default function DriverDetailsForm({ taxiId }: DriverDetailsFormProps) {

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    licenseNumber: '',
    licenseExpiry: '',
    aadharNumber: '',
    address: '',
    aadharImage: null as File | null,
    licenseImage: null as File | null,
    profilePhoto: null as File | null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    aadharImage: null as string | null,
    licenseImage: null as string | null,
    profilePhoto: null as string | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [driverCount, setDriverCount] = useState(0);

  // New state for field validation
  const [fieldErrors, setFieldErrors] = useState({
    phoneNumber: '',
    licenseNumber: '',
    aadharNumber: '',
  });

  const [validationLoading, setValidationLoading] = useState({
    phoneNumber: false,
    licenseNumber: false,
    aadharNumber: false,
  });

  // Debounced validation function
  const validateField = useCallback(
    async (fieldName: string, value: string) => {
      if (!value.trim()) {
        setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
        return;
      }

      setValidationLoading(prev => ({ ...prev, [fieldName]: true }));

      try {
        const response = await fetch('/api/driver/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            field: fieldName,
            value: value.trim(),
          }),
        });

        const result = await response.json();

        if (result.exists) {
          setFieldErrors(prev => ({
            ...prev,
            [fieldName]: `This ${fieldName === 'phoneNumber' ? 'phone number' : 
                                  fieldName === 'licenseNumber' ? 'license number' : 
                                  'Aadhar number'} is already registered with another driver`,
          }));
        } else {
          setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
      } catch (error) {
        console.error('Validation error:', error);
      } finally {
        setValidationLoading(prev => ({ ...prev, [fieldName]: false }));
      }
    },
    []
  );

  // Debounce hook
  const useDebounce = (callback: Function, delay: number) => {
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    return useCallback((...args: any[]) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      const newTimer = setTimeout(() => callback(...args), delay);
      setDebounceTimer(newTimer);
    }, [callback, delay, debounceTimer]);
  };

  const debouncedValidate = useDebounce(validateField, 800);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(''); // Clear general errors when user types

    // Trigger validation for specific fields
    if (['phoneNumber', 'licenseNumber', 'aadharNumber'].includes(name)) {
      debouncedValidate(name, value);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`${name} file size should be less than 10MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage(`${name} should be an image file`);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: file }));
    setImagePreviews((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(file),
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Basic validation
      if (!formData.fullName.trim()) throw new Error('Full name is required');
      if (!formData.phoneNumber.trim()) throw new Error('Phone number is required');
      if (!formData.aadharNumber.trim()) throw new Error('Aadhar number is required');
      if (!formData.licenseNumber.trim()) throw new Error('License number is required');
      if (!formData.licenseExpiry) throw new Error('License expiry date is required');
      if (!formData.address.trim()) throw new Error('Address is required');

      // Check for field errors before submitting
      const hasFieldErrors = Object.values(fieldErrors).some(error => error !== '');
      if (hasFieldErrors) {
        throw new Error('Please fix the validation errors before submitting');
      }

      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phoneNumber.trim(),
        aadharNo: formData.aadharNumber.trim(),
        licenseNo: formData.licenseNumber.trim(),
        licenseExpiry: formData.licenseExpiry,
        address: formData.address.trim(),
        aadharImage: 'https://example.com/aadhar-placeholder.jpg',
        licenseImage: 'https://example.com/license-placeholder.jpg',
        profilePhoto: 'https://example.com/profile-placeholder.jpg'
      };

      const res = await fetch('/api/driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('API Response:', result);

      if (res.ok) {
        setSuccessMessage(`✅ Driver registered! Driver ID: ${result.driver?.driverId}`);
        setDriverCount((prev) => prev + 1);

        // Reset form
        setFormData({
          fullName: '',
          phoneNumber: '',
          licenseNumber: '',
          licenseExpiry: '',
          aadharNumber: '',
          address: '',
          aadharImage: null,
          licenseImage: null,
          profilePhoto: null,
        });

        setImagePreviews({
          aadharImage: null,
          licenseImage: null,
          profilePhoto: null,
        });

        // Reset field errors
        setFieldErrors({
          phoneNumber: '',
          licenseNumber: '',
          aadharNumber: '',
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
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <UserRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Driver Registration
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Complete the form below to register a new driver. All fields are required for verification purposes.
          </p>
          {driverCount > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              {driverCount} driver{driverCount > 1 ? 's' : ''} registered successfully
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

            {/* Personal Info */}
            <div className="space-y-6">
              <SectionHeader icon={<UserRound />} title="Personal Information" />
              <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6">
                <InputWithIcon
                  label="Full Name"
                  name="fullName"
                  icon={<UserRound className="w-5  h-5" />}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
                <InputWithIcon
                  label="Phone Number"
                  name="phoneNumber"
                  icon={<Phone className="w-5 h-5" />}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  error={fieldErrors.phoneNumber}
                  loading={validationLoading.phoneNumber}
                />
                <div className="md:col-span-1 text-black">
                  <InputWithIcon
                    label="Aadhar Number"
                    name="aadharNumber"
                    icon={<CreditCard className="w-5 h-5" />}
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    required
                    placeholder="1234 5678 9012"
                    error={fieldErrors.aadharNumber}
                    loading={validationLoading.aadharNumber}
                  />
                </div>
              </div>
              <div className="space-y-2 text-black">
                <label className="block text-sm  font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address *
                </label>
                <textarea
                  name="address"
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your complete address..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 transition-all duration-200 resize-none bg-gray-50/50 hover:bg-white focus:bg-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* License Info */}
            <div className="space-y-6">
              <SectionHeader icon={<CreditCard />} title="License Details" />
              <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWithIcon
                  label="License Number"
                  name="licenseNumber"
                  icon={<CreditCard className="w-5 h-5" />}
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                  placeholder="DL1420110012345"
                  error={fieldErrors.licenseNumber}
                  loading={validationLoading.licenseNumber}
                />
                <InputWithIcon
                  label="License Expiry Date"
                  name="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-6">
              <SectionHeader icon={<Upload />} title="Document Upload" />
              <div className="text-black grid grid-cols-1 md:grid-cols-3 gap-6">
                <ImageUpload
                  label="Profile Photo"
                  name="profilePhoto"
                  image={imagePreviews.profilePhoto}
                  onChange={handleImageChange}
                  description="Clear photo of face"
                />
                <ImageUpload
                  label="Aadhar Card"
                  name="aadharImage"
                  image={imagePreviews.aadharImage}
                  onChange={handleImageChange}
                  description="Front side of Aadhar"
                />
                <ImageUpload
                  label="License Image"
                  name="licenseImage"
                  image={imagePreviews.licenseImage}
                  onChange={handleImageChange}
                  description="Front side of license"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || Object.values(fieldErrors).some(error => error !== '')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Registration...
                  </>
                ) : driverCount > 0 ? (
                  <>
                    <UserRound className="w-5 h-5" />
                    Add Another Driver
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Register Driver
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
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
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
  error,
  loading = false,
}: {
  label: string;
  name: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (e: any) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  error?: string;
  loading?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {icon && (
          <span className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-colors ${
            error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'
          }`}>
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
          className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-0 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white placeholder-gray-500 ${
            icon ? 'pl-12' : ''
          } ${
            error 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-200 focus:border-blue-500'
          }`}
        />
        {loading && (
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          </span>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

function ImageUpload({
  label,
  name,
  image,
  onChange,
  description,
}: {
  label: string;
  name: string;
  image: string | null;
  onChange: (e: any) => void;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label}
        </label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <label className="group relative block border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 bg-gray-50/50 hover:bg-blue-50/50 min-h-[200px] flex flex-col items-center justify-center">
        <input
          type="file"
          name={name}
          onChange={onChange}
          accept="image/*"
          className="hidden"
        />
        {image ? (
          <div className="relative">
            <img
              src={image}
              alt={name}
              className="mx-auto h-32 w-32 object-cover rounded-xl shadow-md"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                Click to change
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 group-hover:text-blue-500 transition-colors">
            <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium mb-1">Click to upload</span>
            <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
          </div>
        )}
      </label>
    </div>
  );
}
