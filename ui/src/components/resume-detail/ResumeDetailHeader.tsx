interface ResumeDetailHeaderProps {
  fullName: string;
  occupation: string | null;
  published: boolean;
}

export function ResumeDetailHeader({ fullName, occupation, published }: ResumeDetailHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">{fullName}</h1>
      {occupation && (
        <p className="text-lg text-gray-600 mb-3">{occupation}</p>
      )}
      <div className="flex items-center gap-2">
        {published ? (
          <>
            <svg
              className="w-5 h-5 text-green-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-green-700">Published</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 text-amber-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-amber-700">Pending</span>
          </>
        )}
      </div>
    </div>
  );
}
