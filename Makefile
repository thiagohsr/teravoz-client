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

production:
	yarn run production

test:
	yarn run test

test-watch:
	yarn run test:watch

lint:
	yarn run lint

docker-build:
	sudo docker build -t teravoz-callcenter -f Dockerfile .

docker-run:
	sudo docker run -p 3001:3001 -p 3002:3002 -p 3000:3000 -p 5000:5000 -it --rm -v $(shell pwd) -w /home/node/app --name teravoz-app teravoz-callcenter
