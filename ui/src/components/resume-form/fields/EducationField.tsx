import { Control, useFieldArray, UseFormRegister, FieldErrors } from 'react-hook-form';
import { ResumeFormData } from '../types';
import { EducationEntry } from '../entries/EducationEntry';

interface EducationFieldProps {
  control: Control<ResumeFormData>;
  register: UseFormRegister<ResumeFormData>;
  errors: FieldErrors<ResumeFormData>;
}

export function EducationField({
  control,
  register,
  errors,
}: EducationFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
    rules: {
      required: 'At least one education entry is required',
      minLength: {
        value: 1,
        message: 'At least one education entry is required',
      },
    },
  });

  const addEducation = () => {
    append({
      institution: '',
      degree: '',
      startDate: '',
      endDate: null,
      isPresent: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Education <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          <span className="text-lg">+</span>
          <span>Add Education</span>
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No education entries yet</p>
          <button
            type="button"
            onClick={addEducation}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Add Your First Education Entry
          </button>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <EducationEntry
            key={field.id}
            index={index}
            control={control}
            register={register}
            errors={errors}
            onRemove={() => remove(index)}
          />
        ))}
      </div>

      {errors.education && typeof errors.education === 'object' && 'message' in errors.education && (
        <p className="mt-1 text-sm text-red-600">
          {errors.education.message as string}
        </p>
      )}
    </div>
  );
}
