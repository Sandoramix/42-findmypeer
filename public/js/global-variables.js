const SEARCH_INPUT = document.getElementById(`search`);
const FORM = document.getElementById(`search-form`);
const LOADING_SPINNER = document.getElementById(`loading`);
const REFETCH_CNTS = document.querySelectorAll(`[data-refetch-cnt]`);
const REFETCH_TIMES = document.querySelectorAll(`[data-refetch-time]`);
const TABS_BUTTONS = document.querySelectorAll(`[data-selectedtab]`);
const PC_TEMPLATE = document.querySelector(`[data-template="pc"]`);

const CLUSTERS = {
	1: {
		id: 1,
		name: `Wakanda`,
		rows: 6,
		columns: 13,
		spacerColumns: [7],
		pcColors: {
			active: {
				default: `#095800`,
				matched: `#b88d00`,
			},
			inactive: {
				default: `#242424`,
				matched: `#666`
			},
		},
		isWeird: true,
		rotations: {
			1: [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
			2: [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
			3: [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
			4: [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
			5: [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
			6: [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
		}
	},
	2: {
		id: 2,
		name: `Nidavellir`,
		rows: 6,
		columns: 15,
		spacerColumns: [4, 10],
		pcColors: {
			active: {
				default: `#095800`,
				matched: `#b88d00`,
			},
			inactive: {
				default: `#242424`,
				matched: `#666`
			},
		},
		isWeird: false,
		rotations: {},
	}
};


var searchDebounceTimeout;
/**
 * @type {...UserRecord[]}
 */
var usersData = [];
var refetchTimeout;
