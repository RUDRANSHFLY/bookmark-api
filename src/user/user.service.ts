import { Injectable, NotFoundException } from "@nestjs/common";



import { DbService } from "src/db/db.service";



@Injectable()
export class UserService{
    constructor(
        private readonly prisma : DbService,
    ) {}

    async getMe(id : string){
        try {
            const user = await this.prisma.user.findFirst({
                where : {
                    id : id
                },
                select : {
                    id : true,
                    email : true,
                    firstName : true,
                    lastName : true,
                    createdAt : true,
                    updatedAt : true,
                }
            });

            if(!user){
                throw new NotFoundException('User not found!')
            }

            return user;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}