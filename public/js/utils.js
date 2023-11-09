function updateLoading(isLoading) {
	LOADING_SPINNER.classList.toggle(`!hidden`, !isLoading);
}

function updateRefetchTime(endTms) {
	const timeLeft = Math.floor((endTms - Date.now()) / 1000);
	if (timeLeft < 0)
		REFETCH_CNTS.forEach(el => { el.style.display = `flex`; });
	else {
		REFETCH_CNTS.forEach(el => { el.style.display = `block`; });
		REFETCH_TIMES.forEach(el => { el.innerHTML = timeLeft; });

		clearTimeout(refetchTimeout);
		refetchTimeout = setTimeout(() => updateRefetchTime(endTms), 1000);
	}
}

function getIntraProfileLink(username){
	return `https://profile.intra.42.fr/users/${username}`
}

function isSearchIncluded(string){
	const text = SEARCH_INPUT.value.toLowerCase();
	if (text == '')
		return false;
	return string.includes(text)
}

function findUserByPosition(cluster, row, pc){
	for (let u of usersData){
		const pos = u.position;
		if (pos.cluster === cluster && pos.row === row && pos.pc ===pc)
			return u;
	}
	return null;
}