import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const JWT_SECRET = 'a_secret_key';

// Connessione a MongoDB
mongoose.connect('mongodb+srv://lorenzociroluongo:QvmW8bxBiyZIpDRo@cluster0.dthxrpi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Modello Utente
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// API per login
export async function POST({ request }) {
    try {
        const { email, password } = await request.json();

        // Validazione input
        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email e password sono obbligatorie.' }),
                { status: 400 }
            );
        }

        // Verifica se l'email non è presente nel db
        const existing = await User.findOne({ email });
        if (!existing) {
            return new Response(
                JSON.stringify({ error: 'Email non trovata' }),
                { status: 409 }
            );
        }
        //ottine la password dal db e la compara con quella inserita
        let user = await User.findOne({ email });
        const valid = await bcrypt.compare(password, user.password);

        if (valid) {
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                JWT_SECRET,
                { expiresIn: "30d" }
            );
            return new Response(
                JSON.stringify({ success: true, token, message: 'Login avvenuto con successo.' }),
                { status: 201 }
            );
        }
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: 'Errore interno del server.' }),
            { status: 500 }
        );
    }
}

