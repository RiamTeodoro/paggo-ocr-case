import { BadRequestException, Injectable, UnauthorizedException } from
'@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(email:string,password:string){
        const exists = await this.prisma.user.findUnique({
            where: { email },
        });
        if (exists) {
            throw new BadRequestException('email já cadastrado'); 
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create ({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const payload = {sub: user.id, email:user.email };
        const access_token = await this.jwtService.signAsync(payload);

        return { access_token };

    }

    async login(email:string, password:string) {
        const user = await this.prisma.user.findUnique({
            where:{ email }
        });

        if(!user) {
            throw new UnauthorizedException('Email ou Senha inválidos');
        }
        const senhaValida = await bcrypt.compare(password, user.password);

        if (!senhaValida) {
            throw new UnauthorizedException ('Email ou Senha inválidos');

        }
        const payload = {
            sub:user.id,
            email:user.email,
        };
        
        const access_token = await
    this.jwtService.signAsync(payload);

        return { access_token };
            
        }
    }
