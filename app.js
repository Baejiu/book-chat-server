import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { sequelize } from './data/db/database.js';
import { csrfCheck } from './middleware/csrf.js';
import rateLimit from './middleware/rate-limiter.js';

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionSuccessStatus: 200,
  Credential: true, // allow the Access-Control-Allow-Credentials
};

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan('tiny'));
app.use(rateLimit);

app.use(csrfCheck);
app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);
app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  res.sendStatus(500);
});

sequelize.sync().then((client) => {
  console.log(`Server is started: ${new Date()}`);
  const server = app.listen(config.port);
  initSocket(server);
});
