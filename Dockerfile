# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app and Compile the Express server
RUN npm run build

# 2. Production Stage
FROM node:20-alpine

WORKDIR /app

# Only install production dependencies to keep the image small
COPY package*.json ./
RUN npm install --omit=dev

# Copy the compiled assets from the builder stage
COPY --from=builder /app/dist ./dist

# Set standard environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the application using the compiled backend server
CMD ["npm", "start"]
