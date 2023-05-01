//crear las rutas del crud
import { Router, Request, Response } from "express";
import logger from "../lib/logger";
import AdminController from './controller/controller.admin';
import IAdmin from "./interfaces/admin.interface";
import { checkToken } from "./middlewares/check-token";

const routes = Router();
const admin = new AdminController
//Ruta creacion de contacto

routes.post('/createAdmin',async(req:Request,res:Response)=>{
    const body = req.body
    const adminCreated:IAdmin = body
    try{
        const response = await admin.createAdmin(adminCreated)
        return res.status(response.code).json(response)
    } catch( err: any ) {
        return res.status(err.code ? err.code : 500).json(err)
    }
    
})

//verificacion usuario sudo
routes.post('/createSudo',async(req:Request,res:Response)=>{
    const body = req.body
    const {IAdmin} = body
    try{
        const response = await admin.createSudo(IAdmin)
        return res.status(response.code).json(response)
    } catch( err: any ) {
        return res.status(err.code ? err.code : 500).json(err)
    }
    
})


routes.post('/login',async(req:Request,res:Response)=>{
    const body = req.body
    const {email,password} = body
    try {
        const response = await admin.loginAdmin(email,password)
        return res.status(response.code).json(response)
    } catch( err: any ) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})


export default routes;