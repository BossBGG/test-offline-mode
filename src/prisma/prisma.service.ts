import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            adapter: new PrismaMssql({
                server: 'localhost',
                port: 1433,
                database: 'offline_db',
                user: 'sa',
                password: '9kq3XqZ52iCnMxp',
                options: {
                    encrypt: true,
                    trustServerCertificate: true,
                }
            }),
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}