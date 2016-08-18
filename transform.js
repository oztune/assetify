const path = require('path')

const through = require('through2')
const staticModule = require('static-module')

module.exports = function transform (file, options) {
	if (path.extname(file) !== '.js') {
		return through()
	}

	// This seems to happen when the assetify plugin isn't
	// used. Not sure why really...
	if (!options._flags) {
		return through()
	}

	const callback = options._flags._assetCallback

	if (typeof callback !== 'function') {
		console.warn('assetify used but not initialized', file)
	}

	const dirName = path.dirname(file)

	const stream = staticModule({
		asset: {
			resolve: function (filePath) {
				filePath = path.resolve(dirName, filePath)

				if (callback) {
					const newString = callback(filePath)
					return quote(newString)
				} else {
					return 'undefined'
				}
			}
		}
	})

	return stream
}

function quote(string) {
	return `'${ string }'`
}