import mongoose from "mongoose";


/*const db = process.env.MONGO_URI;
export const connectDB = async () => {
    const { connection } = await mongoose.connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    console.log(`MongoDB connected with ${connection.host}`);
};*/
export const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("Database Connected successfully");
    }).catch(err => {
        console.log(err);
    });
}

