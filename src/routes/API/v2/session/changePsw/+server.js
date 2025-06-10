import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from '$env/static/private';
import { mongoose, User } from '$lib/utils/mongodb.js';
import { json } from '@sveltejs/kit';
import { isAdmin } from '$lib/stores/admin';

/**
 * Gestisce il cambio password di un utente tramite richiesta POST.
 *
 * Endpoint per il cambio password che:
 * - accetta un oggetto JSON con email, vecchia password e nuova password,
 * - verifica la presenza dei dati obbligatori,
 * - controlla se l'email corrisponde a un utente esistente,
 * - confronta la vecchia password fornita con quella salvata (hash),
 * - se la combinazione è valida, cambia la password con quella nuova,
 * - in caso di dati non validi, restituisce un messaggio di errore.
 *
 * @async
 * @function POST
 * @param {Object} context - Oggetto contenente i dati della richiesta.
 * @param {Request} context.request - Oggetto Request con il body JSON { email, password }.
 * @returns {Promise<Response>} Response HTTP che può essere:
 *   - 201: Password cambiata con successo.
 *   - 400: Email o password mancanti.
 * 	 - 401: La vecchia password non è valida.
 * 	 - 402: Le password sono uguali.
 *   - 409: Email non trovata nel database.
 *   - 500: Errore interno del server.
 */
export async function POST({ request }) {
	try {
		const { email, oldpassword, newpassword } = await request.json();

		if (!email || !oldpassword || !newpassword ) {
			return json({ error: 'Email and passwords required.' }, { status: 400 });
		}

		const existing = await User.findOne({ email });
		if (!existing) {
			return json({ error: 'Email not found.' }, { status: 409 });
		}
		let user = await User.findOne({ email });

		const valid = await bcrypt.compare(oldpassword, user.password);

		if (!valid) {
			return json({ error: 'Invalid old password.' }, { status: 401 });
		}

		if(oldpassword==newpassword){
			return json({ error: 'Can t enter the same password.' }, { status: 402 });
		}
		user.password= await bcrypt.hash(newpassword, 10);
		await user.save();
		
		return json({ message: 'Password changed', isAdmin: user.isAdmin }, { status: 201 });
	} catch (err) {
		return json({ error: 'Server error. '+ err }, { status: 500 });
	}
}
