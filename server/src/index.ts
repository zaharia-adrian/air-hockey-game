import express from 'express'

import bodyparser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { setupWebSocketServer } from './websocket/index.js';
import {connectToDB} from './config/db.js'

import userRoutes from './routes/user.routes.js'
import gameRoutes from './routes/game.routes.js'


const port = 8000;

const app = express();
const db = connectToDB();
setupWebSocketServer();
 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(bodyparser.json());
app.use(userRoutes);
app.use(gameRoutes);


app.listen(port, ()=>{
   console.log("App running...");
});