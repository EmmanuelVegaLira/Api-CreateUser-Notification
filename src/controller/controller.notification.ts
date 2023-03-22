
import INotification from '../interfaces/notification.interface';
import IResponse from '../interfaces/response.interface';
import Notificacion from '../models/model.notification';

export default class NotificationController{
    //creando metodos 
    //Create
    public createNotificacion(notificacion: INotification): Promise<IResponse>{
        return new Promise((resolve, reject)=>{
            Notificacion.create(notificacion,(err: any,newNotificacion:any)=>{
               if (err) return reject({ok: false, message: 'Fallo en la base de datos',response: err, code:500})
                return resolve({ok:true,message:'Notificacion creada con exito',response:newNotificacion,code:201})

            })
        })
    }
    //Delete
    public deleteNotification(offer_id:String): Promise<IResponse>{
        return new Promise((resolve,reject)=>{
            Notificacion.deleteOne({offer_id:offer_id},(err:any,notificationDB:any)=>{
                if ( err ) return reject({ ok: false, message: 'Fallo en base de datos', response: err, code: 500 })

                if ( notificationDB.deletedCount === 0 ) {
                    return reject({ ok: false, message: 'No se encontro el registro para ser eliminado', response: null, code: 404 })
                }
                return resolve({ ok: true, message: 'Notificacion eliminada!', response: notificationDB, code: 200 })
            })
        })
    }
    //Get
    public getNotificacion(offer_id:String):Promise<IResponse>{
        return new Promise((resolve, reject)=>{
            Notificacion.findOne({offer_id:offer_id},(err:any,notificationDB:any)=>{
                if (err) return reject({ok: false, message: 'Fallo en base de datos', response: err, code: 500})
            if (!notificationDB){
                return reject({ok: false, message: 'No se encontro el registro para ser mostrado', response: null, code: 404})
            }
            return resolve({ok: true, message: 'Notificacion encontrada!', response: notificationDB, code: 200})
            })
        })
    }
    //Update
    public updateNotificacion(notificacion:INotification):Promise<IResponse>{
        return new Promise((resolve,reject)=>{
            Notificacion.findOneAndUpdate({notification_type:notificacion.notification_type},{
                message:notificacion.message,
                reading_users:notificacion.reading_users,
                
            },{
                returnOriginal:false
            },(err:any,notificationDB:any)=>{

                if ( err ) return reject({ ok: false, message: 'Fallo en base de datos', response: err, code: 500 })

                if ( !notificationDB ) {
                    return reject({ ok: false, message: 'No se encontro el id', response: null, code: 404 })
                }

                return resolve({ ok: true, message: 'Registro actualizado', response: notificationDB, code: 200 })
            })
        }) 
        
    }
    
}