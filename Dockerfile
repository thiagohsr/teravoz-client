# Choose node environment version
FROM node:jessie

# Set image/container running app directory
WORKDIR /home/node/app

# Install packages using yarn
COPY ./package.json /home/node/app/package.json
COPY ./yarn.lock /home/node/app/yarn.lock
RUN yarn --silent

# Copy files to app directory
COPY . .

# Set port to access app
EXPOSE 3002 3000

# Run app
CMD ["yarn", "dev"]
