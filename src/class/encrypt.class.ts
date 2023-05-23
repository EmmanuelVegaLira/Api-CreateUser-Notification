import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from 'config'

export default class EncryptClass {

    /*****************************************************
     *Parameters: @param length
     *Description: Genera una cadena aleatoria
     *Correct result: string
     *****************************************************/
    private genRandomString(length: number) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length)
    }

    /*****************************************************
     *Parameters: @param data
     *Description: Verifica si es una cadena o buffer
     *Correct result: string/buffer
     *Incorrect result: throw Error
     *****************************************************/
    private getStringValue(data: { toString: () => any; }) {
        if (typeof data === 'number' || data instanceof Number) {
            return data.toString();
        }

        if (!Buffer.isBuffer(data) && typeof data !== 'string') {
            throw new TypeError('Los datos para generar contraseñas deber ser de tipo String o Buffer');
        }

        return data;
    }

    /*****************************************************
     *Parameters: @param password, @param salt
     *Description: Encripta contraseña
     *Correct result: object {salt, password}
     *****************************************************/
    private sha512(password: string, salt: string) {
        const hash = crypto.createHmac('sha512', this.getStringValue(salt))
        hash.update(this.getStringValue(password))
        const passwordHash = hash.digest('hex')

        return {
            salt,
            passwordHash
        }
    }

    /*****************************************************
     *Parameters: @param password
     *Description: Estructura contraseña con salt aleatorio
     * y encripta
     *Correct result: object {salt, password}
     *****************************************************/
    public genPassword(password: String) {
        const salt = this.genRandomString(16)
        return this.sha512(String(password), salt)
    }

    /*****************************************************
     *Parameters: @param password, @param salt
     *Description: Encripta contraseña con salt propio
     *Correct result: string/buffer
     *Incorrect result: throw Error
     *****************************************************/
    public saltHashPassword(password: string, salt: string) {
        return this.sha512(String(password), salt);
    }

    /*****************************************************
     *Parameters: @param user
     *Description: Crea token con usuario modelo
     *Correct result: token
     *Incorrect result: throw Error
     *****************************************************/
    public genToken(user: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const payload = {
                user
            }
            // @ts-ignore
            jwt.sign(payload, config.get("jwt.accessTokenSecret"), {
                expiresIn: config.get("jwt.accessTokenLife")
            }, (err, token) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(token);
                }
            });
        });
    }
}