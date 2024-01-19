FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install && yarn run build --ignore-scripts
COPY . .

CMD chown node: -R node_modules && yarn storybook

