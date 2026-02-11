import { Control, useFieldArray, UseFormRegister, FieldErrors } from 'react-hook-form';
import { ResumeFormData } from '../types';
import { ExperienceEntry } from '../entries/ExperienceEntry';

interface ExperienceFieldProps {
  control: Control<ResumeFormData>;
  register: UseFormRegister<ResumeFormData>;
  errors: FieldErrors<ResumeFormData>;
}

export function ExperienceField({
  control,
  register,
  errors,
}: ExperienceFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
    rules: {
      required: 'At least one experience entry is required',
      minLength: {
        value: 1,
        message: 'At least one experience entry is required',
      },
    },
  });

  const addExperience = () => {
    append({
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: null,
      isPresent: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Experience <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          <span className="text-lg">+</span>
          <span>Add Experience</span>
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No experience entries yet</p>
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Add Your First Experience Entry
          </button>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <ExperienceEntry
            key={field.id}
            index={index}
            control={control}
            register={register}
            errors={errors}
            onRemove={() => remove(index)}
          />
        ))}
      </div>

      {errors.experience && typeof errors.experience === 'object' && 'message' in errors.experience && (
        <p className="mt-1 text-sm text-red-600">
          {errors.experience.message as string}
        </p>
      )}
    </div>
  );
}
