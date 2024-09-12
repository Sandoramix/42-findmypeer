import { Router } from "express";
import FS from "fs";
import { env } from "../env.js"
import { fetchPeers } from "./peers.js";
import { createCanvas, loadImage } from 'canvas';
import path from "path";


const __dirname = import.meta.dirname;

var pcSvg = null;
var pcSvgActive = null;
var backgroundImage = null;

//const width = 2560;
//const height = 1440;
const width = 1920;
const height = 1080;
var canvas = createCanvas(width, height);



export const clusterRouter = Router({ mergeParams: true });

clusterRouter.get(`/`, (req, res) => {
	const configs = getClusterConfigs();
	if (!configs) {
		return res.status(404).json([]);
	}
	return res.status(200).json(configs);
});

clusterRouter.get(`/:id`, (req, res) => {
	try {
		const found = getClusterByIdOrThrow(req?.params?.id);
		return res.status(200).json(found);
	} catch (err) {
		return res.status(404).json(null);
	}
});

clusterRouter.get(`/:id/generate`, async (req, res) => {
	try {
		const cluster = getClusterByIdOrThrow(req?.params?.id);
		const users = await fetchPeers();

		const padding = 30;
		const rowPadding = 35;  // Padding between rows
		const usernameFontSize = 16;  // Height for username text

		const availableWidth = width - 2 * padding;  // Apply padding only for canvas
		const availableHeight = height - 2 * padding;

		var ctx = canvas.getContext("2d");

		const svgWidth = 130, svgHeight = 91;
		// TODO work with cluster.pcColors (?)

		const clusterWidth = cluster.columns * svgWidth;
		const clusterHeight = cluster.rows * (svgHeight + rowPadding);  // Include row padding in height

		const scaleX = availableWidth / clusterWidth;
		const scaleY = availableHeight / clusterHeight;

		const scale = Math.min(scaleX, scaleY);

		const scaledClusterWidth = clusterWidth * scale;
		const scaledClusterHeight = clusterHeight * scale;

		const xOffset = (width - scaledClusterWidth) / 2;
		const yOffset = (height - scaledClusterHeight) / 2;

		// Fill background
		ctx.drawImage(backgroundImage, 0, 0, width, height);
		ctx.fillStyle = 'rgba(20, 20, 27, 0.75)';
		ctx.fillRect(0, 0, width, height);

		const rowHeight = svgHeight * scale;
		const columnWidth = svgWidth * scale;

		// Draw row headers
		ctx.fillStyle = '#fff';
		ctx.font = `400 20px sans`;
		ctx.textAlign = 'center';
		for (let row = 0; row < cluster.rows; row++) {
			// Draw row numbers starting from the bottom (bottom-most row should be R1)
			ctx.fillText(`R${cluster.rows - row}`, padding / 2 + padding / 4, yOffset + row * (rowHeight + rowPadding) + (rowHeight / 2 + rowPadding / 2));
		}

		// Draw column headers
		ctx.textAlign = 'center';
		let pcCounter = 1;
		for (let col = 0; col < cluster.columns; col++) {
			const isSpacer = cluster.spacerColumns.includes(col + 1);
			if (!isSpacer) {

				ctx.fillStyle = '#fff';
				ctx.fillText(`P${pcCounter}`, xOffset + col * columnWidth + columnWidth / 2, yOffset);
				pcCounter++;
			} else {

				ctx.fillStyle = '#666';
				ctx.fillRect(xOffset + col * columnWidth + columnWidth / 2, yOffset, 1, cluster.rows * (rowHeight + rowPadding));
			}
		}

		// Draw each row and position PCs
		for (let row = 0; row < cluster.rows; row++) {
			let pcCounter = 0;
			for (let col = 0; col < cluster.columns; col++) {
				const isSpacer = cluster.spacerColumns.includes(col + 1);
				if (isSpacer) {
					continue;  // Skip drawing for spacers
				} else {
					pcCounter++;
				}

				const pcX = xOffset + col * columnWidth;
				const pcY = yOffset + (cluster.rows - 1 - row) * (rowHeight + rowPadding);

				// Find user sitting at this PC
				const user = users.find(user =>
					user.position.cluster === cluster.id &&
					user.position.row === row + 1 &&
					user.position.pc === pcCounter
				);
				const svgToDraw = user ? pcSvgActive : pcSvg;


				ctx.save();

				const shouldRotate = cluster.isWeird
					? cluster.rotations[row + 1]?.[col] === 1
					: (pcCounter % 2 !== 0); // Default rotation behavior for odd columns

				if (shouldRotate) {
					// Draw the rotated SVG
					const offset = rowHeight / 2 + usernameFontSize;
					ctx.translate(pcX + columnWidth / 2, pcY + offset);
					// Rotate the PC by 180 degrees (flip vertically)
					ctx.rotate(Math.PI);
					ctx.translate(-columnWidth / 2, - offset);

					ctx.drawImage(svgToDraw, 0, 0, columnWidth, rowHeight);
				} else {
					// Draw the non-rotated SVG
					ctx.drawImage(svgToDraw, pcX, pcY, columnWidth, rowHeight);
				}

				ctx.restore();
				ctx.save();

				let userText = "n/a";
				ctx.fillStyle = '#555';
				ctx.font = `400 ${usernameFontSize}px arial`;
				ctx.textAlign = "center";
				if (user) {
					ctx.font = `500 14px georgia`;
					ctx.fillStyle = "#fff";
					userText = user.username;
				}
				if (shouldRotate) {
					ctx.translate(pcX + columnWidth / 2, pcY + usernameFontSize + usernameFontSize / 2);
					// Username above rotated PC
				} else {
					// Username below non-rotated PC
					ctx.translate(pcX + columnWidth / 2, pcY + rowHeight + usernameFontSize * scale);
				}
				ctx.fillText(userText, 0, 0);
				ctx.restore();
			}
		}

		// Draw the cluster name above all PCs
		const clusterFontSize = 40;
		ctx.fillStyle = '#ffffff';
		ctx.font = `700 ${clusterFontSize}px arial`;
		ctx.textAlign = 'center';
		ctx.fillText(cluster.name, xOffset + (cluster.columns * columnWidth) / 2, clusterFontSize + clusterFontSize / 2);

		// Credits
		ctx.fillStyle = "#ccc";
		ctx.font = `400 16px georgia`;
		ctx.textAlign = 'left';
		ctx.fillText("Made by @odudniak", padding / 2, height - 16);

		res.setHeader('Content-Type', 'image/png');
		canvas.toBuffer((err, buf) => {
			if (err) {
				res.status(500).send('Failed to generate image');
			} else {
				res.send(buf);
			}
		});
		return;
	} catch (err) {
		console.log({ err });
		return res.status(400).jsonp(err);
	}
});


// UTILS ----------------------------------------------------------------------

export async function loadClusterImages() {
	const backgroundImagePath = path.join(__dirname, '../assets/wallpaper.jpg');
	const pcSvgPath = path.join(__dirname, '../assets/pc.svg');
	const pcSvgActivePath = path.join(__dirname, '../assets/pc-active.svg');

	pcSvg = await loadImage(pcSvgPath);
	pcSvgActive = await loadImage(pcSvgActivePath);
	backgroundImage = await loadImage(backgroundImagePath);
}

async function waitTillImageIsLoaded(img) {
	return new Promise((resolve, reject) => {
		img.onload = async () => {
			resolve(true);
		};
	});
};

function getClusterByIdOrThrow(rawId) {
	if (isNaN(parseInt(rawId)))
		throw "Invalid id value provided";
	const parsedId = parseInt(rawId);
	const clusters = getClusterConfigs();
	const found = clusters.find(cluster => cluster.id === parsedId);
	if (!found)
		throw "Cluster not found";
	return found;
}


function getClusterConfigs() {
	try {
		const rawData = FS.readFileSync(env.CLUSTERS_CONFIG_FILE, 'utf8');
		return JSON.parse(rawData);
	} catch (_) {
		console.error(_);
		return null;
	}
}