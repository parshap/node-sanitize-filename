# sanitize-filename

Sanitize a string to be safe for use as a file name in Windows and Unix
systems by stripping all [control
characters](http://en.wikipedia.org/wiki/C0_and_C1_control_codes) and
restricted characters (`\/:*?"<>|`).

# Example

```js
var sanitize = require("sanitize-filename"),
	fs = require("fs"),
	filename = sanitize("h*ello:/world?"),
	stream fs.createWriteStream(filename);
fs.end("hello world");
```

# API

## sanitize(filename)

Sanitize the input string.

# Installation

```
npm install sanitize-filename
```
