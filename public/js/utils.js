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