import { createParamDecorator, ExecutionContext } from "@nestjs/common" 
import { Request } from "express";
import { AuthenticatedUser } from "types";





export const GetUser = createParamDecorator(
    (data : string | undefined , ctx : ExecutionContext) : unknown => {
        const request : Express.Request = ctx.switchToHttp().getRequest<Request>();

        const user = request.user as AuthenticatedUser | undefined;

        if(!user){
            throw new Error('User not found in the request')
        }

        return data ? user[data] : user ;
    }
)