PATH:=$(PATH):$(PWD)/node_modules/.bin
SHELL:=env PATH=$(PATH) /bin/bash

all: lib docs README.md

lib: $(shell find src -name '*.ts')
	@echo 'Building library...'
	@tsc

docs: $(shell find src -name '*.ts')
	@echo 'Building documentation...'
	@typedoc
	@rsync -a ./src/docs/assets ./docs

README.md: src/docs/README.md
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
.PHONY: clean
.PHONY: clean-docs
.PHONY: clean-readme
.PHONY: clean-lib
.PHONY: clean-coverage