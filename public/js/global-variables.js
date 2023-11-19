/**
 * @typedef {Object} ClusterPcColorConfig
 * @property {string} default
 * @property {string} matched

 * @typedef {Object} ClusterPcColorsConfig
 * @property {...ClusterPcColorConfig} active
 * @property {...ClusterPcColorConfig} inactive

 * @typedef {Object} ClusterConfig
 * @property {number} id
 * @property {string} name
 * @property {number} rows
 * @property {number} columns
 * @property {number[]} spacerColumns
 * @property {...ClusterPcColorsConfig} pcColors
 * @property {boolean} isWeird
 * @property {null | Object} rotations
 */

const SEARCH_INPUT = document.getElementById(`search`);
const FORM = document.getElementById(`search-form`);
const LOADING_SPINNER = document.getElementById(`loading`);
const REFETCH_CNTS = document.querySelectorAll(`[data-refetch-cnt]`);
const REFETCH_TIMES = document.querySelectorAll(`[data-refetch-time]`);
const TABS_BUTTONS = document.querySelectorAll(`[data-selectedtab]`);

// TEMPLATES
const PC_TEMPLATE = document.querySelector(`[data-template="pc"]`);

// FETCH MAX RETRIES
const FETCH_RETRIES = { peers: 0, clusters: 0 };
const MAX_RETRIES = 3;

/**
 * @type {...ClusterConfig[]}
 */
var CLUSTERS;


var searchDebounceTimeout;
/**
 * @type {...UserRecord[]}
 */
var PEERS = [];
var refetchTimeout;


function searchValue() {
	return SEARCH_INPUT.value;
}