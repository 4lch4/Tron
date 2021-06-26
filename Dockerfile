FROM node:16

WORKDIR /bot

COPY . .

RUN npm ci
RUN npm run build

EXPOSE 3030

ENTRYPOINT ["npm", "start"]
