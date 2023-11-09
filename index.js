const FS = require("fs");
const EXPRESS = require("express");
const CORS = require("cors");
const HTTP = require("http");
const HTTPS = require('https');

const env = {
	pvKey: FS.readFileSync('certs/selfsigned.key', 'utf8'),
	cert: FS.readFileSync('certs/selfsigned.crt', 'utf8'),
	http:{
		port: 8080
	},
	https:{
		port: 8443
	},
	api:{
		refreshSeconds: 60
	}
}

const app = EXPRESS();
const cors = CORS();

app.use(cors);
app.options("*", cors);

app.use('/peers', (req, res)=>{
	const rawData = FS.readFileSync(`/nfs/sgoinfre/goinfre/Perso/who.cache`, 'utf8');
	const users = rawData.split('\n').map(u=>{
		const [username] = u.split(` - `);
		const raw = u.split(` - `).at(-1);
		if (!username || !raw)
			return (null);
		const cluster = parseInt(raw.split('c')[1]);
		const row = parseInt(raw.split('r')[1]);
		const pc = parseInt(raw.split('p')[1]);
		return {username, position:{raw,cluster,row,pc}};
	}).filter(u=> u && u.username && u.position);

	res.status(200);
	const nowD = new Date();
	const nowTms = Date.now();
	res.json({
		users,
		refreshAt: nowTms - (nowD.getSeconds() * 1000) + (env.api.refreshSeconds * 1000)
	});
})

app.use(EXPRESS.static(`public`))


const httpServer = HTTP.createServer(app).on('listening',()=>{
	console.log(`Running https on http://localhost:${env.http.port}`);
});;
const httpsServer = HTTPS.createServer({key: env.pvKey, cert: env.cert}, app).on('listening',()=>{
	console.log(`Running https on https://localhost:${env.https.port}`);
});

httpServer.listen(env.http.port);
httpsServer.listen(env.https.port);