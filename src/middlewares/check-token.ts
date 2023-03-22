import { Request,Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import config from "config";

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    const token:any = req.headers.authorization
    
    await verify(token,config.get('jwt.accessTokenSecret'),(err:any,decode:any)=>{
        if(err){
            
            return res.status(401).json({ok: false, message: 'No esta autorizado', response: err, code: 401})
        }

        req.body.user = decode.user
        next()


    })
    
}