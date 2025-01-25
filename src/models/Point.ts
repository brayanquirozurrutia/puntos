import mongoose, { Schema, model, Document } from "mongoose";

interface IPoint extends Document {
    userId: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
    points: number;
}

const pointSchema = new Schema<IPoint>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    points: { type: Number, default: 0 },
});

export default mongoose.models.Point || model<IPoint>("Point", pointSchema);
