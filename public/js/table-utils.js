const TABLE = document.getElementById(`table`);

/**
 * Update table data
 */
function updateTable() {
	TABLE.classList.toggle(`!hidden`, !CLUSTERS || CLUSTERS.length == 0);

	if (!CLUSTERS || !PEERS)
		return;
	const search = SEARCH_INPUT.value.toLowerCase();
	const filtered = PEERS?.filter(user => {
		const cluster = findClusterConfigById(user.position.cluster);
		if (!cluster)
			return false;
		return isSearchValueIncluded(user.username) || isSearchValueIncluded(user.position.raw) || search == '' || isSearchValueIncluded(cluster.name);
	}).sort((a, b) => a.username.localeCompare(b.username));

	const tableBody = TABLE.querySelector(`tbody`);

	if (search == "" || search) {
		tableBody.innerHTML = ``;
	}


	filtered?.forEach(u => {
		const clusterConfig = findClusterConfigById(u.position.cluster);
		if (!clusterConfig)
			return;
		let userRow = tableBody.querySelector(`user-${u.username}`);
		let toAdd = false;
		if (!userRow) {
			toAdd = true;
			userRow = document.createElement('tr');
			userRow.id = `user-${u.username}`;
			userRow.className = `border border-white/10`;
		}
		userRow.innerHTML = `<td class="border border-white/10 h-10">
			<a class="flex justify-center items-center" href="${getIntraProfileLink(u.username)}" target="_blank" referrer="no-referrer">${u.username}</a>
		</td>
		<td class="border border-white/10 h-10">
			<div class="flex justify-center items-center">${u.position.raw}</div>
		</td>
		<td class="hidden sm:table-cell border border-white/10 h-10">
			<div class="flex justify-center items-center">${clusterConfig.name}</div>
		</td>
		<td class="hidden xs:table-cell border border-white/10 h-10">
			<div class="flex justify-center items-center">${u.position.row}</div>
		</td>
		<td class="hidden xs:table-cell border border-white/10 h-10">
			<div class="flex justify-center items-center">${u.position.pc}</div>
		</td>`;
		if (toAdd) {
			tableBody.append(userRow);
		}
	});
}