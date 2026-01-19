import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

 @Injectable()
 export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create (email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });
        
            const { password: _, ...result } = user;
            return result;
        }   catch (error) {

            if (
                error instanceof Prisma.PrismaClientKnownRequestError && 
                error.code === 'P2002'
            ) {
              throw new ConflictException ('Email já cadastrado');
            }

            throw error;
        }
    }  
    
    async findAll() {
        return this.prisma.user.findMany({
            select:{
                id: true,
                email: true,
                createdAt: true,
            },
        }); 
    }
 }