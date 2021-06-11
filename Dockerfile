FROM node:16

WORKDIR /bot

COPY . .

RUN npm i
RUN npm run build

EXPOSE 3030

CMD ["npm", "start"]
