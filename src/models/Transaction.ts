import mongoose, { Schema, model, Document } from "mongoose";

interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
    amount: number;
    pointsEarned: number;
    createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    amount: { type: Number, required: true },
    pointsEarned: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || model<ITransaction>("Transaction", transactionSchema);
