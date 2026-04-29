FROM node:18.18-alpine

WORKDIR /tunning-manual

COPY package.json .

RUN npm install

COPY . .

# Для горячей перезагрузки в Docker
RUN npm install -g nodemon

EXPOSE 8080

CMD ["npm", "run", "dev-docker"]
