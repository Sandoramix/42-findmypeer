function updateElements() {
	updateTable();
	updateCluster();
}

SEARCH_INPUT.addEventListener('keyup', (ev) => {
	clearTimeout(searchDebounceTimeout);
	searchDebounceTimeout = setTimeout(updateElements, 100);
});
FORM.addEventListener(`submit`, (ev) => {
	ev.preventDefault();
	clearTimeout(searchDebounceTimeout);
	updateElements();
});


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
			updateElements();
			const now = Date.now();
			const nowD = new Date();
			setTimeout(fetchPeers, refreshAt - now >= 0 ? refreshAt - now : (1000 * 60) - (nowD.getSeconds() * 1000));
		});
}

function fetchClusters() {
	updateLoading(true);
	fetch(`${document.location.origin}/clusters`, { method: 'GET' })
		.then(res => res.json())
		.then(data => {
			CLUSTERS = data ?? [];
			if (CLUSTERS.length == 0) {
				showMessage("No cluster has been configured yet");
				updateLoading(false);
				return;
			}
			CLUSTER_TABLES = [];
			CLUSTERS.forEach(c => generateCluster(c, CLUSTERS_SECTION, false, false));
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
fetchClusters();
updateElements();
