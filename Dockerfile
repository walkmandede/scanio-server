FROM node:24.5.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set a dummy DATABASE_URL for prisma generate (it only needs the schema structure)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN npx prisma generate

EXPOSE 5003

CMD ["npm", "run", "app:dev"]