import FS from "fs";
import { env } from "../env.js";

export function getClusterByIdOrThrow(rawId) {
	if (isNaN(parseInt(rawId)))
		throw "Invalid id value provided";
	const parsedId = parseInt(rawId);
	const clusters = getClusterConfigs();
	const found = clusters.find(cluster => cluster.id === parsedId);
	if (!found)
		throw "Cluster not found";
	return found;
}


export function getClusterConfigs() {
	try {
		const rawData = FS.readFileSync(`./src/clusters.json`, 'utf8');
		return JSON.parse(rawData);
	} catch (_) {
		console.error(_);
		return null;
	}
}