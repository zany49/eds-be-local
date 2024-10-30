import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create-customer')
  // @UseGuards(JwtAuthGuard)
  async create(
  @Body() createCustomerDto: CreateCustomerDto,
  @Res() res: FastifyReply,
  @Req() req: FastifyRequest,
) {
    try{
      let resdata = await this.customerService.create(createCustomerDto);
      console.log("res---->",resdata);
     return res.status(HttpStatus.OK).send({ 
        message: 'Customer Created Sucessfully' ,
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

  @Get('all-customers')
  async findAll(
    @Res() res: FastifyReply,
  ) {
    try{
      let resdata = await this.customerService.findAll();;
      console.log("res---->",resdata);
     return res.status(HttpStatus.OK).send({ 
        message: 'Customer List Fetched Sucessfully' ,
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

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: FastifyReply,
  ) {
    try{
      let resdata = await this.customerService.findOne(id);
      console.log("res---->",resdata);
     return res.status(HttpStatus.OK).send({ 
        message: 'Customer Data Fetched Sucessfully' ,
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
