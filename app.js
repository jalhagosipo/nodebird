const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session); // connect-redis는 express-session에 의존성 있음. session인자로 넣어야함
require('dotenv').config();
const redisClient = redis.createClient( process.env.REDIS_PORT, process.env.REDIS_HOST);

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport'); // require('./passport/index.js'); 와 같음. 폴더 내의 index파일은 require시 생략할수있음.
const logger = require('./logger');
const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);

// combined 모드는 dev모드에 비해 더 많은 사용자 정보를 로그로 남김
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  // 레디스에 세션을 저장하기위해 store 추가
  store: new RedisStore({
    client: redisClient,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    logErrors: true,
  })
};
if (process.env.NODE_ENV === 'production') {
  // https 를 적용을 위해 노드 서버 앞에 다른 서버를 두었을 때 아래 옵션을 적용하면 됨
  sessionOption.proxy = true;
  // https적용이나 로드밸런싱 등을 위해 true로 바꿔줌
  // sessionOption.cookie.secure = true;
}

app.use(session(sessionOption));
app.use(flash());
// 요청객체에 passport설정을 심음
app.use(passport.initialize()); 
// req.session객체에 passport정보를 저장. 
// req.session은 express-session에서 생성하는 것이므로 passport미들웨어는 express-session보다 뒤에 연결해야함
app.use(passport.session()); 
                            
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.info('hello');
  logger.error(err.message);
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});