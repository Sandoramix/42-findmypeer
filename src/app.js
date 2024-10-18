
import { env } from "./env.js"

import FS from "fs";
import EXPRESS from "express";
import CORS from "cors";
import HTTP from "http";
import { clusterRouter, loadClusterImages } from './routers/cluster.js';
import { peersRouter } from './routers/peers.js';


const app = EXPRESS();
const cors = CORS();

app.use(cors);
app.options("*", cors);

loadClusterImages();

app.use("/api/clusters", clusterRouter);

app.use("/api/peers", peersRouter);

app.use("/assets", EXPRESS.static(`src/assets`));
app.use(EXPRESS.static(`public`));

FS.readdirSync(`public`).forEach((file) => {
	if (file.endsWith(`.html`)) {
		app.use(`/${file.replace(`.html`, ``)}`, EXPRESS.static(`public/${file}`));
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

listenServer(httpServer, env.HTTP_PORT, false);
