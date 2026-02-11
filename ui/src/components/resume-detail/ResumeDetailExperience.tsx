import type { ExperienceEntry } from '../resume-form/types';

function formatDateRange(startDate: string, endDate: string | null, isPresent?: boolean): string {
  const format = (d: string) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  };
  const start = format(startDate);
  const end = isPresent ? 'Present' : endDate ? format(endDate) : '—';
  return `${start} – ${end}`;
}

interface ResumeDetailExperienceProps {
  experience: ExperienceEntry[];
}

export function ResumeDetailExperience({ experience }: ResumeDetailExperienceProps) {
  if (!experience?.length) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Experience</h2>
      <div className="space-y-4">
        {experience.map((entry, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <h3 className="font-semibold text-gray-800">{entry.company}</h3>
            <p className="text-gray-600 text-sm mt-1">{entry.jobTitle}</p>
            <p className="text-gray-500 text-sm mt-1">
              {formatDateRange(
                entry.startDate,
                entry.endDate ?? null,
                entry.isPresent
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
