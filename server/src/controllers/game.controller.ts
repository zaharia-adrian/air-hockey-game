import {Request, Response} from 'express'
import { getClients } from '../websocket/game.service.js';

export const getConnectedUsers = (req:Request, res:Response) =>{
    return res.status(200).json({users:getClients()});
};

