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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Resumes
          </h1>
          <p className="text-gray-600">
            View published resumes here
          </p>
        </div>
        
        <div className="space-y-4">
          {resumes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No resumes yet</p>
          ) : (
            resumes.map((resume) => (
              <Card
                key={resume.id}
                title={resume.fullName}
                description={resume.occupation ?? ''}
                status={resume.published}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Resumes
