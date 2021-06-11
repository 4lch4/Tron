FROM node:16

WORKDIR /bot

COPY . .

RUN npm i
RUN npm run build

EXPOSE 3030

ENV DISCORD_TOKEN="${{ secrets.DISCORD_TOKEN }}"
ENV COMMAND_PREFIX='${{ secrets.COMMAND_PREFIX }}'
ENV OWNER_ID='${{ secrets.OWNER_ID }}'
ENV GIPHY_TOKEN='${{ secrets.GIPHY_TOKEN }}'

CMD ["npm", "start"]
