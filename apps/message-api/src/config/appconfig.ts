export default (): any => ({
    seq: {
      serverUrl: process.env.SEQ_SERVER_URL,
      apiKey: process.env.SEQ_API_KEY,
    },
    mongo: {
      uri: process.env.MONGODB_URI,
    }
  });
  