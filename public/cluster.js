
const params = new URLSearchParams(document.location.search);

const id = parseInt(params.get(`id`));
if (!id) {
	window.location.href = `/`;
}

function fetchPeers() {
	// TODO REPLACE TO: document.location.origin
	updateLoading(true);
	fetch(`${document.location.origin}/peers`, { method: 'GET' })
		.then(res => res.json())
		.then(data => {
			const { users, refreshAt } = data;
			PEERS = users;

			updateLoading(false);
			updateRefetchTime(refreshAt);
			updateCluster(true);
			const now = Date.now();
			const nowD = new Date();
			setTimeout(fetchPeers, refreshAt - now >= 0 ? refreshAt - now : (1000 * 60) - (nowD.getSeconds() * 1000));
		});
}

function fetchClusters() {
	updateLoading(true);
	fetch(`${document.location.origin}/clusters/${id}`, { method: 'GET' })
		.then(res => res.json())
		.then(data => {
			CLUSTERS = data ? [data] : [];
			if (CLUSTERS.length == 0) {
				showMessage("Cluster not found");
				updateLoading(false);
				return;
			}
			CLUSTER_TABLES = [];
			CLUSTERS.forEach(c => generateCluster(c, CLUSTERS_SECTION, true, true));
			fetchPeers();
		})
		.catch(err => {
			if (FETCH_RETRIES.clusters++ < MAX_RETRIES) {
				return fetchClusters();
			}
			showMessage("Server is not reachable, try again later", true);
			updateLoading(false);
			return;
		});
}

CLUSTERS_SECTION.style.display = `block`;
fetchClusters();

updateCluster();
