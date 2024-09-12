import { Router } from "express";
import { env } from "../env.js"
import { craftBackendQuery } from "../utils.js";

export const peersRouter = Router({ mergeParams: true });

peersRouter.get(`/`, async (req, res) => {
	const peers = await fetchPeers();
	if (!peers) {
		return res.status(404).json(null)
	}

	const nowD = new Date();
	const nowTms = Date.now() - nowD.getMilliseconds();
	const seconds = nowD.getSeconds();

	const calc = nowTms - (seconds % env.API_REFRESH_SECONDS != 0 ? seconds * 1000 : 0) + (env.API_REFRESH_SECONDS * 1000);
	return res.status(200).json({
		users: peers,
		refreshAt: seconds > env.API_REFRESH_SECONDS / 100 * 90 ? calc + (env.API_REFRESH_SECONDS * 1000) : calc
	});
});

export function fetchPeers() {
	return fetch(craftBackendQuery())
		.then(r => r.json())
		.then(peers => peers.map(u => ({ username: u.username, position: u.hostname })).filter(u => u && u.username && u.position))
		.catch(err => {
			console.log(err);
			return null;
		});
}
