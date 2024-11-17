FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install production dependencies
RUN bun install --frozen-lockfile --production

# Copy application files
COPY . .

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Expose the port
EXPOSE ${PORT:-3000}

# Start the server
CMD ["bun", "run", "start"] 
