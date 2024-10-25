import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserEmailDto, UserOtpDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto,
  @Res() res: FastifyReply,
  @Req() req: FastifyRequest,
) {
    try{
      let resdata = await this.userService.create(createUserDto);
      console.log("res---->",resdata);
     return res.status(HttpStatus.OK).send({ 
        message: 'User Created' ,
        data : resdata
      });
    }catch(err){
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ 
        message: 'Error' ,
        data : err
      });
    }
  }

  @Post('login')
 async login(
  @Body() useremailDto: UserEmailDto,
  @Res() res: FastifyReply,
  @Req() req: FastifyRequest,
  ) {
    try{
      let resdata = await this.userService.login(useremailDto);
      console.log("res---->otp",resdata);
      if(resdata.otp){
        return res.status(HttpStatus.OK).send({ 
          message: 'Otp Sent To Email' ,
        });
      }else{
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ 
          message: 'Otp Not Generated' 
        });
      }
    }catch(err){
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ 
        message: 'Error' ,
        data : err
      });
    }
  }

  @Post('validate-otp')
  async otpcheck(
   @Body() userotpDto: UserOtpDto,
   @Res() res: FastifyReply,
   @Req() req: FastifyRequest,
   ) {
     try{
       let resdata = await this.userService.otpcheck(userotpDto);
       console.log("res---->otp",resdata);
         return res.status(HttpStatus.OK).send({ 
           resdata
         });
     }catch(err){
       console.log(err);
       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ 
         message: 'Error' ,
         data : err
       });
     }
   }

   @Get('profile')
   @UseGuards(JwtAuthGuard)
   getProfile() {
     return 'This is a protected route';
   }

}
