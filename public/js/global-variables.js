const SEARCH_INPUT = document.getElementById(`search`);
const FORM = document.getElementById(`search-form`);
const LOADING_SPINNER = document.getElementById(`loading`);
const REFETCH_CNTS = document.querySelectorAll(`.refetch-cnt`);
const REFETCH_TIMES = document.querySelectorAll(`.refetch-time`);
const TABS_BUTTONS = document.querySelectorAll(`[data-selectedtab]`);

const CLUSTER = {
	1: `Wakanda`,
	2: `Nidavellir`
}

var searchDebounceTimeout;
var usersData = [];
var refetchTimeout;
