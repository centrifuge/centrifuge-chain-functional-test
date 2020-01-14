FROM node:10.16.0

WORKDIR /usr/src

COPY . ./

# https://github.com/npm/npm/issues/18163
RUN npm config set unsafe-perm true

RUN npm install

CMD ["npm", "test"]
