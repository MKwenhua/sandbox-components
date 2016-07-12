const loadImage = (url) => {
	return new Promise((resolve,reject) => {
		var image = new Image();

		image.onload = () => {
			resolve();
		};
		image.onerror = () => {
			var message = 'could not load image at ' + url;
			reject(new Error(message));
		};
		image.src = url;
	});
}

module.exports = loadImage;