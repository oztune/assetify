'use strict'

module.exports = function (callback) {
	return function (bundle, options) {
		let onFile

		function assetCallback () {
			if (onFile) {
				return onFile.apply(null, arguments)
			}
		}

		bundle.on('bundle', stream => {
			bundle._mdeps.options._assetCallback = assetCallback

			const value = callback()

			onFile = null
			let onComplete

			if (Array.isArray(value)) {
				onFile = value[0]
				onComplete = value[1]
			} else if (typeof value === 'function') {
				onFile = value
			} else if (value) {
				throw new Error('Invalid return type')
			}

			if (onComplete) {
				stream.on('end', () => {
					onComplete()
				})
			}
		})
	}
}