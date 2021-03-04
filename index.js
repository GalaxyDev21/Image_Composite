const http = require('http');
const fs = require('fs');
const {createCanvas, loadImage} = require('canvas');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	const width = 1200;
	const height = 600;
	createImage(height, width, [{
		url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Clouds_over_the_Atlantic_Ocean.jpg',
		width: 800,
		height: 1000,
		top: 0,
		left: 0
	},
		{
			url: 'https://snoidcdnems02.cdnsrv.jio.com/c.saavncdn.com/174/Complicated-English-2017-500x500.jpg',
			width: 200,
			height: 250,
			top: 300,
			left: 400,
			circle: true
		},]).then(image => {
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
const createImage = async function (height, width, layers) {
	const canvas = createCanvas(width, height);
	const context = canvas.getContext('2d');
	context.fillStyle = '#eee';
	context.fillRect(0, 0, width, height);
	for (let l of layers) {
		await loadImage(l.url).then(image => {
			if (l.circle) {
				context.save();
				context.beginPath();
				context.arc(l.left + (l.width / 2), l.top + (l.height / 2), l.width / 2, 0, 2 * Math.PI, false);
				context.clip();
				context.drawImage(image, l.left, l.top, l.width, l.height);
				context.restore();
			} else
				context.drawImage(image, l.left, l.top, l.width, l.height);
		});
	}
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(`images/${new Date().getTime()}.png`, buffer);
	return canvas.toDataURL();
};

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
