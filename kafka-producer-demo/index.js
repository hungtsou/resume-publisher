const { Kafka } = require("kafkajs");

const TOPIC = "quickstart-events"; // use the topic you created

async function main() {
  const kafka = new Kafka({
    clientId: "hello-producer",
    brokers: ["localhost:9092"],
  });

  const producer = kafka.producer();

  try {
    await producer.connect();

    const message = {
      value: JSON.stringify({
        type: "HelloWorld",
        message: "Hello from perroloko again!",
        sentAt: new Date().toISOString(),
      }),
    };

    const result = await producer.send({
      topic: TOPIC,
      messages: [message],
    });

    console.log("✅ Sent message:", result);
  } catch (err) {
    console.error("❌ Producer error:", err);
    process.exitCode = 1;
  } finally {
    await producer.disconnect();
  }
}

main();
