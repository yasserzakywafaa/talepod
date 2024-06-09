# Stage 1: Build the frontend
FROM node:alpine as client-builder

# Set working directory inside the Docker image
WORKDIR /client

# Copy the client dependencies
COPY client/package.json client/yarn.lock ./
RUN yarn install

# Copy the rest of the client source code
COPY client ./
RUN yarn build

# -------------------------------- #

# Stage 2: Build the backend
FROM node:alpine as server-builder

# Set working directory inside the Docker image
WORKDIR /server

# Copy the server dependencies
COPY server/package.json server/yarn.lock ./
RUN yarn install

# Copy the rest of the server source code
COPY server ./
RUN yarn build

# -------------------------------- #

# Stage 3: Set up the final image
FROM node:alpine as deploy-builder

# Set working directory inside the Docker image
WORKDIR /talepod-app

# Copy dependencies
COPY  .env /talepod-app/

# Copy frontend build output to the final image
COPY --from=client-builder /client/build /talepod-app/build

# Copy backend build output to the final image
COPY --from=server-builder /server/build /talepod-app/build
COPY --from=server-builder /server/package.json /talepod-app/
# COPY --from=server-builder /server/.env /talepod-app/
COPY --from=server-builder /server/yarn.lock /talepod-app/
COPY --from=server-builder /server/node_modules /talepod-app/node_modules


EXPOSE 4000-4001
EXPOSE 8080

LABEL maintainer="Yasser Zaky <yasserzakywafaa@gmail.com>"

CMD ["yarn", "start:prod"]