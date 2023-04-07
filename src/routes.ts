//crear las rutas del crud
import { Router, Request, Response } from "express";
import logger from "../lib/logger";
import AdminController from './controller/controller.admin';
import INotification from "./interfaces/admin.interface";
import { checkToken } from "./middlewares/check-token";

const routes = Router();
const admin = new AdminController
7//Ruta creacion de contacto
// registro, logeo
routes.post('/register',async(req:Request,res:Response)=>{
    const body = req.body
    const registerRequest = body
    try{
        const response = await admin.loginAdmin(registerRequest.email,registerRequest.password)
        return res.status(response.code).json(response)
    } catch( err: any ) {
        return res.status(err.code ? err.code : 500).json(err)
    }
    
})

routes.post('/login',async(req:Request,res:Response)=>{
    const body = req.body
    const loginRequest = body
    try {
        const response = await admin.loginAdmin(loginRequest.email,loginRequest.password)
        return res.status(response.code).json(response)
    } catch( err: any ) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})


routes.delete('/delete/:email',async(req:Request,res:Response)=>{
    const email = req.params.email
    try{
        const response = await admin.deleteUser(String(email))
        return res.status(response.code).json(response)
    }catch( err: any){
        return res.status(err.code ? err.code: 500).json(err)
    }
})


export default routes;