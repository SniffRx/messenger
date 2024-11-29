FROM node:22

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV ADDRESS=0.0.0.0

EXPOSE 3000

CMD ["npm", "start"]