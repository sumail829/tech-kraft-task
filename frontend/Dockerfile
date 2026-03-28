# Dev image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

# Run dev server on all interfaces
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]