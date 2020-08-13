# info624-termproject
Information Retrieval Systems project

This repository contains 3 separate, smaller components

api - Express server backend
app - React frontend
db - ElasticSearch database

PORTS:
app: 3000
api: 3001
db: 9200

ENV File:
api/.env:
- API_HOST
- API_PORT
- ES_HOST
- ES_PORT

React:
docker run -it -p 3000:3000 jjw324/info624_app

Express:
docker run -p 3001:3001 jjw324/info624_api

ElasticSearch:
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.8.1