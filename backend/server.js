import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import loggingMiddleware from './middleware/loggingMiddleware.js';

import userRouter from './routes/userRoutes.js';
import networkRouter from './routes/networkRoutes.js';
import nodeRouter from './routes/nodeControllerRoutes.js';
import jobSchedulerRouter from './routes/jobSchedulerRoutes.js';
import userjobSchedulerRouter from './routes/userjobSchedulerRoutes.js';
import fileManagementRouter from './routes/fileManagementRoutes.js';
import slurmControllerRouter from './routes/slurmControllerRoutes.js';
import jobRouter from './routes/jobsRoutes.js';
import slurmDatabaseRouter from './routes/slurmDatabaseRoutes.js';
import computenodeagentRouter from './routes/computenodeagentRoutes.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();

// Setup CORS for frontend
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(loggingMiddleware(path.join(__dirname, 'requests.log')));

// Passport init
app.use(passport.initialize());

// Routes
app.use('/api/users', userRouter);
app.use('/api/networks', networkRouter);
app.use('/api/nodes', nodeRouter);
app.use('/api/scheduler', jobSchedulerRouter);
app.use('/api/userscheduler', userjobSchedulerRouter);
app.use('/api/filemanagement', fileManagementRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/slurmcontroller', slurmControllerRouter);
app.use('/api/slurmdatabase', slurmDatabaseRouter);
app.use('/api/computenodeagent', computenodeagentRouter);

// Static file serving in production
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => res.send('Server is ready'));
}

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
