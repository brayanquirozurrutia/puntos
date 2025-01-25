import mongoose, { Schema, model, Document } from "mongoose";

interface ICompany extends Document {
    name: string;
    description: string;
    createdAt: Date;
}

const companySchema = new Schema<ICompany>({
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Company || model<ICompany>("Company", companySchema);
