function updateElements() {
	updateTable();
	updateCluster();
}

// TODO REMOVE ME
// SEARCH_INPUT.value = 'od'
SEARCH_INPUT.addEventListener('keyup', (ev) => {
	clearTimeout(searchDebounceTimeout);
	searchDebounceTimeout = setTimeout(updateElements, 150);
});
FORM.addEventListener(`submit`, (ev) => {
	ev.preventDefault();
	clearTimeout(searchDebounceTimeout);
	updateElements();
});

function fetchPeers() {
	// TODO REPLACE TO: document.location.origin
	updateLoading(true);
	fetch(`${document.location.origin}/peers`, { method: 'GET' }).then(res => res.json()).then(data => {
		const { users, refreshAt } = data;
		usersData = users;

		updateLoading(false);
		updateRefetchTime(refreshAt);
		updateElements();
		const now = Date.now();
		const nowD = new Date();
		setTimeout(fetchPeers, refreshAt - now > 0 ? refreshAt - now : (1000 * 60) - (nowD.getSeconds() * 1000));
	});
}
fetchPeers();


