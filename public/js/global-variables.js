const SEARCH_INPUT = document.getElementById(`search`);
const FORM = document.getElementById(`search-form`);
const LOADING_SPINNER = document.getElementById(`loading`);
const REFETCH_CNTS = document.querySelectorAll(`[data-refetch-cnt]`);
const REFETCH_TIMES = document.querySelectorAll(`[data-refetch-time]`);
const TABS_BUTTONS = document.querySelectorAll(`[data-selectedtab]`);
const PC_TEMPLATE = document.querySelector(`[data-template="pc"]`)

const CLUSTERS = {
	1: {
		id: 1,
		name: `Wakanda`,
		rows: 6,
		columns: 13,
		spacerColumns: [7],
		pc:{
			active:`#095800`,
			inactive: `#242424`,
			found:`#e39000`,
			idle: `#424242`
		}
	},
	2: {
		id: 2,
		name: `Nidavellir`,
		rows: 6,
		columns: 15,
		spacerColumns: [4, 10],
		pc:{
			active:`#095800`,
			inactive: `#242424`,
			found:`#e39000`,
			idle: `#424242`
		}
	}
}


var searchDebounceTimeout;
var usersData = [];
var refetchTimeout;
