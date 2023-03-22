//crear las rutas del crud
import { Router, Request, Response } from "express";
import logger from "../lib/logger";
import NotificationController from './controller/controller.notification';
import INotification from "./interfaces/notification.interface";
import { checkToken } from "./middlewares/check-token";

const routes = Router();
const notification = new NotificationController
//Ruta creacion de contacto
routes.post('/create', async( req: Request, res: Response ) => {
    const body = req.body
    const notificationRequest = body

    try {
        const response = await notification.createNotificacion(notificationRequest)
        return res.status(response.code).json(response)
    } catch( err: any ) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})

routes.get('/search/:offer_id',async( req: Request, res: Response ) => {
    const offer = req.params.offer_id

    try {
        const response = await notification.getNotificacion(String(offer))
        return res.status(response.code).json(response)
    } catch( err: any ) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})


//--------------------------------------------------------------

routes.delete('/delete/:offer_id',async(req:Request,res:Response)=>{
    const offer = req.params.offer_id
    try{
        const response = await notification.deleteNotification(String(offer))
        return res.status(response.code).json(response)
    }catch( err: any){
        return res.status(err.code ? err.code: 500).json(err)
    }
})
routes.put('/update',async(req:Request,res:Response)=>{ 
   const body = req.body
   const notificationReq:INotification=body
    try{
        const response = await notification.updateNotificacion(notificationReq)
        return res.status(response.code).json(response)
    }catch(err:any){
        return res.status(err.code ? err.code:500).json(err)
    }
})


export default routes;