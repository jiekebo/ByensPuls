.PHONY : all test clean lint

all: node_modules clean lint build/byenspuls-min.js

node_modules: package.json
	#
	# NPM Update needed.
	#
	npm update

clean:
	rm -rf build
	mkdir build/

lint:
	#jshint src/*.js
	#jshint test/grammar-tests.js

release:
	cp build/byenspuls-min.js ByensPuls-ghpages/js

src/Grammar.js: src/Grammar.jison
	#
	# Compiling grammar
	#
	jison $< -o $@

build/byenspuls-combined.js: src/ByensPuls.js
	jspp $< > $@

build/byenspuls-min.js build/byenspuls-min.js.map: build/byenspuls-combined.js
	#
	# Please ignore the warnings below (these are in combined js code)
	#
	uglifyjs \
		-c --ascii \
		-o build/byenspuls-min.js \
		build/byenspuls-combined.js
