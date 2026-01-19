import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';


@Injectable()
export class PrismaService 
    extends PrismaClient 
    implements OnModuleInit, OnModuleDestroy {

    constructor() {
       if (process.env.NODE_ENV ! == 'production') {
        const adapter = new PrismaBetterSqlite3({
            url: "file:./dev.db",
        });
        super({adapter});
      } else {
        super();
      }   
    }
    
    async onModuleInit() {
        if(process.env.NODE_ENV !== 'production'){
            await this.$connect();

        }
    }

    async onModuleDestroy() {
        if (process.env.NODE_ENV !== 'production'){
            await this.$disconnect();
        }
    }
}
