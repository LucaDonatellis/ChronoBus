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
 * Gestisce la registrazione di un nuovo utente tramite richiesta POST.
 *
 * Endpoint per la registrazione che:
 * - accetta un oggetto JSON con email e password,
 * - verifica la validità dei dati inseriti,
 * - verifica che l'email non sia già registrata,
 * - cripta la password,
 * - salva il nuovo utente nel database,
 * - genera un token JWT per l'autenticazione,
 * - restituisce la risposta appropriata in base al risultato.
 *
 * @async
 * @function POST
 * @param {Object} context - L'oggetto contesto fornito dal framework ({ request }).
 * @param {Request} context.request - Oggetto Request contenente i dati della richiesta (body JSON: { email, password }).
 * @returns {Promise<Response>} Response HTTP con codice di stato e messaggio risultante:
 *   - 201: Registrazione avvenuta con successo, restituisce il token JWT.
 *   - 400: Email o password mancanti.
 *   - 409: Account già esistente con la stessa email.
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
    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Email già registrata.' }),
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashed });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return new Response(
      JSON.stringify({ success: true, token, message: 'Registrazione avvenuta con successo.' }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: 'Errore interno del server.' }),
      { status: 500 }
    );
  }
}

