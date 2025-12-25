import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// custom imports
import eventsRouter from './routes/event';
import analyticsRoutes from "./routes/analytics";
import "./workers/eventWorkers";



// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;


// Midddlewares
app.use(cors());
app.use(bodyParser.json());

// Sample route
app.get('/health', (req, res) => {
  res.send('Server is running smoothly! Health 100%\n');
});

// Import and use event routes
app.use('/api', eventsRouter);
app.use('/analytics', analyticsRoutes);



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});