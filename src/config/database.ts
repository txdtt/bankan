import mongoose from 'mongoose';

export const connectDatabase = async() => {
    try {
        mongoose.connect('mongodb://localhost:27017/bankan')
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB: ', error);
        process.exit(1);
    }
};
