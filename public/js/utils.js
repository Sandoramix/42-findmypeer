/**
 * @typedef {Object} UserRecordPosition
 * @property {string} raw
 * @property {number} cluster
 * @property {number} row
 * @property {number} pc
 */
/**
 * @typedef {Object} UserRecord
 * @property {string} username
 * @property {...UserRecordPosition} position
 */

function updateLoading(isLoading) {
	setTimeout(()=>{
		LOADING_SPINNER.classList.toggle(`!hidden`, !isLoading)
	}, 200)
}

function updateRefetchTime(endTms) {
	const timeLeft = Math.floor((endTms - Date.now() - new Date().getMilliseconds()) / 1000 + 1);

	if (timeLeft < 0)
		REFETCH_CNTS.forEach(el => { el.style.display = `none`; });
	else {
		REFETCH_CNTS.forEach(el => { el.style.display = `flex`; });
		REFETCH_TIMES.forEach(el => { el.innerHTML = timeLeft; });

		clearTimeout(refetchTimeout);
		refetchTimeout = setTimeout(() => updateRefetchTime(endTms), 1000);
	}
}

function getIntraProfileLink(username) {
	return `https://profile.intra.42.fr/users/${username}`;
}

/**
 * @function isSearchValueIncluded
 * @description Check if `string` contains the searching value.
 * When the search is empty the function returns `false`
 * @param  {string} string string
 * @return {boolean}
 */
function isSearchValueIncluded(string) {
	const text = SEARCH_INPUT.value.toLowerCase();
	if (text == '')
		return false;
	return string.toLowerCase().includes(text);
}

function findUserByPosition(cluster, row, pc) {
	for (let u of usersData) {
		const pos = u.position;
		if (pos.cluster === cluster && pos.row === row && pos.pc === pc)
			return u;
	}
	return null;
}