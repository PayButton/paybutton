FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install && npm run build --ignore-scripts
COPY . .

CMD chown node: -R node_modules && npm run storybook

