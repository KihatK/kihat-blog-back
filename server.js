const express = require('express');
const https = require('https');
const morgan = require('morgan');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const db = require('./models');
const passportConfig = require('./passport');
const bcategoryRouter = require('./routes/bcategory');
const scategoryRouter = require('./routes/scategory');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});
const store = new RedisStore({ client: redisClient });

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

setInterval(() => {
  https.get('https://kihat.ga');
}, 600000);

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log('database connecting success');
  })
  .catch((e) => {
    console.error(e);
  });
passportConfig();

let sessionMiddleware = {
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    domain: '.kihat.tk',
  },
  secret: process.env.COOKIE_SECRET,
  name: 'v)g*3',
  store,
};

if (prod) {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(cors({
    origin: ['https://kihat.tk'],
    credentials: true,
  }))
}
else {
  app.use(morgan('dev'));
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
  };
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
  console.log(`app is running on port ${process.env.PORT || 3060}`);
});

module.exports = RedisStore;
