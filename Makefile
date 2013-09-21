.PHONY : all test clean lint

all: node_modules lint build/byenspuls-min.js

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

src/grammar.js: src/grammar.jison
	#
	# Compiling grammar
	#
	jison $< -o $@

build/byenspuls-grammar.js: src/ByensPuls.js src/grammar.js
	
	jspp $< > $@

build/byenspuls-min.js build/byenspuls-min.js.map: src/copyright.js build/byenspuls-grammar.js
	#
	# Please ignore the warnings below (these are in combined js code)
	#
	uglifyjs \
		src/copyright.js \
		build/byenspuls-grammar.js \
		-o build/byenspuls-min.js \
		-c --comments \
		--source-map build/byenspuls-min.js.map