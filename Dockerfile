FROM node:18-alpine

# Install app dependencies
WORKDIR /usr/local/app


COPY package.json ./
COPY yarn.lock ./
RUN yarn install


# Bundle app source

COPY . .

ENV TZ=Europe/Madrid
ENV NODE_ENV=development
ENV EXPRESS_PORT=3000

EXPOSE ${EXPRESS_PORT}

CMD [ "node", "src/index.mjs" ]