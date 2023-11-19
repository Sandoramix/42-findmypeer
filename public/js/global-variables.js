const SEARCH_INPUT = document.getElementById(`search`);
const FORM = document.getElementById(`search-form`);
const LOADING_SPINNER = document.getElementById(`loading`);
const REFETCH_CNTS = document.querySelectorAll(`[data-refetch-cnt]`);
const REFETCH_TIMES = document.querySelectorAll(`[data-refetch-time]`);
const TABS_BUTTONS = document.querySelectorAll(`[data-selectedtab]`);
const PC_TEMPLATE = document.querySelector(`[data-template="pc"]`);

const MAX_RETRIES = 3;

/**
 * @type {any[]}
 */
var CLUSTERS;


var searchDebounceTimeout;
/**
 * @type {...UserRecord[]}
 */
var PEERS = [];
var refetchTimeout;


function searchValue(){
	return SEARCH_INPUT.value
}