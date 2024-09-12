import { env } from "./env.js";


export function padNumber(n, padCount = 2) {
	return n.toString().padStart(padCount, "0");
}

export function craftBackendQuery() {
	// Date 1 minute before this moment.
	const date = new Date(Date.now() - 1000 * 60);
	const year = date.getFullYear();
	const month = padNumber(date.getMonth() + 1);
	const day = padNumber(date.getDate());
	const hour = padNumber(date.getHours());
	const minute = padNumber(date.getMinutes());
	const query = `${env.BACKEND_PEERS_ENDPOINT}?datetime=${year}-${month}-${day} ${hour}:${minute}`;
	return query;
}
