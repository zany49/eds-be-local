import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService){}
  async create(
    data: CreateCustomerDto,
    // dataInp: Prisma.CustomerCreateInput
  ) {
    try{
    const { mailingAddress, pickupAddress, users } = data;
    const result = await this.prisma.$transaction(async (prisma) => {
      // Step 1: Create mailing address
      const mailingAddressRecord = await prisma.customerAddress.create({
        data: mailingAddress,
      });

      // Step 2: Create pickup address (only if it’s different from mailing)
      let pickupAddressRecord = null;
      if (!data.isPickupSameAsMailing) {
        pickupAddressRecord = await prisma.customerAddress.create({
          data: pickupAddress,
        });
      }

      // Step 3: Parse and format the contract expiry date
      const dateParts = "30/10/2024".split('/');
      const dateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

      // Step 4: Create customer
      const customer = await prisma.customer.create({
        data: {
          companyName: data.companyName,
          contactName: data.contactName,
          mobileNumber: data.mobileNumber,
          companyEmail: data.companyEmail,
          vatId: data.vatId,
          commercialRegId: data.commercialRegId,
          status: data.status,
          contractExpiryDate: dateObject,
          mailingAddressId: mailingAddressRecord.id,
          pickupAddressId: pickupAddressRecord ? pickupAddressRecord.id : null,
        },
      });

      if(customer.id){
        const userAuthdata = await prisma.user.create({
          data: {
            name: data.contactName,
            phone: data.mobileNumber,
            email: data.companyEmail,
            role: 'CUSTOMER'
          },
        });
        console.log("User created--->", userAuthdata)
      }

      // Step 5: Link addresses to customer
      await prisma.customerAddress.update({
        where: { id: mailingAddressRecord.id },
        data: { customerId: customer.id },
      });

      if (pickupAddressRecord) {
        await prisma.customerAddress.update({
          where: { id: pickupAddressRecord.id },
          data: { customerId: customer.id },
        });
      }

      // Step 6: Create customer users
      if (users && users.length > 0 && customer.id) {
        await Promise.all(
          users.map(async (user) => {
            const userData = {
              ...user,
              customerId: customer.id,
              ...(user.pickupMatchesParent ? {
                country: null,
                state: null,
                city: null,
                streetAddress: null,
                additionalAddressInfo: null,
              } : {}),
            };
            let cusUserDetail = await prisma.customerUserDetails.create({ data: userData });
            if(cusUserDetail.id){
              const userDetAuthdata = await prisma.user.create({
                data: {
                  name: user.userName,
                  phone: user.mobileNumber,
                  email: user.email,
                  role: 'USER'
                },
              });
              console.log("User created userDetAuthdata--->", userDetAuthdata)
            }
          })
        );
      }

      return customer;
    });

    console.log("result main---->",result)

    return result;
  } catch (err) {
    console.log("err main---->",err)

    throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  }

  async findAll() {
    try{
            let data = await this.prisma.customer.findMany({
              include: {
                mailingAddress: true,
              }
            });
            console.log("get all data------>",data);
            return data;
    }catch(err){
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

 async findOne(id: string) {
    try{
      let data = await this.prisma.customer.findMany({
        where:{
          id: id
        },
        include: {
          mailingAddress: true,
          pickupAddress:true,
          customerUsers:true
        }
      });
      console.log("get all data------>",data);
      return data;
}catch(err){
throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
}
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
