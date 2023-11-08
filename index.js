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
	}
}

const app = EXPRESS();
const cors = CORS();

app.use(cors);
app.options("*", cors);

app.use('/peers', (req, res)=>{
	const rawData = FS.readFileSync(`/tmp/who.cache`, 'utf8');
	const users = rawData.split('\n').map(u=>{
		const [username, position] = u.split(` - `);
		return {username, position};
	}).filter(u=> u.username && u.position)

	res.status(200);
	res.json(users);
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