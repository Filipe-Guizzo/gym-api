import jwt from 'jsonwebtoken';
const API_SECRET_KEY = 'secret';

class Token {

    generateAccessToken(username: any) {
        return jwt.sign(username, API_SECRET_KEY, { expiresIn: '2 days' });
    }

    authenticateToken(req: any, res: any, next: any) {
        const authHeader = req.headers['authorization'];
        const token = authHeader;

        if(token == null){
            return res.sendStatus(401);
        }

        jwt.verify(token, API_SECRET_KEY, (err: any, user: any) => {
            console.log(err);

            if(err){
                return res.sendStatus(401);
            }

            req.user = user;

            next();
        });
    }
}

export default new Token();