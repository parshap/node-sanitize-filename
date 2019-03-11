#!/usr/bin/env node

var sanitize = require('./')
var replacement = process.argv[2]
var data = []
var sanitizeAndOutput = () => {
  var str = Buffer.concat(data).toString()
  var sanitized = sanitize(str, { replacement })
  process.stdout.write(sanitized)
}

process.stdin.on('data', chunk => data.push(chunk))
process.stdin.on('end', sanitizeAndOutput)