import { Kafka, type Producer } from 'kafkajs';

const BOOTSTRAP_SERVERS = process.env.KAFKA_BOOTSTRAP_SERVERS ?? 'localhost:9092';
const TOPIC = 'resume_publisher';

let producer: Producer | null = null;

export function getProducer(): Producer {
  if (!producer) {
    const kafka = new Kafka({
      clientId: 'resume-publisher-worker',
      brokers: BOOTSTRAP_SERVERS.split(',').map((s) => s.trim()),
    });
    producer = kafka.producer();
  }
  return producer;
}

export function getTopic(): string {
  return TOPIC;
}

export async function closeProducer(): Promise<void> {
  if (producer) {
    await producer.disconnect();
    producer = null;
  }
}
