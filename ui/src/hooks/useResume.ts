import { useState, useEffect } from 'react';
import { getResumeById } from '../services/resume-publisher';
import type { Resume } from '../components/resume-form/types';

async function fetchResume(
  id: string,
  callbacks: {
    setResume: (resume: Resume) => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
  },
  isCancelled: () => boolean
) {
  try {
    const data = await getResumeById(id);
    if (!isCancelled()) {
      callbacks.setResume(data as Resume);
    }
  } catch (err) {
    if (!isCancelled()) {
      callbacks.setError(
        err instanceof Error ? err.message : 'Failed to load resume'
      );
    }
  } finally {
    if (!isCancelled()) {
      callbacks.setLoading(false);
    }
  }
}

export function useResume(id: string | undefined) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setResume(null);

    fetchResume(
      id,
      { setResume, setError, setLoading },
      () => cancelled
    );

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { resume, loading, error };
}
