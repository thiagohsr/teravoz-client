nvm_setup:
	@curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

node_setup:
	. ~/.nvm/nvm.sh && nvm install v10.12.0

front_setup:
	npm install yarn -g
	yarn install

setup:	nvm_setup	node_setup	front_setup

start:
	yarn run api

run:
	yarn run dev

test:
	yarn run test

test-watch:
	yarn run test:watch

lint:
	yarn run lint
