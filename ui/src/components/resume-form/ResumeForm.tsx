import { useForm } from 'react-hook-form';
import { ResumeFormData } from './types';
import { FullNameField } from './fields/FullNameField';
import { OccupationField } from './fields/OccupationField';
import { DescriptionField } from './fields/DescriptionField';
import { EducationField } from './fields/EducationField';
import { ExperienceField } from './fields/ExperienceField';
import { publishResume } from '../../services/resume-publisher';

export function ResumeForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResumeFormData>({
    defaultValues: {
      fullName: 'john doe',
      occupation: 'software engineer',
      description: 'i am a software engineer with a passion for building web applications',
      education: [
        {
          institution: 'harvard university',
          degree: 'bachelor of science in computer science',
          startDate: '2016-09-01',
          endDate: '2020-05-01',
        },
      ],
      experience: [
        {
          company: 'google',
          jobTitle: 'software engineer',
          startDate: '2016-09-01',
          endDate: '2020-05-01',
        },
      ],
    },
  });

  const onSubmit = async (data: ResumeFormData) => {
    console.log('Form submitted:', data);
    const response = await publishResume(data);
    console.log('Response:', response);
    // const response = await check()
    // console.log('Response check:', response);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Resume Form
          </h1>
          <p className="text-gray-600">
            Fill out your resume information below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FullNameField register={register} error={errors.fullName} />

          <OccupationField register={register} error={errors.occupation} />

          <DescriptionField register={register} error={errors.description} />

          <EducationField
            control={control}
            register={register}
            errors={errors}
          />

          <ExperienceField
            control={control}
            register={register}
            errors={errors}
          />

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
