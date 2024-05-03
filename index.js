const { env } = require('./src/env');
const FS = require("fs");
const EXPRESS = require("express");
const CORS = require("cors");
const HTTP = require("http");
const HTTPS = require('https');


function padNumber(n, padCount = 2) {
	return n.toString().padStart(padCount, "0");
}
function craftBackendQuery() {
	// Date 1 minute before this moment.
	const date = new Date(Date.now() - 1000 * 60);
	const year = date.getFullYear();
	const month = padNumber(date.getMonth() + 1);
	const day = padNumber(date.getDate());
	const hour = padNumber(date.getHours());
	const minute = padNumber(date.getMinutes());
	const query = `${env.BACKEND_PEERS_ENDPOINT}?datetime=${year}-${month}-${day} ${hour}:${minute}`;
	return query;
}

const app = EXPRESS();
const cors = CORS();

app.use(cors);
app.options("*", cors);

app.use('/api/peers', async (req, res) => {

	const fetchedReq = await fetch(craftBackendQuery());
	if (!fetchedReq.ok) {
		return res.status(500).statusMessage("Internal server error. Try again later");
	}
	const fetchedData = await fetchedReq.json();
	const users = fetchedData.map(u => {
		const username = u.username;
		const position = u.hostname;
		return {
			username,
			position
		};
	}).filter(u => u && u.username && u.position);

	const nowD = new Date();
	const nowTms = Date.now() - nowD.getMilliseconds();
	const seconds = nowD.getSeconds();

	const calc = nowTms - (seconds % env.API_REFRESH_SECONDS != 0 ? seconds * 1000 : 0) + (env.API_REFRESH_SECONDS * 1000);
	return res.status(200).json({
		users,
		refreshAt: seconds > env.API_REFRESH_SECONDS / 100 * 90 ? calc + (env.API_REFRESH_SECONDS * 1000) : calc
	});
});

app.use(`/api/clusters/:id`, (req, res) => {
	try {
		req.params.id;
		if (isNaN(parseInt(req.params.id)))
			throw "Invalid ID";
		const id = parseInt(req.params.id);
		const rawData = FS.readFileSync(env.CLUSTERS_CONFIG_FILE, 'utf8');
		const jsn = JSON.parse(rawData);
		const found = jsn.find(cluster => cluster.id === id);
		if (!found)
			throw "Cluster not found";
		// const jsn = [];
		return res.status(200).json(found);
	} catch (err) {
		return res.status(404).json(null);
	}
});

app.use(`/api/clusters`, (req, res) => {
	try {
		const rawData = FS.readFileSync(env.CLUSTERS_CONFIG_FILE, 'utf8');
		const jsn = JSON.parse(rawData);
		// const jsn = [];
		return res.status(200).json(jsn);
	} catch (err) {
		return res.status(404).json([]);
	}
});



app.use(EXPRESS.static(`${__dirname}/public`));

FS.readdirSync(`public`).forEach((file) => {
	if (file.endsWith(`.html`)) {
		app.use(`/${file.replace(`.html`, ``)}`, EXPRESS.static(`${__dirname}/public/${file}`));
	}
});

function listenServer(server, port, https = false) {
	let listener = server.listen(port);
	listener.on('listening', () => {
		console.log(`Running https on http${https ? 's' : ''}://localhost:${port}`);
	});
	return listener;
}

const httpServer = HTTP.createServer(app);
const httpsServer = HTTPS.createServer({ key: env.PRIVATE_KEY_FILE, cert: env.CERTIFICATE_FILE }, app);

listenServer(httpServer, env.HTTP_PORT, false);
listenServer(httpsServer, env.HTTPS_PORT, true);
