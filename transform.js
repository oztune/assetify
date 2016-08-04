const path = require('path')

const through = require('through2')
const staticModule = require('static-module')

module.exports = function transform (file, options) {
	if (path.extname(file) !== '.js') {
		console.log('skipping', file)
		return through()
	}

	const dirName = path.dirname(file)

	const callback = options._flags._assetCallback

	if (typeof callback !== 'function') {
		console.warn('assetify used but not initialized', file)
	}

	const stream = staticModule({
		asset: {
			resolve: function (filePath) {
				filePath = path.resolve(dirName, filePath)

				if (callback) {
					return quote(callback(filePath))
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