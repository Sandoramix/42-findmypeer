import { Router } from "express";
import { env } from "../env.js"
import { craftBackendQuery } from "../utils/backend_utils.js";
import { getMockPeers } from "../mock/mock-peers.js";

export const peersRouter = Router({ mergeParams: true });

peersRouter.get(`/`, async (req, res) => {
	const peers = await fetchPeers();
	if (!peers) {
		return res.status(404).json(null)
	}

	return res.status(200).json(packPeersResponse(peers));
});

peersRouter.get(`/mock`, async (req, res) => {
	const asArray = req.query.as_array ? req.query.as_array == "true" : true;
	let density = parseFloat(req.query.density) ?? 0.7;
	if (isNaN(density))
		density = 0.7;

	const peers = getMockPeers(density);
	if (!peers) {
		return res.status(404).json(null)
	}
	if (asArray){
		return res.status(200).json(peers);
	}

	return res.status(200).json(packPeersResponse(peers));
});

function packPeersResponse(peers){
	const nowD = new Date();
	const nowTms = Date.now() - nowD.getMilliseconds();
	const seconds = nowD.getSeconds();

	const calc = nowTms - (seconds % env.API_REFRESH_SECONDS != 0 ? seconds * 1000 : 0) + (env.API_REFRESH_SECONDS * 1000);
	return {
		users: peers,
		refreshAt: seconds > env.API_REFRESH_SECONDS / 100 * 90 ? calc + (env.API_REFRESH_SECONDS * 1000) : calc
	};
}

export function fetchPeers() {
	return fetch(craftBackendQuery())
		.then(r => r.json())
		.then(peers => peers.map(u => ({ username: u.username, position: u.hostname ?? u.position })).filter(u => u && u.username && u.position))
		.catch(err => {
			console.log(err);
			return null;
		});
}
