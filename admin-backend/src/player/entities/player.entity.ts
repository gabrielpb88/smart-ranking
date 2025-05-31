import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
    phoneNumber: String,
    email: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: String,
    ranking: String,
    rankingPosition: Number,
    urlPlayerPicture: String
}, { timestamps: true, collection: 'players' })
