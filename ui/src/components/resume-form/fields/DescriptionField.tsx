import { UseFormRegister, FieldError } from 'react-hook-form';
import { ResumeFormData } from '../types';

interface DescriptionFieldProps {
  register: UseFormRegister<ResumeFormData>;
  error?: FieldError;
}

export function DescriptionField({ register, error }: DescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description <span className="text-red-500">*</span>
      </label>
      <textarea
        {...register('description', {
          required: 'Description is required',
          minLength: {
            value: 10,
            message: 'Description must be at least 10 characters',
          },
        })}
        rows={4}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Tell us about yourself, your skills, and career goals..."
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}
