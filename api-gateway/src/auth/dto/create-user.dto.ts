import { IsPhoneNumber, IsString, IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, { message: 'Password must be at least 8 caracters long, 1 lowercase, 1 uppercase, 1 number, 1 symbol' })
    password: string;

    @IsPhoneNumber()
    phoneNumber: string;
}