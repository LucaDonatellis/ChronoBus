import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from '$env/static/private';

import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';
mongoose.connect(MONGO_URI);

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

/**
 * Gestisce il login di un utente tramite richiesta POST.
 *
 * Endpoint per il login che:
 * - accetta un oggetto JSON con email e password,
 * - verifica la presenza dei dati obbligatori,
 * - controlla se l'email corrisponde a un utente esistente,
 * - confronta la password fornita con quella salvata (hash),
 * - se la combinazione è valida, restituisce un token JWT di autenticazione,
 * - in caso di dati non validi, restituisce un messaggio di errore.
 *
 * @async
 * @function POST
 * @param {Object} context - Oggetto contenente i dati della richiesta.
 * @param {Request} context.request - Oggetto Request con il body JSON { email, password }.
 * @returns {Promise<Response>} Response HTTP che può essere:
 *   - 201: Login avvenuto con successo, token JWT restituito.
 *   - 400: Email o password mancanti.
 *   - 409: Email non trovata nel database.
 *   - 500: Errore interno del server.
 */
export async function POST({ request }) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email e password sono obbligatorie.' }),
                { status: 400 }
            );
        }

        const existing = await User.findOne({ email });
        if (!existing) {
            return new Response(
                JSON.stringify({ error: 'Email non trovata' }),
                { status: 409 }
            );
        }
        let user = await User.findOne({ email });
        const valid = await bcrypt.compare(password, user.password);

        if (valid) {
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                JWT_PASSWORD,
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

