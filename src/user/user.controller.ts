import { Controller, Body, Post, Get, UseGuards,Req} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() body: CreateUserDto) {
        return this.userService.create(body.email, body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Req() req:any){
        return {
            loggedUser:req.user,
            users:this.userService.findAll(),
    };
  }
}


