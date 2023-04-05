
import mongoose, { Schema } from 'mongoose'

const adminSchema: Schema = new Schema({
    name: { type: String, lowercase: true, required: true },
    lastname: { type: String, lowercase: true, required: true },
    email: { type: String, lowercase: true, unique: true, required: true },
    password: { type: String, required: true },
    salt: { type: String },
    role: { type: String, enum: ['sudo', 'admin', 'user'], default: 'user'},
    imgUser: { type: String },
    status: { type: String, enum: ['active', 'inactive'], defualt: 'inactive' },
    createdDate: { type: Date, default: Date.now() }
}, { collection: 'administrators'})

export default mongoose.model('Admin', adminSchema)