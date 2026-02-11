import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getResumes } from '../services/resume-publisher';
import type { Resume, ResumeFormData } from '../components/resume-form/types';
import Card from '../components/Card';
import { getEventLogs } from '../services/event-logs';

type ListItem =
  | { type: 'api'; data: Resume }
  | { type: 'submitted'; data: ResumeFormData };

const PUBLISH_COMPLETE_STEPS = ['resumePublish', 'resumePublished'];

function Resumes() {
  const [apiResumes, setApiResumes] = useState<Resume[]>([]);
  const [publishComplete, setPublishComplete] = useState(false);
  const { state } = useLocation();
  const submittedResume = (state as { submittedResume?: ResumeFormData } | null)
    ?.submittedResume;
  const workflowId = (state as { workflowId?: string } | null)
    ?.workflowId;

  const fetchResumes = async () => {
    const response = await getResumes();
    const sortedResumes = (response.resumes as Resume[]).reverse();
    setApiResumes(sortedResumes);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    if (!workflowId || publishComplete) return;
    const fetchEventLogs = async () => {
      const events = await getEventLogs(workflowId);
      const hasPublishComplete = events.some(
        (e: { step?: string }) => e.step && PUBLISH_COMPLETE_STEPS.includes(e.step)
      );
      if (hasPublishComplete) {
        setPublishComplete(true);
        await fetchResumes();
      }
    };
    fetchEventLogs();
    const intervalId = setInterval(fetchEventLogs, 5000);
    return () => clearInterval(intervalId);
  }, [workflowId, publishComplete]);

  const items: ListItem[] = [
    ...(submittedResume && !publishComplete
      ? [{ type: 'submitted' as const, data: submittedResume }]
      : []),
    ...apiResumes.map((r) => ({ type: 'api' as const, data: r })),
  ];

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
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : (
            items.map((item, index) => {
              const title = item.data.fullName;
              const description = item.data.occupation ?? '';
              const published = item.type === 'api' ? item.data.published : false;
              const isClickable =
                item.type === 'api' && item.data.published && item.data.id;
              const key =
                item.type === 'api' ? item.data.id : `submitted-${index}`;

              const card = (
                <Card
                  title={title}
                  description={description}
                  status={published}
                />
              );

              return isClickable ? (
                <Link key={key} to={`/resumes/${(item.data as Resume).id}`} className="block">
                  {card}
                </Link>
              ) : (
                <div key={key}>{card}</div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Resumes
