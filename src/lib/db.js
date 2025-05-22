import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const connectMongoDB = async (retryCount = 0) => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const mongodb_uri = `${process.env.MONGODB_URI}/an_nur`;
    console.log(`\n⚙ Connecting to MongoDB... Attempt ${retryCount + 1}`);

    const connectionInstance = await mongoose.connect(mongodb_uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(() => connectMongoDB(), RETRY_DELAY);
    });

    console.log(
      `\n✓ MongoDB Connected —⟶ DB Host: ${connectionInstance.connection.host}`
    );

    return connectionInstance;
  } catch (error) {
    console.error(`\n✘ MongoDB Connection Error: ${error}`);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectMongoDB(retryCount + 1);
    } else {
      console.error('Max retry attempts reached. Could not connect to MongoDB.');
      throw error;
    }
  }
};

export { connectMongoDB };
