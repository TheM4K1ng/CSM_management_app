FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install 
RUN npm install -g serve
COPY . .

RUN npm run build

CMD ["serve", "-s", "dist", "-l", "4173"]