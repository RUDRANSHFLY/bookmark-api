import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request)

        if (!token) {
            throw new UnauthorizedException('Token not found!');
        }

        try {
            const payload: {
                sub: string;
                email: string;
            } = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.config.get('JWT_SECRET')
                }
            );


            request['user'] = payload;

            console.log(request['user'])

        } catch {
            throw new UnauthorizedException('Token expired!');
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === "Bearer" ? token : undefined
    }
}