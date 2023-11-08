export default (): any => ({
    seq: {
      serverUrl: process.env.SEQ_SERVER_URL,
      apiKey: process.env.SEQ_API_KEY,
    },
    mongo: {
      uri: process.env.MONGODB_URI,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      modelId: process.env.OPENAI_MODEL,
    },
    rabbitmq: {
      exchangeName: process.env.RABBITMQ_EXCHANGE_NAME,
      uri: process.env.RABBITMQ_URI,
    }
  });
  