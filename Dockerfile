FROM node:14
COPY . /api
WORKDIR /api

RUN npm install

EXPOSE 8000
CMD [ "npm", "run", "start" ]