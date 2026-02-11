import { Kafka } from 'kafkajs';
import { append } from './store.ts';
import type { WorkerEvent } from './types.ts';

const BOOTSTRAP_SERVERS = process.env.KAFKA_BOOTSTRAP_SERVERS ?? 'localhost:9092';
const TOPIC = 'resume_publisher';
const MAX_CONSUMER_ATTEMPTS = 10;
const CONSUMER_RETRY_DELAY_MS = 3000;

let consumer: Awaited<ReturnType<Kafka['consumer']>> | null = null;

export async function startConsumer(): Promise<void> {
  const kafka = new Kafka({
    clientId: 'resume-publisher-api',
    brokers: BOOTSTRAP_SERVERS.split(',').map((s) => s.trim()),
  });
  consumer = kafka.consumer({ groupId: 'resume-publisher-api-consumer' });

  for (let attempt = 1; attempt <= MAX_CONSUMER_ATTEMPTS; attempt++) {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: TOPIC, fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ message }) => {
          const value = message.value?.toString();
          if (!value) return;
          try {
            const payload = JSON.parse(value) as WorkerEvent;
            append({
              workflowId: payload.workflowId ?? '',
              runId: payload.runId ?? '',
              event: payload.event ?? '',
              step: payload.step ?? '',
              message: payload.message ?? '',
              timestamp: payload.timestamp ?? new Date().toISOString(),
            });
            console.log(`Worker event received: ${payload.event} ${payload.step} - ${payload.message}`);
          } catch {
            // Skip malformed messages
          }
        },
      });
      return;
    } catch (err) {
      await consumer.disconnect().catch(() => {});
      consumer = null;
      consumer = kafka.consumer({ groupId: 'resume-publisher-api-consumer' });
      if (attempt === MAX_CONSUMER_ATTEMPTS) throw err;
      console.warn(
        `Worker events consumer attempt ${attempt}/${MAX_CONSUMER_ATTEMPTS} failed (e.g. group coordinator not ready), retrying in ${CONSUMER_RETRY_DELAY_MS}ms:`,
        err
      );
      await new Promise((r) => setTimeout(r, CONSUMER_RETRY_DELAY_MS));
    }
  }
}

export async function stopConsumer(): Promise<void> {
  if (consumer) {
    await consumer.disconnect();
    consumer = null;
  }
}
