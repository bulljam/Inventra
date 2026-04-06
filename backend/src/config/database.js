import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        'Missing MONGODB_URI. Add it to backend/.env before starting the server.'
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDatabase;
