export default (): any => ({
    database: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    seq: {
      serverUrl: process.env.SEQ_SERVER_URL,
      apiKey: process.env.SEQ_API_KEY,
    },
    rabbitmq: {
      exchangeName: process.env.RABBITMQ_EXCHANGE_NAME,
      uri: process.env.RABBITMQ_URI,
    }
  });
  