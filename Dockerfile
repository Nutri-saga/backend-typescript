FROM node:19
RUN mkdir node
#COPY package*.json ./
RUN chown -R $user:$user /node
COPY . ./node
WORKDIR ./node/
RUN npm install

EXPOSE 5555
RUN npm run build && npm install bcrypt --save
RUN npm install typescript ts-node
CMD ["node", "build/src/index.js"]
