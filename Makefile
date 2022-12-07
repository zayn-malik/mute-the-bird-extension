.PHONY: package build clean

all: clean build package

build:
	yarn build

package:
	zip -r chrome-ext.zip dist

clean:
	rm -rf dist	

