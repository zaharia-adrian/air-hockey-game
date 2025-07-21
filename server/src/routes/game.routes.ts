import express from 'express'
import { getConnectedUsers } from '../controllers/game.controller.js';

const router = express.Router();

router.get('/connected-users',getConnectedUsers);


export default router;

