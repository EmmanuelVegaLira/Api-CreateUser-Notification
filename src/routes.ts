// Imports
import {Router, Request, Response} from "express";
import AdminController from './controller/controller.admin';
import IAdmin from "./interfaces/admin.interface";
const routes = Router();
const admin = new AdminController

// Register user
routes.post('/register', async (req: Request, res: Response) => {
    const body = req.body
    const adminCreated: IAdmin = body
    try {
        const response = await admin.registerUser(adminCreated)
        return res.status(response.code).json(response)
    } catch (err: any) {
        return res.status(err.code ? err.code : 500).json(err)
    }

})

// Login User
routes.post('/login', async (req: Request, res: Response) => {
    const body = req.body
    const {email, password} = body
    try {
        const response = await admin.loginUser(email, password)
        return res.status(response.code).json(response)
    } catch (err: any) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})

export default routes;