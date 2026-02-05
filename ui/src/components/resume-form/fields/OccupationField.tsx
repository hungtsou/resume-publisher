import { UseFormRegister, FieldError } from 'react-hook-form';
import { ResumeFormData } from '../types';

interface OccupationFieldProps {
  register: UseFormRegister<ResumeFormData>;
  error?: FieldError;
}

export function OccupationField({ register, error }: OccupationFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Occupation <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register('occupation', {
          required: 'Occupation is required',
          minLength: {
            value: 2,
            message: 'Occupation must be at least 2 characters',
          },
        })}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="e.g., Software Engineer"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}
