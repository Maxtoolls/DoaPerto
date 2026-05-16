FROM node:18

WORKDIR /app

COPY frontend/package.json ./
COPY frontend/package-lock.json ./
COPY frontend/ ./

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
