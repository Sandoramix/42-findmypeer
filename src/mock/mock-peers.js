import { getClusterConfigs } from "../utils/cluster_utils.js";


const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**Mock peers (random generated). */
export function getMockPeers(density = 0.7) {
	density = Math.min(Math.max(density, 0), 1);
	console.debug(`getMockPeers ~ Generating mock peers with density: ${density}`);

	/**@type {{[id: number]: {rows: number, columns: number}}} */
	const clusters = getClusterConfigs()?.reduce((ac, cluster) => {
		return {
			...ac,
			[cluster.id]: { id: cluster.id, rows: cluster.rows, columns: cluster.columns - cluster.spacerColumns.length }
		};
	}, {}) ?? {};

	if (Object.keys(clusters).length == 0){
		console.debug(`getMockPeers ~ No clusters found`);
		return [];
	}

	const totalPcs = Object.values(clusters)?.reduce((a, b) => a + b.columns * b.rows, 0) ?? 0;

	const peers = [];
	const usernames = Array.from({ length: totalPcs }, (_, i) => `peer${i + 1}`);


	Object.entries(clusters).forEach(([clusterId, cluster]) => {
		const totalClusterPcs = cluster.columns * cluster.rows;
		// console.debug(`getMockPeers ~ Cluster ${clusterId}: ${totalClusterPcs} peers`);
		const totalPeersCount = Math.floor(totalClusterPcs * density);

		const usedPositions = new Set();

		for (let i = 0; i < totalPeersCount; i++) {
			let pos;
			do {
				pos = { row: randInt(1, cluster.rows), pc: randInt(1, cluster.columns) };
			} while (usedPositions.has(`${pos.pc}_${pos.row}`));
			usedPositions.add(`${pos.pc}_${pos.row}`);

			const userIdx = randInt(0, usernames.length - 1);
			const username = usernames[userIdx];
			usernames.splice(userIdx, 1);

			peers.push({
				username,
				position: { ...pos, cluster: parseInt(clusterId), raw: `c${clusterId}r${pos.row}p${pos.pc}` },
			});
		}
	});
	console.debug(`getMockPeers ~ Generated ${peers.length} peers`);
	return peers;
};