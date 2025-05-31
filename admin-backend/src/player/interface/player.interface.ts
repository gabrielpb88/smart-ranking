import { Document } from "mongoose";
import { Category } from "src/category/interface/category.interface";

export interface Player extends Document{
    readonly phoneNumber: string;
    readonly email: string;
    category: Category;
    name: string;  
    ranking: string;
    rankingPosition: number;
    urlPlayerPicture: string;
}