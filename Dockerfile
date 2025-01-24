FROM node:22.13.1-alpine as debug

WORKDIR /app

COPY package.json .


#get the mode of the app
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi


COPY . ./

EXPOSE 3000

CMD ["npm", "start"]

