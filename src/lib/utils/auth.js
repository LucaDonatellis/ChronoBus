import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from '$env/static/private';

export function validateToken(request) {
	const authHeader = request.headers.get('authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return { valid: false, error: 'Token mancante o formato errato' };
	}

	const token = authHeader.split(' ')[1];

	try {
		const payload = jwt.verify(token, JWT_PASSWORD);
		return { valid: true, payload };
	} catch (err) {
		return { valid: false, error: 'Token non valido o scaduto' };
	}
}
