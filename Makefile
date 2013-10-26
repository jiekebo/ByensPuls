.PHONY : all test clean lint

all: node_modules clean lint build

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

src/Grammar.js: src/Grammar.jison
	jison $< -o $@

build/parsergrammar.js: src/BPParser.js
	jspp $< > $@

build/lib.js: src/Util.js
	jspp $< > $@

build/controller.js: src/Controller.js
	jspp $< > $@

build: build/parsergrammar.js build/lib.js build/controller.js 
	sed "s/src\/Converter.js/js\/converter-min.js/" build/controller.js > build/controller-w.js
	uglifyjs -c --ascii -o build/controller-min.js build/controller-w.js
	uglifyjs -c --ascii -o build/lib-min.js build/Lib.js
	# Set correct import statement for web worker.
	sed "1s/.*/importScripts('lib-min.js');/" src/Converter.js > build/converter.js
	uglifyjs -c --ascii -o build/converter-min.js build/converter.js

release:
	cp build/controller-min.js build/converter-min.js build/lib-min.js ByensPuls-ghpages/js