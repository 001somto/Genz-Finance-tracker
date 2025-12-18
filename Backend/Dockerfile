FROM node:20-alpine

WORKDIR /spendsave/

COPY package.*json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
