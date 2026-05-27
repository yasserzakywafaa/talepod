FROM node:22-alpine AS build

WORKDIR /app

# Puppeteer's bundled Chromium is glibc-based and won't run on Alpine (musl);
# skip its download and use the distro's Chromium at runtime instead.
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:22-alpine

ENV NODE_ENV=production

# System Chromium + fonts so Puppeteer can render the eBook PDF export.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      font-noto
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=build /app/build ./build

EXPOSE 8080

CMD ["node", "build/server.js"]
