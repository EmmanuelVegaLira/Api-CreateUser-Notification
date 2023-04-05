import IAdmin from '../interfaces/admin.interface';
import IResponse from '../interfaces/response.interface';
import Admin from '../models/model.admin';
import crypto from 'crypto';
import pino from 'pino';


const logger = pino();

export default class AdminController{

//creando metodos 
    
    //Create login
   public createAdmin( admin: IAdmin ): Promise<IResponse> {
        logger.info('creating admin user')
        return new Promise((resolve, reject) => {
            if ( admin.password ) {
                const { salt, passwordHash } = this.encrypt.genPassword(admin.password)
                admin.password = passwordHash
                admin.salt = salt
            }

            Admin.create(admin, (err: any, adminCreated: any) => {
                if ( err ) {
                    logger.error(err)
                    return reject({ ok: false, message: 'Error al crear admin', response: err, code: 500 })
                }

                logger.info('User admin succefully created')
                return resolve({ ok: true, message: 'Usuario creado con exito', response: adminCreated, code: 201 })
            })

        })
    }
    // metodo login
    public loginAdmin( email: string, password: string ): Promise<any> {
        return new Promise((resolve, reject) => {
            Admin.findOne({ email: email }, async ( err: any, adminDB: any ) => {
                if ( err ) {
                    logger.error(err)
                    return reject({ ok: false, message: 'Error en base de datos', response: err, code: 500 })
                }

                if ( !adminDB ) {
                    return reject({ ok: false, message: 'Datos incorrectos', response: 'No existe un usuario con este email', code: 404 })
                }

                if ( adminDB.status !== 'active') {
                    return reject({ ok: false, message: 'Usuario inactivo', response: 'Este usuario se encuentra inactivo, contacte a un administrador', code: 401 })
                }

                const { passwordHash } = this.encrypt.saltHashPassword( password, adminDB.salt )

                if ( passwordHash === adminDB.password ) {
                    adminDB.salt = null
                    adminDB.password = null

                    try {
                        const token = await this.encrypt.genToken(adminDB)
                        return resolve({ ok: true, message: 'Usuario logueado con exito', response: null, token: token, code: 200 })
                    } catch( err ) {
                        return reject({ ok: false, message: 'Ocurrion un error al generar token', response: err, code: 500 })
                    }
                } else {
                    return reject({ ok: false, message: 'Ocurrio un error', response: 'Password incorrecto', code: 401 })
                }

                
            })
        })
    }       
 }
    
