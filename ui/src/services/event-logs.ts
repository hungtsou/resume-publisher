export const getEventLogs = async (workflowId?: string) => {
  const response = await fetch(`/api/worker-events?workflowId=${workflowId}`);
  const data = await response.json();
  return data.events ?? [];
};
