FROM node:latest

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3900

ENTRYPOINT ["node", "dist/server.js"]