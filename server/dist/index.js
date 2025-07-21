import express from 'express';
import bodyparser from 'body-parser';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import { setupWebSocketServer } from './websocket/index.js';
import { connectToDB } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import gameRoutes from './routes/game.routes.js';
const port = 8000;
const app = express();
const db = connectToDB();
setupWebSocketServer();
app.use(cors());
app.use(cookieparser());
app.use(bodyparser.json());
app.use(userRoutes);
app.use(gameRoutes);
app.listen(port, () => {
    console.log("App running...");
});
//# sourceMappingURL=index.js.map