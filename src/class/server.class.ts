import config from 'config'
import express from 'express'
import http from 'http'
import logger from '../../lib/logger'
import MongoConn from '../../lib/mongodb'
import socketIO from 'socket.io'

export default class Server {
    private port: number
    private httpServer: http.Server
    private static _instance: Server
    private mongodb: MongoConn
    public app: express.Application
    public io: socketIO.Server

    constructor() {
        this.port = config.get('api.port')
        this.app = express()
        this.httpServer = new http.Server(this.app)
        this.mongodb = MongoConn.instance
        this.io = new socketIO.Server(this.httpServer)
        this.listenSockets()
        
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() )
    }
    private listenSockets(){
        this.io.on('connection', (client)=>{
            this.io.to(client.id).emit('welcome',{message:'hola'}) 
            client.on('message',(paylod)=>{
                console.log(paylod)
                this.io.emit('message',paylod)
                
            })
        })
    }
    async start() {
        try {
            await this.httpServer.listen(this.port)
            logger.info(`Server run in port number  ${this.port}`)
            
        } catch( err ) {
            logger.error(`Error ${JSON.stringify(err)}`)
        }
    }
}