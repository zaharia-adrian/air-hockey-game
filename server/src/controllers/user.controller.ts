import {Request, Response} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';

const expiration = 3 * 24 * 60 * 60; /// 3 days

const createToken = (id:number) => {
    return jwt.sign({id}, process.env.SECRET,{
        expiresIn: expiration
    });
};

export const signIn = async (req: Request, res:Response)=>{    
    try{
        const {username, password} = req.body;
        const user = await User.findOne({where:{username}});
        
        if(!user) return res.status(401).json({error:"Username does not exist!"});
        
        
        const auth = await bcrypt.compare(password, user.password);
        if(!auth) return res.status(401).json({error:"Incorrect password!"});

        const token = createToken(user.id);
        res.cookie('jwt',token,{maxAge:expiration * 1000});
        res.cookie('username',username,{maxAge:expiration * 1000});
        return res.status(200).json({user:user.id}); 

    }catch(err){            
        return res.status(401).json({error:err.message})
    }
};

export const signUp = async (req: Request, res:Response)=>{
    const {username, password} = req.body;     
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try{
        const existingUser = await User.findOne({where:{username}});
        if(existingUser){
            return res.status(409).json({error:"Username already exists!"});
        }

        const user = await User.create({username, password : hashedPassword});
        
        const token = createToken(user.id);
        res.cookie('jwt',token,{maxAge:expiration * 1000});
        res.cookie('username',username,{maxAge:expiration * 1000});
        return res.status(201).json({user:user.id}); 
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}

