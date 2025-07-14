import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { AuthDto } from './dto';
import * as argon2 from "argon2"
import { User, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DbService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) { }

  async signIn(dto: AuthDto): Promise<{ access_token: string } | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException("Email does'nt exist!")
      }

      const passwordMatches = await argon2.verify(user.password, dto.password)

      if (!passwordMatches) {
        throw new ForbiddenException("Credentials invalid!")
      }

      return this.signToken(user.id, dto.email);

    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async signUp(dto: AuthDto): Promise<(Omit<User, 'password'>) | null> {
    try {
      //? Hash the password
      const password = await argon2.hash(dto.password)

      //? Save the new user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: password,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          firstName: true,
          lastName: true,
        }
      })

      return user;

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException('Account alreardy exist with provided email!')
        }
      }
      throw error
    }
  }

  async signToken(userId: string, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    }

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get("JWT_SECRET")
    });

    return {
      access_token: token,
    }
  }
}
