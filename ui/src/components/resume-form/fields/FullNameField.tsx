import { UseFormRegister, FieldError } from 'react-hook-form';
import { ResumeFormData } from '../types';

interface FullNameFieldProps {
  register: UseFormRegister<ResumeFormData>;
  error?: FieldError;
}

export function FullNameField({ register, error }: FullNameFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Full Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register('fullName', {
          required: 'Full name is required',
          minLength: {
            value: 2,
            message: 'Full name must be at least 2 characters',
          },
        })}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="e.g., John Doe"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}
