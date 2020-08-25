# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g serve
COPY . .
RUN npm run build

EXPOSE 5000

# start app
CMD ["npm", "run", "serve"]
