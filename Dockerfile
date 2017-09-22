FROM resin/raspberrypi2-node:slim
# Install apt deps
RUN apt-get update && apt-get install -y \
  build-essential \
  git \
  wget \
  python-dev && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app/

# Move to /usr/src/app
WORKDIR /usr/src/app

# Move package to filesystem
COPY "./package.json" ./

# Move app to filesystem
COPY "./" ./

# Install NodeJS dependencies via NPM
RUN npm i --unsafe-perm --production && npm cache clean --force && rm -rf /tmp/*

# Start app
CMD ["node", "/usr/src/app/lights.js"]

## uncomment if you want systemd
ENV INITSYSTEM on
