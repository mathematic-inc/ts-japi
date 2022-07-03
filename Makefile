PATH:=$(PATH):$(PWD)/node_modules/.bin
SHELL:=env PATH=$(PATH) /bin/bash

clean: clean-build clean-coverage

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