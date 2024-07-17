FROM node:16-alpine
COPY tests /app
RUN ls -la
WORKDIR /app
RUN npm install
COPY tests /app