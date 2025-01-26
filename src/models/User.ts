import mongoose, { Schema, model, Document, CallbackError } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre<IUser>("save", async function (next: (err?: CallbackError) => void) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as CallbackError); // Casting explícito para indicar que el error es un CallbackError
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || model<IUser>("User", userSchema);
