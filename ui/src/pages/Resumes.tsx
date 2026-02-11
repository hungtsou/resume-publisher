import { Link } from 'react-router-dom';
import { getResumes } from '../services/resume-publisher';
import { useState, useEffect } from 'react';
import type { Resume } from '../components/resume-form/types';
import Card from '../components/Card';

function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    const fetchResumes = async () => {
      const response = await getResumes();
      const sortedResumes = response.resumes.reverse();
      setResumes(sortedResumes as Resume[]);
    }
    fetchResumes();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 space-y-6">
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-2"
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
          Back
        </Link>
        <div className="space-y-4">
          {resumes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : (
            resumes.map((resume) => (
              <Link
                key={resume.id}
                to={`/resumes/${resume.id}`}
                className="block"
              >
                <Card
                  title={resume.fullName}
                  description={resume.occupation ?? ''}
                  status={resume.published}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Resumes
