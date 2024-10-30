import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE"
 }

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsEnum(Role)
    role: Role;

}

export class UserEmailDto {

    @IsString()
    @IsNotEmpty()
    email: string;
}

export class UserPassDto {

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UserOtpDto {
    @IsString()
    email: string;

    @IsString()
    phone: string;

    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsString()
    @IsNotEmpty()
    otpType: string;
}

export class ForgetPassDto {

    @IsString()
    @IsNotEmpty()
    phone: string;

}

export class ChangePassDto {

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    newPass: string;

    @IsString()
    @IsNotEmpty()
    confrimPass: string;

}