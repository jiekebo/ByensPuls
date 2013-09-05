.PHONY : all test clean lint

all: node_modules lint build/byenspuls-min.js

node_modules: package.json
	#
	# NPM Update needed.
	#
	npm update

clean:
	rm build/*

lint:
	#jshint src/*.js
	#jshint test/grammar-tests.js

build/grammar.js: src/grammar.jison
	jison $< -o $@

build/byenspuls-grammar.js: src/ByensPuls.js build/grammar.js
	#
	# Compiling grammar
	#
	jspp $< > $@

build/byenspuls-min.js build/byenspuls-min.js.map: src/copyright.js build/byenspuls-grammar.js src/ByensPuls.js
	#
	# Please ignore the warnings below (these are in combined js code)
	#
	uglifyjs \
		src/copyright.js \
		build/byenspuls-grammar.js \
		src/ByensPuls.js \
		-o build/byenspuls-min.js \
		-c --comments \
		--source-map build/byenspuls-min.js.map

	#
	# Copy minified file to site
	#
	cp build/byenspuls-min.js* _site/