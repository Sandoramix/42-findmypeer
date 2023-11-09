function updateElements(){
	updateTable();
	updateCluster();
}

// TODO REMOVE ME
// SEARCH_INPUT.value = 'od'
SEARCH_INPUT.addEventListener('keyup', (ev) => {
	clearTimeout(searchDebounceTimeout);
	searchDebounceTimeout = setTimeout(updateElements, 333);
});
FORM.addEventListener(`submit`, (ev) => {
	ev.preventDefault();
	clearTimeout(searchDebounceTimeout);
	updateElements();
});

function fetchPeers() {
	// TODO REPLACE TO: document.baseURI
	updateLoading(true);
	fetch(`http://10.12.5.10:8080/peers`, { method: 'GET' }).then(res => res.json()).then(data => {
		const { users, refreshAt } = data;
		usersData = users;

		updateLoading(false);
		updateElements();
		updateRefetchTime(refreshAt);
		const now = Date.now();
		const nowD = new Date();
		setTimeout(fetchPeers, refreshAt - now > 0 ? refreshAt - now : (1000 * 60) - (nowD.getSeconds() * 1000));
	});
}
fetchPeers();


