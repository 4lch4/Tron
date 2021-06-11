FROM node:16

WORKDIR /bot

COPY . .

RUN npm i
RUN npm run build

EXPOSE 3030

ENV DISCORD_TOKEN="${{ github.env.DISCORD_TOKEN }}"
ENV COMMAND_PREFIX='${{ github.env.COMMAND_PREFIX }}'
ENV OWNER_ID='${{ github.env.OWNER_ID }}'
ENV GIPHY_TOKEN='${{ github.env.GIPHY_TOKEN }}'

CMD ["npm", "start"]
