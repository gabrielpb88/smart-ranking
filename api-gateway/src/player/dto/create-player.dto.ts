import { IsNotEmpty, IsEmail } from "class-validator";

export class CreatePlayerDto {
    @IsNotEmpty()
    readonly name: string;
    
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly category: string;

    @IsNotEmpty()
    readonly phoneNumber: string
}