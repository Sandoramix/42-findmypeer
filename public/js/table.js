/**
 * Update table data
 */
function updateTable() {
	const search = SEARCH_INPUT.value.toLowerCase();
	const filtered = usersData.filter(x => x.username.includes(search) || x.position.raw.includes(search)).sort((a, b) => a.username.localeCompare(b.username));
	const tableBody = TABLE.querySelector(`tbody`);

	if (search == "" || search) {
		tableBody.innerHTML = ``;
	}

	filtered.forEach(u => {
		let userRow = tableBody.querySelector(`user-${u.username}`);
		let toAdd = false;
		if (!userRow) {
			toAdd = true;
			userRow = document.createElement('tr');
			userRow.id = `user-${u.username}`;
			userRow.className = `border border-white/10`;
		}
		userRow.innerHTML = `<td class="border border-white/10 h-10">
			<div class="flex justify-center items-center">${u.username}</div>
		</td>
		<td class="border border-white/10 h-10">
			<div class="flex justify-center items-center">${u.position.raw}</div>
		</td>
		<td class="hidden sm:table-cell border border-white/10 h-10">
			<div class="flex justify-center items-center">${CLUSTER[u.position.cluster]}</div>
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