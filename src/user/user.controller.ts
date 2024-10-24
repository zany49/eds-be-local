import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FastifyReply, FastifyRequest } from 'fastify';

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

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
