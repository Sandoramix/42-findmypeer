
import { config } from "dotenv";
import { exit } from "process";

config();
const penv = process.env;

export const env = {
	HTTP_PORT: +penv['HTTP_PORT'],

	API_REFRESH_SECONDS: +penv['API_REFRESH_SECONDS'],

	BACKEND_PEERS_ENDPOINT: penv['BACKEND_PEERS_ENDPOINT'],
	NODE_ENV: penv['NODE_ENV']?.toLowerCase() ?? 'development',
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
if (env.NODE_ENV !== 'development'){
	console.debug = function(){};
}