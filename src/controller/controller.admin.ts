import IAdmin from "../interfaces/admin.interface"
import Admin from "../models/model.admin"
import EncryptClass from '../class/encrypt.class'
import IResponse from '../interfaces/response.interface'
import logger from "../../lib/logger"

export default class AdminService {
    encrypt = new EncryptClass

   public createSudo(admin: IAdmin): Promise<IResponse> {
        logger.info('creating sudo user')
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

                logger.info('User sudo succefully created')
                return resolve({ ok: true, message: 'Usuario creado con exito', response: adminCreated, code: 201 })
            })
        })
    }

   public sudoVerify(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Admin.findOne({ role: 'sudo'}, ( err: any, sudoDB: any ) => {
                if ( err ) {
                    logger.error(err)
                    return reject(false)
                }

                if(!sudoDB) {
                    let admin: IAdmin = {
                        name: 'Gustavo',
                        lastname: 'Medina',
                        email: 'gmedina@avera.mx',
                        password: 'Lobo48tft803@',
                        role: 'sudo',
                        status: 'active'
                    }

                    this.createSudo(admin)

                    return resolve(true)
                } else {
                    return resolve(true)
                }
            })
        })
    }

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

   public readAdminByEmail( email: string ): Promise<IResponse> {
        return new Promise((resolve, reject) => {
            const query = Admin.findOne({ email: email}, 'name lastname email role imgUser status createdDate')
            query.exec((err: any, adminDB: any) => {
                if ( err ) {
                    logger.error(err)
                    return reject({ ok: false, message: 'Error en base de datos', response: err, code: 500 })
                }

                if ( !adminDB ) {
                    return reject({ ok: false, message: 'No existe un usuario con este email', response: null, code: 404 })
                }

                return resolve({ ok: true, message: 'Usuario encontrado', response: adminDB, code: 200 })
            })
        })
    }


   public changeStatusAdmin( email: string, status: string ): Promise<IResponse> {
        return new Promise((resolve, reject) => {
            Admin.findOne({ email: email }, ( err: any, adminDB: any ) => {
                if ( err ) {
                    logger.error(err)
                    return reject({ ok: false, message: 'Error en base de datos', response: err, code: 500 })
                }

                if ( !adminDB ) {
                    return reject({ ok: false, message: 'No existe un usuario con este email', response: null, code: 404 })
                }

                adminDB.status = status

                adminDB.save((err: any, adminSaved: any) => {
                    if ( err ) {
                        return reject({ ok: false, message: 'Error al actualizar estatus de usuario', response: null, code: 500 })
                    }

                    adminSaved.salt = null
                    adminSaved.password = null
                    adminSaved.role = null

                    resolve({ ok: true, message: 'Estatus de usuario actualizado con exito!', response: adminSaved, code: 200 })
                })
            })
        })
    }

    changeAdminRole(email: string, role: string): Promise<IResponse> {
        return new Promise((resolve, reject) => {
            Admin.findOne({ email: email }, ( err: any, adminDB: any ) => {
                if ( err ) {
                    logger.error(err)
                    return reject({ ok: false, message: 'Error en base de datos', response: err, code: 500 })
                }

                if ( !adminDB ) {
                    return reject({ ok: false, message: 'No existe un usuario con este email', response: null, code: 404 })
                }

                adminDB.role = role

                adminDB.save((err: any, adminSaved: any) => {
                    if ( err ) {
                        return reject({ ok: false, message: 'Error al actualizar role de usuario', response: null, code: 500 })
                    }

                    adminSaved.salt = null
                    adminSaved.password = null

                    resolve({ ok: true, message: 'Role de usuario actualizado con exito!', response: adminSaved, code: 200 })
                })
            })
        })
    }
}
