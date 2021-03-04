const http = require('http');
const fs = require('fs');
const {createCanvas, loadImage} = require('canvas');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	const width = 1200;
	const height = 600;
	createImage(height, width, [{
		url: 'https://c.saavncdn.com/174/Complicated-English-2017-500x500.jpg',
		width: 100,
		height: 100,
		top: 200,
		left: 50
	},{
		url: 'https://c.saavncdn.com/174/Complicated-English-2017-500x500.jpg',
		width: 100,
		height: 100,
		top: 250,
		left: 50
	},{
		url: 'https://c.saavncdn.com/174/Complicated-English-2017-500x500.jpg',
		width: 100,
		height: 100,
		top: 600,
		left: 50
	},{
		url: 'https://c.saavncdn.com/174/Complicated-English-2017-500x500.jpg',
		width: 100,
		height: 100,
		top: 800,
		left: 50
	},{
		url: 'https://c.saavncdn.com/174/Complicated-English-2017-500x500.jpg',
		width: 100,
		height: 100,
		top: 900,
		left: 50
	}]).then(image => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
		res.end('<img src="' + image + '" />');
	});
});

/**
 *
 * @param height - height of image
 * @param width - width of image
 * @param layers - {
 * url: string
 * width: integer,
 * height: integer,
 * top: integer,
 * left: integer,
 * circle: true,
 * }
 */
const createImage = function (height, width, layers) {
	const canvas = createCanvas(width, height);
	const context = canvas.getContext('2d');
	context.fillStyle = '#eee';
	context.fillRect(0, 0, width, height);
	const promises = layers.map(l => loadImage(l.url).then(image => context.drawImage(image, l.top, l.left, l.width, l.height)));
	return Promise.all(promises)
		.then(() => {
			const buffer = canvas.toBuffer('image/png');
			fs.writeFileSync(`images/${new Date().getTime()}.png`, buffer);
			return canvas.toDataURL();
		});
};

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
