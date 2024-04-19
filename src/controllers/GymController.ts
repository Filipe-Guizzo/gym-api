import prisma from "../prisma";

class GymController{

    async index(req: any, res: any){
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const offset = (page - 1) * pageSize;

        const gyms = await prisma.gym.findMany({
            skip: offset,
            take: pageSize,
            orderBy: { gymId: 'asc' },
        });

        return res.json(gyms);
    }

    async store(req: any, res: any){

        await prisma.gym.create({
            data:{
                gymName: req.body.name,
                gymDescription: req.body.description,
                gymPhone: req.body.phone,
                gymLat: req.body.lat,
                gymLong: req.body.long,
            }
        });

        return res.sendStatus(201);

    }

    async findByName(req: any, res: any){
        const gymName = req.query.name;
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const offset = (page - 1) * pageSize;

        const gyms = await prisma.gym.findMany({
            skip: offset,
            take: pageSize,
            orderBy: { gymId: 'asc' },
            where: {
                gymName: {
                    contains: gymName
                },
            },
        });

        return res.json(gyms);
    }
}

export default new GymController();