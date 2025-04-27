import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import farmerRouter from "./routes/farmerRoutes.js";
import productRouter from "./routes/productRoutes.js";
import packageRouter from "./routes/packageRoutes.js";
import chatbotRouter from "./routes/chatbotRoutes.js";
import cartRouter from "./routes/cartRoutes.js"
import checkoutRoutes from "./routes/checkoutRoutes.js"
import notificationRouter from "./routes/notificationRoutes.js";
import workerRouter from "./routes/workerRoutes.js";
import proofRouter from "./routes/proofRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import userRouter from './routes/userRoutes.js';

//vishnu added code
import detailRouter from './routes/detailRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';


const app = express();
const port = process.env.PORT || 4000
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}));


app.use('/uploads', express.static('uploads'));

//API Endpoints
app.get('/', (req, res) => res.send("API Working "));
app.use('/api/auth', authRouter);
app.use('/api/farmer',farmerRouter);
app.use('/api/products/',productRouter);
app.use('/api/package/',packageRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", checkoutRoutes);
app.use("/api/notifications", notificationRouter);
app.use('/api/worker', workerRouter)
app.use('/api/proof', proofRouter)
app.use('/api/profile', profileRouter)

//vishnu added code 
app.use('/api/detail', detailRouter);
app.use('/api/transaction', transactionRouter);

app.use('/api/user', userRouter);

app.listen(port, ()=> console.log(`Server started on PORT: ${port}`));