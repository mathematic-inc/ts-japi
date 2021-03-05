PATH:=$(PATH):$(PWD)/node_modules/.bin
SHELL:=env PATH=$(PATH) /bin/bash

all: build-lib build-docs build-readme

build-lib:
	@echo 'Building library...'
	@tsc

build-docs:
	@echo 'Building documentation...'
	@typedoc
	@rsync -a ./src/docs/assets ./docs

build-readme:
	@echo 'Building README...'
	@typedoc --plugin typedoc-plugin-markdown --out ./md-docs --theme markdown
	@mv md-docs/README.md README.md
	@rm -rf md-docs
	@ts-node scripts/readme-postbuild.ts

clean: clean-docs clean-readme clean-build clean-coverage

clean-docs:
	@echo 'Cleaning documentation...'
	@rm -rf ./docs

clean-readme:
	@echo 'Cleaning README...'
	@rm -rf ./readme

clean-lib:
	@echo 'Cleaning build artifacts...'
	@rm -rf ./lib

clean-coverage:
	@echo 'Cleaning test coverage...'
	@rm -rf ./coverage

.PHONY: all
.PHONY: build-docs
.PHONY: build-readme
.PHONY: build-lib
.PHONY: clean
.PHONY: clean-docs
.PHONY: clean-readme
.PHONY: clean-lib
.PHONY: clean-coverage