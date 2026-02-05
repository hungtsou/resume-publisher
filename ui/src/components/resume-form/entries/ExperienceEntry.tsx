import { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { ResumeFormData } from '../types';
import { DateRangeInput } from '../shared/DateRangeInput';

interface ExperienceEntryProps {
  index: number;
  control: Control<ResumeFormData>;
  register: UseFormRegister<ResumeFormData>;
  errors: FieldErrors<ResumeFormData>;
  onRemove: () => void;
}

export function ExperienceEntry({
  index,
  control,
  register,
  errors,
  onRemove,
}: ExperienceEntryProps) {
  const experienceErrors = errors.experience?.[index];

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Experience {index + 1}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
        >
          Remove
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register(`experience.${index}.company` as const, {
            required: 'Company name is required',
            minLength: {
              value: 2,
              message: 'Company name must be at least 2 characters',
            },
          })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            experienceErrors?.company
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
          placeholder="e.g., Google Inc."
        />
        {experienceErrors?.company && (
          <p className="mt-1 text-sm text-red-600">
            {experienceErrors.company.message}
          </p>
        )}
      </div>

      <DateRangeInput
        control={control}
        
        startDateName={`experience.${index}.startDate` as const}
        endDateName={`experience.${index}.endDate` as const}
        
      />
    </div>
  );
}
