# Install locked dependencies and build the generated Prisma client and API.
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Runtime image includes Prisma CLI for applying checked-in migrations at startup.
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/generated ./generated
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY package*.json ./
RUN mkdir -p /app/uploads
EXPOSE 4000
CMD ["npm", "run", "start:container"]
