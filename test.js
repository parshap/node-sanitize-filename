var test = require("tape"),
	sanitize = require("./");

var REPLACEMENT_OPTS = {
	replacement: "_",
};

test("valid names", function(t) {
	["valid name.mp3", "résumé"].forEach(function(name) {
		t.equal(sanitize(name), name);
	});
	t.end();
});

test("valid names", function(t) {
	["valid name.mp3", "résumé"].forEach(function(name) {
		t.equal(sanitize(name, REPLACEMENT_OPTS), name);
	});
	t.end();
});

test("null character", function(t) {
	t.equal(sanitize("hello\u0000world"), "helloworld");
	t.end();
});

test("null character", function(t) {
	t.equal(sanitize("hello\u0000world", REPLACEMENT_OPTS), "hello_world");
	t.end();
});

test("control characters", function(t) {
	t.equal(sanitize("hello\nworld"), "helloworld");
	t.end();
});

test("control characters", function(t) {
	t.equal(sanitize("hello\nworld", REPLACEMENT_OPTS), "hello_world");
	t.end();
});

test("restricted codes", function(t) {
	["h?w", "h/w", "h*w"].forEach(function(name) {
		t.equal(sanitize(name), "hw");
	});
	t.end();
});

test("restricted codes", function(t) {
	["h?w", "h/w", "h*w"].forEach(function(name) {
		t.equal(sanitize(name, REPLACEMENT_OPTS), "h_w");
	});
	t.end();
});
