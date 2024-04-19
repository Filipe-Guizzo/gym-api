import prisma from "../prisma";

class CheckinController{

    async findByIdUser(req: any, res: any){
        const userId = Number(req.params.id); 
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const offset = (page - 1) * pageSize;

        const checkins = await prisma.checkin.findMany({
            skip: offset,
            take: pageSize,
            orderBy: { gymId: 'asc' },
            where: {
                userId: userId
            },
            include:{
                user:{
                    select:{
                        userName: true,
                    }
                },
                gym: {
                    select:{
                        gymName: true,
                        gymPhone: true,
                    }
                }
            }
        });

        return res.json(checkins);
    }

    async store(req: any, res: any){
        const date = new Date();
        const dateNow  = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const hourNow  = `${date.getHours()}:${date.getMinutes()}`;

        const checkinExists = await prisma.checkin.findMany({
            where: {
                    date: dateNow,
                    userId: req.body.userId,
                },
            });

        
        if(checkinExists.length > 0){
            res.status(400);
            return res.json({message:'Check-in já realizado!'}); 
        }

        await prisma.checkin.create({
            data:{
                date: dateNow,
                hour: hourNow,
                user: {
                    connect: { userId:  req.body.userId}
                },
                gym: {
                    connect: { gymId:  req.body.gymId}
                },
            }
        });

        return res.sendStatus(201);

    }

}

export default new CheckinController();