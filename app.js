const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utilities/appError');
const userRouter = require('./routes/userRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const resourceRouter = require('./routes/resourceRoutes');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');
const likeRouter = require('./routes/likeRouter');
const timeTableRouter = require('./routes/timeTableRouter');

const app = express();
// app.use((req, res, next) => {
//    console.log(process.env.SENDGRID_USERNAME);
//    console.log(process.env.SENDGRID_PASSWORD);
//    next();
// });

// GLOBAL-MIDDLEWARES ---
// SET Security HTTP headers
// app.use(helmet());

//CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.options('*', cors());
// Development Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 700,
  windowMs: 60000,
  message: 'Too many requests from this IP, Please try again in one minute!',
});

app.use('/api', limiter);

// Body Parser - reading data from the body into req.body
app.use(express.json({ limit: '10KB' }));

// Cookie Parser
app.use(cookieParser());

// Serving Static Files
app.use(express.static(`${__dirname}/public`));

app.use(compression());

// app.use((req, res, next) => {
//   console.log('this is the req body', req.body);
//   next();
// });

// ROUTE HANDLERS ---
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/resources', resourceRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/timeTable', timeTableRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
