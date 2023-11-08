const SEARCH_INPUT = document.getElementById(`search`);
const FORM = document.getElementById(`search-form`);
const TABLE = document.getElementById(`table`);
const LOADING_SPINNER = document.getElementById(`loading`);



var searchDebounceTimeout;

var data = [];


SEARCH_INPUT.addEventListener('keyup', (ev) => {
	clearTimeout(searchDebounceTimeout);
	searchDebounceTimeout = setTimeout(updateTable, 333);
});
FORM.addEventListener(`submit`, (ev) => {
	ev.preventDefault();
	clearTimeout(searchDebounceTimeout);
	updateTable();
});


/**
 * Update table data
 */
function updateTable() {
	const search = SEARCH_INPUT.value.toLowerCase();
	const filtered = data.filter(x => x.username.includes(search) || x.position.raw.includes(search)).sort((a, b) => a.username.localeCompare(b.username));
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
		<td class="border border-white/10 h-10">
			<div class="flex justify-center items-center">${CLUSTER[u.position.cluster]}</div>
		</td>`;
		if (toAdd) {
			tableBody.append(userRow);
		}
	});
}
function updateLoading(isLoading) {
	LOADING_SPINNER.classList.toggle(`!hidden`, !isLoading);
}

const TABS_BUTTONS = document.querySelectorAll(`[data-selectedtab]`);

TABS_BUTTONS.forEach((el, idx) => {
	const elAttr = el.getAttribute(`data-selectedtab`);

	el.addEventListener('click', (ev) => {
		TABS_BUTTONS.forEach(btn => {
			const btnAttr = btn.getAttribute(`data-selectedtab`);
			const targetEl = document.getElementById(`tab-${btnAttr}`);
			if (btnAttr != elAttr)
			{
				targetEl.classList.toggle(`!hidden`, true);
				btn.classList.toggle(`!text-yellow-500`, false);
			}
			else
			{
				targetEl.classList.toggle(`!hidden`, false);
				btn.classList.toggle(`!text-yellow-500`, true);
			}
		});
	});
	const hash = location.hash.replace(/^#/, "");
	if (hash != elAttr && !(hash == '' && idx == 0))
		document.getElementById(`tab-${elAttr}`).classList.toggle(`!hidden`, true);
	else
		el.classList.toggle(`!text-yellow-500`, true);
});

function fetchPeers() {
	// TODO REPLACE TO: document.baseURI
	updateLoading(true);
	fetch(`http://localhost:8080/peers`, { method: 'GET' }).then(res => res.json()).then(peers => {
		data = peers;
		updateLoading(false);
		updateTable();
	});
	const date = new Date();
	setTimeout((1000 * 60) - date.getSeconds());
}
fetchPeers();