FROM node:14-alpine3.12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3001
CMD [ "npm", "run", "dev"]