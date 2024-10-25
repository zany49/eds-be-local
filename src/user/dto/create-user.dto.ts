import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}

export class UserEmailDto {

    @IsString()
    @IsNotEmpty()
    email: string;
}

export class UserOtpDto {
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    otp: string;
}