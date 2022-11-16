import express from 'express'
import dotenv  from 'dotenv';
import morgan from 'morgan';
import mongoose from'mongoose';
import methodOverride from'method-override';
import {createServer} from 'http'
import {Server} from'socket.io'
import onConnection from './socket_io/onConnection.js';
import { getFilePath } from './service/fileService.js'
import upload from './service/uploadService.js'
// import { reqTodb } from './reqToDB.js';
//routes
import loginUserApiRoutes from'./routes/api-user-login-routes.js'
import userApiRoutes from './routes/api-user-routes.js'
import profileApiRoutes from'./routes/api-profile-route.js'
import postApiRoutes from './routes/api-post-routes.js'
import messegesApiRoutes from './routes/api-messeges-routes.js'
dotenv.config()
const app = express();
import cors from 'cors'
import cookieParser from'cookie-parser'
import errorMiddleware from'./middlewares/error-middleware.js'



app.set('view engine', 'js');
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser())
const PORT = process.env.PORT||3000;
const db = process.env.DB_URL

// const db = 'mongodb+srv://gaxiya:akidima456@cluster0.thsr0ll.mongodb.net/myApp?retryWrites=true&w=majority';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log(`Connected to DB  `) )
  .catch((error) => console.log(error));
  app.use('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {console.log('have no files');
      return res.sendStatus(400)}
  
    const relativeFilePath = req.file.path.replace(/\\/g, '/').split('serverForMyApp/files')[1]
     
    res.status(201).json(relativeFilePath)
  })
  
  app.use('/files', (req, res) => {
    const filePath = getFilePath(req.url)
  
    res.status(200).sendFile(filePath)
  })

  
  const server = createServer(app)
  
  const io = new Server(server,{
    cookie:false,
    cors: process.env.CLIENT_URL,
    serveClient: false,
    credentials: true
  })
  
  io.on('connection', (socket) => {
    console.log('connected',socket.id);
    onConnection(io, socket)
  })

server.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});
// reqTodb()
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// app.use(express.static('styles'));

app.use(methodOverride('_method'));
// addRoles()


app.use('/api',loginUserApiRoutes);
app.use('/api',userApiRoutes);
app.use('/api',messegesApiRoutes)
app.use('/api',profileApiRoutes)
app.use('/api',postApiRoutes)
app.use(errorMiddleware)
// app.use(contactRoutes);
// app.use(postApiRoutes);


