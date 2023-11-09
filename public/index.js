


SEARCH_INPUT.addEventListener('keyup', (ev) => {
	clearTimeout(searchDebounceTimeout);
	searchDebounceTimeout = setTimeout(updateTable, 333);
});
FORM.addEventListener(`submit`, (ev) => {
	ev.preventDefault();
	clearTimeout(searchDebounceTimeout);
	updateTable();
});

function fetchPeers() {
	// TODO REPLACE TO: document.baseURI
	updateLoading(true);
	fetch(`http://localhost:8080/peers`, { method: 'GET' }).then(res => res.json()).then(data => {
		const { users, refreshAt } = data;
		usersData = users;

		updateLoading(false);
		updateTable();
		updateRefetchTime(refreshAt);
		const now = Date.now();
		const nowD = new Date();
		setTimeout(fetchPeers, refreshAt - now > 0 ? refreshAt - now : (1000 * 60) - (nowD.getSeconds() * 1000));
	});
}
fetchPeers();

