# Stage 1: Build the front-end
FROM node:16-alpine as builder
WORKDIR /talepod

COPY ../client/package.json ../client/yarn.lock ./client/
RUN cd client && yarn install

COPY ../client ./client
RUN cd client && yarn build

# Stage 2: Set up the back-end
FROM node:16-alpine
WORKDIR /talepod

COPY ../server/package.json ../server/yarn.lock ./server/
RUN cd server && yarn install

COPY ../server ./server

# Copy front-end build files to the back-end for serving static files
COPY --from=builder /talepod/client/build /talepod/server/client/build

EXPOSE 4000
EXPOSE 4001
EXPOSE 8080

LABEL maintainer="Yasser Zaky <yasserzakywafaa@gmail.com>"

CMD ["yarn", "start:prod"]

# ENV DIR /talepod

# RUN chown -R node.node /talepod

# # Tell docker that all future commands should run as the appuser user
# USER node

# LABEL maintainer="Yasser Zaky <yasserzakywafaa@gmail.com>"

# COPY tsconfig.json .
# COPY package.json .
# COPY yarn.lock .
# RUN  yarn install
# # RUN yarn install --frozen-lockfile

# COPY client/public client/public
# COPY client/src client/src
# RUN  yarn build

# COPY server server

# CMD yarn start:prod
