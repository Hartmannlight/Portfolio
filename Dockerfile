FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4173

COPY package.json ./
COPY index.html ./
COPY scripts ./scripts
COPY src ./src
COPY public ./public

EXPOSE 4173

CMD ["node", "scripts/dev-server.mjs"]
