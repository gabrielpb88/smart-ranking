import { IsNotEmpty, IsNumber, IsString, IsEmail } from 'class-validator';
import { Category } from '../../category/interface/category.interface';

export class CreatePlayerDto {
    
    @IsString()
    phoneNumber: string;
    
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    category: Category;
    
    @IsString()
    name: string;
    
    @IsString()
    ranking: string;

    @IsNumber()
    rankingPosition: number;

    @IsString()
    urlPlayerPicture: string;
}
