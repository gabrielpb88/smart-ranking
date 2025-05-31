import { IsArray, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';
import { Event } from '../interface/event.interface'

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    readonly category: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @ArrayMinSize(1)
    events: Array<Event>
}
