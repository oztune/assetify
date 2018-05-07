'use strict'

const path = require('path')
const fs = require('fs-extra')

module.exports = function assetTransform (outputDir, baseUrl, noCopy) {
	const template = createTemplate({ baseUrl, md5: true })
	if (process.env.NODE_ENV === 'production') {
		console.log('start', outputDir, baseUrl, noCopy)
	}

	return () => {

		const filesToCopy = noCopy ? null : {}

		return [
			(file) => {
				const url = template(file)

				if (filesToCopy) {
					filesToCopy[file] = path.resolve(outputDir, url.split('/').pop())
				}

				return url
			},
			() => {
				if (!filesToCopy) return
				// NOTE: I'm not really sure this works... May need more testing.
				//
				// I can imagine a scenario where one processes checks for existence
				// but the other one _just_ started copying, so it'll get back false.
				//
				// console.log('DONE', filesToCopy)
				for (let from in filesToCopy) {
					const to = filesToCopy[from]

					fs.pathExists(to)
						.then(exists => {
							if (!exists) {
								return fs.copy(from, to)
									.then(() => {
										// console.log('Copied file ', to)
									})
							} else {
								// console.log('File already exists', to)
							}
						})
						.catch(e => {
							// console.error('Error copying ' + from, e)
						})
				}
			}
		]
	}
}

const md5File = require('md5-file')

// Given a file path, return what the url should be.
function createTemplate (options) {
	options = options || {}
	const baseUrl = options.baseUrl || '/assets'
	const md5 = options.md5 === undefined ? true : options.md5

	return function assetUrlTemplate (assetPath) {
		let url = baseUrl

		if (md5) {
			const hash = md5File.sync(assetPath)
			const ext = path.extname(assetPath)
			const name = path.basename(assetPath, ext)
			url += `/${ name }-${ hash }${ ext }`
		} else {
			const name = path.basename(assetPath)
			url += `/${ name }`
		}

		return url
	}
}
