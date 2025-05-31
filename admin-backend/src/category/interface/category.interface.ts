import { Document } from "mongoose";
import { Event } from "../interface/event.interface";

export class Category extends Document {
    readonly category: string;
    description: string;
    events: Array<Event>
}
