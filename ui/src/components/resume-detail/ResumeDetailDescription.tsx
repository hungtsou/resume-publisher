interface ResumeDetailDescriptionProps {
  description: string | null;
}

export function ResumeDetailDescription({ description }: ResumeDetailDescriptionProps) {
  if (!description?.trim()) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
      <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
    </section>
  );
}
