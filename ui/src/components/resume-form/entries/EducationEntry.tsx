import { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { ResumeFormData } from '../types';
import { DateRangeInput } from '../shared/DateRangeInput';

interface EducationEntryProps {
  index: number;
  control: Control<ResumeFormData>;
  register: UseFormRegister<ResumeFormData>;
  errors: FieldErrors<ResumeFormData>;
  onRemove: () => void;
}

export function EducationEntry({
  index,
  control,
  register,
  errors,
  onRemove,
}: EducationEntryProps) {
  const educationErrors = errors.education?.[index];

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Education {index + 1}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register(`education.${index}.institution` as const, {
              required: 'Institution name is required',
              minLength: {
                value: 2,
                message: 'Institution name must be at least 2 characters',
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              educationErrors?.institution
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="e.g., University of California"
          />
          {educationErrors?.institution && (
            <p className="mt-1 text-sm text-red-600">
              {educationErrors.institution.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree/Certification <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register(`education.${index}.degree`, {
              required: 'Degree/Certification is required',
              minLength: {
                value: 2,
                message: 'Degree must be at least 2 characters',
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              educationErrors?.degree
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="e.g., Bachelor of Science in Computer Science"
          />
          {educationErrors?.degree && (
            <p className="mt-1 text-sm text-red-600">
              {educationErrors.degree.message}
            </p>
          )}
        </div>
      </div>

      <DateRangeInput
        control={control}
        startDateName={`education.${index}.startDate` as const}
        endDateName={`education.${index}.endDate` as const}
      />
    </div>
  );
}
