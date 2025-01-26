import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { connectToMongoose } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "yourSuperSecretKey";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    try {
        // Conectar a la base de datos usando Mongoose
        await connectToMongoose();

        // Buscar al usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar la contraseña
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Devolver la información del usuario y el token
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}
