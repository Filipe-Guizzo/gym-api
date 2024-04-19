import Token from "../auth/token";
import prisma from "../prisma";
import bcrypt from 'bcrypt';

class UserController{

    async index(req: any, res: any){

        const users = await prisma.user.findMany();

        return res.json(users);
    }

    async show(req: any, res: any){
        const userId = Number(req.params.id); 

        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }
        });

        if(!user){
            return res.sendStatus(404);
        }

        return res.json(user);
    }

    async store(req: any, res: any){

        const userExists = await prisma.user.findUnique({
            where: {
                    userEmail: req.body.email,
                },
            });
        
        if(userExists){
            res.status(400);
            return res.json({message:'E-mail já cadastrado!'}); 
        }

        var passwordEncrypted = req.body.password;

        await bcrypt.hash(passwordEncrypted, 10)
        .then(hash => {
            passwordEncrypted = hash;
        })
        .catch(err => {
            console.log(err);
        });

        const user = await prisma.user.create({
            data:{
                userName: req.body.name,
                userEmail: req.body.email,
                userPassword: passwordEncrypted,
                role: {
                    connect: { roleId: req.body.role }
                }
            }
        });

        const token = Token.generateAccessToken({username:user.userName, role: user.roleId});

        return res.json({token: token, userId: user.userId, role: user.roleId});

    }

    async login(req: any, res: any){
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        const user = await prisma.user.findUnique({
            where: {
                userEmail: userEmail
            }
        })

        if(!user){
            return res.sendStatus(401);
        }

        var authenticate = false;
        await bcrypt.compare(userPassword, user.userPassword)
        .then(result => {
            authenticate = result;
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });

        if(authenticate){
            const token = Token.generateAccessToken({username:user.userName, role: user.roleId});
            return res.json({token:token, userId: user.userId, role: user.roleId});
        }else{
            return res.sendStatus(401);
        }
    }
}

export default new UserController();