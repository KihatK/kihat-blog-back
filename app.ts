import express from 'express';
import https from 'https';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import redis from 'redis';
const RedisStore = require('connect-redis')(session);

import { sequelize } from './models';
import passportConfig from './passport';
import bcategoryRouter from './routes/bcategory';
import scategoryRouter from './routes/scategory';
import postRouter from './routes/post';
import postsRouter from './routes/posts';
import userRouter from './routes/user';
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});
const store = new RedisStore({ client: redisClient });

const prod = process.env.NODE_ENV === 'production';

setInterval(() => {
  https.get('https://api.kihat.tk');
}, 1000 * 60 * 10);

dotenv.config();
const app = express();
sequelize.sync()
  .then(() => {
    console.log('database connected');
  })
  .catch((e: Error) => {
    console.error(e);
  });
passportConfig();

interface CookieType {
  httpOnly: boolean,
  secure: boolean,
  domain?: string,
}

interface SessionType {
  resave: boolean,
  saveUninitialized: boolean,
  proxy?: boolean,
  cookie: CookieType,
  secret: string,
  name: string,
  store: any,
}

let sessionMiddleware: SessionType = {
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: true,
    domain: '.kihat.tk',
  },
  secret: process.env.COOKIE_SECRET,
  name: 'v)g*3',
  store,
};

app.use(compression());

if (prod) {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(cors({
    origin: ['https://kihat.tk'],
    credentials: true,
  }));
}
else {
  app.use(morgan('dev'));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  sessionMiddleware = {
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    secret: process.env.COOKIE_SECRET,
    name: 'v)g*3',
    store,
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session(sessionMiddleware));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/bcategory', bcategoryRouter);
app.use('/api/scategory', scategoryRouter);
app.use('/api/post', postRouter);
app.use('/api/posts', postsRouter);
app.use('/api/user', userRouter);

app.listen(process.env.PORT || 3060, () => {
  console.log(`server is running on port ${process.env.PORT || 3060}`);
});

export default app;