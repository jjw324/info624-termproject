# info624-termproject
## Information Retrieval Systems Term Project
Jacob Williamson

Department of Information Science

Drexel University

Summer 2020

---

## Running the Project
### Using Docker
The easiest way to run this project would be to use Docker. From the project root directory, run: `docker-compose up`  Note that this requires that you have Docker installed on your machine. 
Once all 3 containers are operational, navigate to localhost:5000 in your web browser.
### Not using Docker
If you aren't using Docker, then follow these steps.
1. Follow [these instructions](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started-install.html) to run ElasticSearch on localhost:9200 
2. In ./api, run `npm install`
3. Run `npm run dev` to start the API server on localhost:3001
4. In ./app, run `npm install`
5. Run `npm start` to start the React App on localhost:3000
Alternatively you could build the React app and use serve to host it on localhost:5000

## Components
- api - Node/Express server backend
- app - React frontend
- db - ElasticSearch database data

### PORTS:
- app (dev only): 3000
- app: 5000
- api: 3001
- db: 9200
