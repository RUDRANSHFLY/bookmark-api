import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class DbService extends PrismaClient {
    constructor(config : ConfigService){
        super({
            datasources : {
                db : {
                    url : config.get('DATABASE_URL'),
                }
            }
        })
    }
}
