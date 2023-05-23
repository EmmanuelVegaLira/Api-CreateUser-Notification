import {Request, Response, NextFunction} from "express"
import {verify} from "jsonwebtoken"
import config from "config"

/*****************************************************
 *Parameters: @param req, @param res, @param next
 *Description: Verifica el token
 *Correct result: (Guarda usuario y next)
 * Incorrect result: res.json(ok, message, response, code)
 *****************************************************/
export async function checkToken(req: Request, res: Response, next: NextFunction) {
    const token: any = req.headers.authorization

    await verify(token, config.get('jwt.accessTokenSecret'), (err: any, decode: any) => {
        if (err) {
            return res.status(401).json({ok: false, message: 'No esta autorizado', response: err, code: 401})
        }
        req.body.user = decode.user
        next()
    })
}