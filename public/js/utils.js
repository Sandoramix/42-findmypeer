/**
 * @typedef {Object} UserRecordPosition
 * @property {string} raw
 * @property {number} cluster
 * @property {number} row
 * @property {number} pc

 * @typedef {Object} UserRecord
 * @property {string} username
 * @property {...UserRecordPosition} position
 */

/**
 * @description Show/hide the loading overlay
 * @param {boolean} isLoading flag whether the loading spinner should be visible or hidden
 */
function updateLoading(isLoading) {
	setTimeout(() => {
		LOADING_SPINNER.classList.toggle(`!hidden`, !isLoading);
	}, 200);
}

/**
 * @description Update timer after each second until `endTms`.
 * @param  {number} endTms tms when the time expires
 */
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

/** @description Generate intra's profile link */
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

/**
 * @function findUserByPosition
 * @param  {number} cluster cluster id
 * @param  {number} row     cluster row
 * @param  {number} pc      pc position
 * @return {...UserRecord | null} userRecord or `null` if not found.
 */
function findUserByPosition(cluster, row, pc) {
	for (let u of PEERS) {
		const pos = u.position;
		if (pos.cluster === cluster && pos.row === row && pos.pc === pc)
			return u;
	}
	return null;
}

/**
 * @function findClusterConfigById
 * @param  {number} id cluster id
 * @return {...ClusterConfig | null} clusterConfig or `null` if not found.
 */
function findClusterConfigById(id) {
	if (!CLUSTERS)
		return null;
	return CLUSTERS.find(c => c.id === id);
}
