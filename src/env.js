const FS = require("fs");
const DOTENV = require("dotenv");
const { exit } = require("process");

DOTENV.config();
const penv = process.env;

var env = {
	PRIVATE_KEY_FILE: FS.readFileSync(penv['PRIVATE_KEY_FILE'], 'utf8'),
	CERTIFICATE_FILE: FS.readFileSync(penv['CERTIFICATE_FILE'], 'utf8'),

	HTTP_PORT: +penv['HTTP_PORT'],
	HTTPS_PORT: +penv['HTTPS_PORT'],

	API_REFRESH_SECONDS: +penv['API_REFRESH_SECONDS'],

	CLUSTERS_CONFIG_FILE: penv['CLUSTERS_CONFIG_FILE'],
	BACKEND_PEERS_ENDPOINT: penv['BACKEND_PEERS_ENDPOINT'],
};

let errors = [];

Object.entries(env).forEach(([xName, x]) => {
	if (x === undefined) {
		errors.push(xName);
	}
});

if (errors.length > 0) {
	console.log(`Configuration file error: missing or invalid values of the following variables: ${errors.join(`, `)}`);
	exit(1);
}

module.exports = {
	env
};