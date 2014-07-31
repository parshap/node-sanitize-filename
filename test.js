var test = require("tape"),
	sanitize = require("./");

test("valid names", function(t) {
	["valid name.mp3", "résumé"].forEach(function(name) {
		t.equal(sanitize(name), name);
	});
	t.end();
});

test("valid names", function(t) {
	["valid name.mp3", "résumé"].forEach(function(name) {
		t.equal(sanitize(name, "_"), name);
	});
	t.end();
});

test("null character", function(t) {
	t.equal(sanitize("hello\u0000world"), "helloworld");
	t.end();
});

test("null character", function(t) {
	t.equal(sanitize("hello\u0000world", "_"), "hello_world");
	t.end();
});

test("control characters", function(t) {
	t.equal(sanitize("hello\nworld"), "helloworld");
	t.end();
});

test("control characters", function(t) {
	t.equal(sanitize("hello\nworld", "_"), "hello_world");
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
		t.equal(sanitize(name, "_"), "h_w");
	});
	t.end();
});
