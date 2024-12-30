import path from 'path'
import express from "express";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import loggingMiddleware from "./middleware/loggingMiddleware.js"
import userRouter from "./routes/userRoutes.js"
import networkRouter from './routes/networkRoutes.js';
import nodeRouter from './routes/nodeControllerRoutes.js';
import jobSchedulerRouter from './routes/jobSchedulerRoutes.js';
import userjobSchedulerRouter from './routes/userjobSchedulerRoutes.js';
import fileManagementRouter from './routes/fileManagementRoutes.js';
import slurmControllerRouter from './routes/slurmControllerRoutes.js';
import jobRouter from './routes/jobsRoutes.js';
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import passport from 'passport';
import bodyParser from "body-parser";
import slurmDatabaseRouter from './routes/slurmDatabaseRoutes.js';



dotenv.config();

const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(loggingMiddleware(path.join(__dirname, 'requests.log')));

app.use(passport.initialize());

app.use('/api/users', userRouter)
app.use('/api/networks', networkRouter)
app.use('/api/nodes', nodeRouter)
app.use('/api/scheduler', jobSchedulerRouter)
app.use('/api/userscheduler', userjobSchedulerRouter)
app.use('/api/filemanagement', fileManagementRouter)
app.use('/api/jobs', jobRouter)
app.use('/api/slurmcontroller', slurmControllerRouter)
app.use('/api/slurmdatabase', slurmDatabaseRouter)


if (process.env.NODE_ENV === 'production'){
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')))
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')))
} else {
    app.get('/', (req, res) => res.send(`Server is ready`))
}


app.use(notFound);
app.use(errorHandler);

//listen on port 5000
app.listen(port, () => console.log(`Server started on port ${port}`))