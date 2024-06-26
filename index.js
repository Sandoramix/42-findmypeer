const { env } = require('./src/env');
const FS = require("fs");
const EXPRESS = require("express");
const CORS = require("cors");
const HTTP = require("http");
const HTTPS = require('https');


const app = EXPRESS();
const cors = CORS();

app.use(cors);
app.options("*", cors);

app.use('/api/peers', (req, res) => {
	const rawData = FS.readFileSync(env.WHOCACHE_FILE, 'utf8');
	const users = rawData.split('\n').map(u => {
		const [username] = u.split(` - `);
		const rawSplit = u.split(` - `);
		const raw = rawSplit[rawSplit.length - 1];
		if (!username || !raw)
			return (null);
		const cluster = parseInt(raw.split('c')[1]);
		const row = parseInt(raw.split('r')[1]);
		const pc = parseInt(raw.split('p')[1]);
		return { username, position: { raw, cluster, row, pc } };
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