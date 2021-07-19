FROM node:14.17.3

WORKDIR /usr/src/app
EXPOSE 80
ENV NODE_ENV=production

COPY dist/ .
CMD ["npm", "start"]