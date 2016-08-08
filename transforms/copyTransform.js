'use strict'

const path = require('path')
const fs = require('fs-promise')

module.exports = function assetTransform (outputDir, baseUrl) {
	const template = createTemplate({ baseUrl, md5: true })

	return () => {

		const filesToCopy = {}

		return [
			(file) => {
				const url = template(file)
				filesToCopy[file] = path.resolve(outputDir, url.split('/').pop())

				return url
			},
			() => {
				console.log('DONE', filesToCopy)
				for (let from in filesToCopy) {
					const to = filesToCopy[from]
					fs.copy(from, to)
					// fs.createReadStream(from).pipe(fs.createWriteStream(to))
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