import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
import { getProducer, closeProducer } from './event-publisher/index';

async function run() {
  // Step 1: Establish a connection with Temporal server.
  //
  // Worker code uses `@temporalio/worker.NativeConnection`.
  // (But in your application code it's `@temporalio/client.Connection`.)
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    // TLS and gRPC metadata configuration goes here.
  });

  // Connect event-publisher (Kafka producer) for worker events (retry on transient failure)
  const bootstrapServers = process.env.KAFKA_BOOTSTRAP_SERVERS ?? 'localhost:9092';
  console.log('Event publisher Kafka bootstrap servers:', bootstrapServers);
  const maxConnectAttempts = 5;
  const connectDelayMs = 2000;
  try {
    const producer = getProducer();
    for (let attempt = 1; attempt <= maxConnectAttempts; attempt++) {
      try {
        await producer.connect();
        console.log('Event publisher (Kafka) connected');
        break;
      } catch (err) {
        if (attempt === maxConnectAttempts) throw err;
        console.warn(`Event publisher (Kafka) connect attempt ${attempt}/${maxConnectAttempts} failed, retrying in ${connectDelayMs}ms:`, err);
        await new Promise((r) => setTimeout(r, connectDelayMs));
      }
    }
  } catch (err) {
    console.warn('Event publisher (Kafka) not connected, events will not be sent:', err);
  }

  try {
    // Step 2: Register Workflows and Activities with the Worker.
    const worker = await Worker.create({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
      taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'publish-resume-task',
      // Workflows are registered using a path as they run in a separate JS context.
      workflowsPath: require.resolve('./workflows'),
      activities,
    });

    // Step 3: Start accepting tasks on the `publish-resume-task` queue
    //
    // The worker runs until it encounters an unexpected error or the process receives a shutdown signal registered on
    // the SDK Runtime object.
    //
    // By default, worker logs are written via the Runtime logger to STDERR at INFO level.
    //
    // See https://typescript.temporal.io/api/classes/worker.Runtime#install to customize these defaults.
    await worker.run();
  } finally {
    await closeProducer();
    // Close the connection once the worker has stopped
    await connection.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
