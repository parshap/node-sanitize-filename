# sanitize-filename

Sanitize user input for safe use as a file name in Unix or Windows
systems.

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

Removes all [control
characters](http://en.wikipedia.org/wiki/C0_and_C1_control_codes) and
restricted characters (`"\/:*?"<>|`) from the input string.

# Installation

```
npm install sanitize-filename
```
