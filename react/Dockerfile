FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn && yarn build
COPY . .

CMD chown node: -R node_modules && yarn storybook

