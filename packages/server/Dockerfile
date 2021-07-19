FROM node:14.17.3

WORKDIR /usr/src/app
EXPOSE 80
ENV NODE_ENV=production

COPY dist/package*.json ./
RUN npm install

COPY dist/ .

CMD ["npm", "start"]