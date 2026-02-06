# ---------- Stage 1 – Build ----------
FROM node:22-alpine AS builder

# Working directory
WORKDIR /app

# Install build dependencies for both our PoC and the cloned repo
COPY package*.json ./
RUN npm ci

# Copy our source (including scripts, src, etc.)
COPY . .

# Run the setup script – clones the original course‑creator repo and builds its CLI
RUN chmod +x scripts/setup.sh && ./scripts/setup.sh

# Build the front‑end UI (Vite) – outputs static files in frontend/dist
RUN cd frontend && npm install && npm run build

# Compile our TypeScript back‑end (produces dist/ folder)
RUN npx tsc

# ---------- Stage 2 – Runtime ----------
FROM node:22-alpine AS runner
ENV NODE_ENV=production

# Persist LMDB data
VOLUME /data
WORKDIR /app

# Copy compiled back‑end
COPY --from=builder /app/dist ./dist

# Copy runtime node_modules (production only)
COPY --from=builder /app/node_modules ./node_modules

# Copy built UI assets so Express can serve them
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy the cloned repo's compiled CLI (used by the back‑end at runtime)
COPY --from=builder /app/repo/dist/cli ./repo/dist/cli

EXPOSE 3000
CMD ["node", "dist/src/server/index.js"]
