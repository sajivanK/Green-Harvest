// import mongoose from "mongoose";


// const connectDB = async () =>{

//     mongoose.connection.on('connected', ()=>console.log("Database Connected"));

//     await mongoose.connect(process.env.MONGODB_URI)
// }

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("✅ MongoDB Atlas Connected")
  );

  mongoose.connection.on("error", (err) =>
    console.error("❌ MongoDB Connection Error:", err)
  );

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
