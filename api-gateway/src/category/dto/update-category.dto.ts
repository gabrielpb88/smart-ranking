import { IsArray, IsOptional, IsString, ArrayMinSize } from "class-validator";
import { Event } from '../interface/event.interface'

export class UpdateCategoryDto {

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @ArrayMinSize(1)
    events: Array<Event>
}