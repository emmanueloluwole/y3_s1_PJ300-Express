import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import designRoutes from './routes/designs';

dotenv.config();
const app = express();

app.use(morgan("tiny")); // Logging middleware
app.use(express.json()); // JSON body parser

app.use('/api/v1/designs', designRoutes); // Route handler

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
