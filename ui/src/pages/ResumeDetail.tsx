import { useParams, Link } from 'react-router-dom';
import { useResume } from '../hooks/useResume';
import {
  ResumeDetailHeader,
  ResumeDetailDescription,
  ResumeDetailEducation,
  ResumeDetailExperience,
} from '../components/resume-detail';

function ResumeDetail() {
  const { id } = useParams<{ id: string }>();
  const { resume, loading, error } = useResume(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <p className="text-gray-500 text-center py-8">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <p className="text-red-600 mb-4">{error ?? 'Resume not found'}</p>
          <Link
            to="/resumes"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to resumes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <Link
          to="/resumes"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to resumes
        </Link>

        <ResumeDetailHeader
          fullName={resume.fullName}
          occupation={resume.occupation ?? null}
          published={resume.published}
        />
        <ResumeDetailDescription description={resume.description ?? null} />
        <ResumeDetailEducation education={resume.education ?? []} />
        <ResumeDetailExperience experience={resume.experience ?? []} />
      </div>
    </div>
  );
}

export default ResumeDetail;
