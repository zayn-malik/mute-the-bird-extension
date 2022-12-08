.PHONY: package build clean

all: clean build package

build:
	yarn build

package:
	zip -r extension.zip dist

clean:
	rm -rf dist	
	rm -f extension.zip

