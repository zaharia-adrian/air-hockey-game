import jwt from 'jsonwebtoken'
import {Request, Response, Next} from 'express'



export const requireAuth = (req : Request, res : Response, next : Next) => {
    try{
        const token = req.cookies.user.jwt;
        if(!token) throw Error('No jwt for authentification, bad access!');
        jwt.verify(token, process.env.SECRET, (err, decodedToken) =>{
            if(err) throw err;
            next();
        });
    }catch(err){
        return res.status(401).json({err:err.message});
    }
}