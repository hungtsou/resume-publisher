import { getProducer, getTopic } from './client';
import type { WorkerEventPayload } from './types';

export async function publishEvent(payload: WorkerEventPayload): Promise<void> {
  const eventProducer = getProducer();
  const topic = getTopic();
  const body = {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
  };
  await eventProducer.send({
    topic,
    messages: [{ value: JSON.stringify(body) }],
  });
  console.log(`Event published to Kafka: ${payload.event} ${payload.step} - ${payload.message}`);
}
