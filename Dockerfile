# FROM node:slim

# COPY . /usr/app

# WORKDIR /usr/app

# RUN apt-get update

# RUN apt-get -y install libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1

# RUN npm install

# CMD npm start

# FROM node:slim
# FROM debian:bookworm

# RUN apt-get update && apt-get install \
#     git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 \
#     -yq --no-install-suggests --no-install-recommends \
#     && apt-get clean && rm -rf /var/lib/apt/lists/*

# WORKDIR /usr/src/app

# COPY . /usr/src/app

# USER root

# RUN chown -R node /usr/src/app

# WORKDIR /usr/src/app

# USER node

# RUN npm install

# RUN npx electron-rebuild

# # Electron needs root for sand boxing
# # see https://github.com/electron/electron/issues/17972
# USER root
# RUN chown root /usr/src/app/node_modules/electron/dist/chrome-sandbox
# RUN chmod 4755 /usr/src/app/node_modules/electron/dist/chrome-sandbox

# # Electron doesn't like to run as root
# USER node
# CMD bash

FROM node:20
# install electron dependencies or more if your library has other dependencies
RUN apt-get update \
    && apt-get install xorg xvfb gtk2-engines-pixbuf \
    dbus-x11 xfonts-base xfonts-100dpi xfonts-75dpi xfonts-scalable \
    libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 \
    libasound2 libdrm2 libgbm1 libglvnd-dev dbus nano xauth  \
    -yq --no-install-suggests --no-install-recommends   \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
ENV DISPLAY=:0
# copy the source into /app
WORKDIR /app
COPY . .
RUN chown -R node /app
USER node
RUN npm install
## change dir to install application

RUN npm install 
RUN npx electron-rebuild -a x86
# Electron needs root for sandboxing
USER root
RUN chown root /app/node_modules/electron/dist/chrome-sandbox
RUN chmod 4755 /app/node_modules/electron/dist/chrome-sandbox
##EXPOSE 8085
# Electron doesn't like to run as root
USER node
##CMD ["npm", "start"]
CMD ["bash"]
