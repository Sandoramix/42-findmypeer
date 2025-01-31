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

	// TODO: make the retry mechanism more robust and universal (usable for other requests)
	updateLoading(true);
	fetch(`${document.location.origin}/api/peers`, { method: 'GET' })
		.then(res => {
			if (!res.ok){
				throw new Error(`Server is not reachable, will retry in a few seconds`);
			}
			return res.json();
		})
		.then(data => {
			const { users, refreshAt } = data;
			PEERS = users;

			updateLoading(false);
			updateRefetchTime(refreshAt);
			updateElements();
			const now = Date.now();
			const nowD = new Date();
			setTimeout(fetchPeers, refreshAt - now >= 0 ? refreshAt - now : (1000 * 60) - (nowD.getSeconds() * 1000));

			dialog.close();
			dialog.classList.toggle(`!flex`, false);
		})
		.catch(err=>{
			showMessage("Request failed, will retry in a few seconds", true);
			updateLoading(false);
			const minRetrySeconds = 5, maxRetrySeconds = 10;
			const retrySeconds = Math.floor(Math.random() * maxRetrySeconds) + minRetrySeconds;
			let newRefreshAt = Date.now() + (1000 * retrySeconds);
			updateRefetchTime(newRefreshAt);
			setTimeout(()=>{
				fetchPeers();
			}, retrySeconds * 1000);
		});
}

function scrollToCluster(id) {
	const cluster = document.querySelector(`[data-cluster="${id}"]`);
	if (!cluster)
		return;
	cluster.scrollIntoView({ behavior: 'smooth' });
}

function fetchClusters() {
	updateLoading(true);

	fetch(`${document.location.origin}/api/clusters`, { method: 'GET' })
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
			const selectedId = params.get(`id`);
			if (selectedId) {
				scrollToCluster(selectedId);
			}
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
