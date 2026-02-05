import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface DateRangeInputProps<T extends FieldValues> {
  control: Control<T>;
  startDateName: Path<T>;
  endDateName: Path<T>;
  startDateLabel?: string;
  endDateLabel?: string;
}

export function DateRangeInput<T extends FieldValues>({
  control,
  startDateName,
  endDateName,
  startDateLabel = 'Start Date',
  endDateLabel = 'End Date',
}: DateRangeInputProps<T>) {

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name={startDateName}
          control={control}
          rules={{ required: 'Start date is required' }}
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {startDateLabel}
              </label>
              <input
                type="date"
                {...field}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  fieldState.error
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {fieldState.error && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name={endDateName}
          control={control}
          rules={{ required: 'End date is required' }}
          render={({ field, fieldState }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  {endDateLabel}
              </label>
              <input
                type="date"
                {...field}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  fieldState.error
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {fieldState.error && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
