#!/bin/sh
# SyndiAI startup script
# Pushes DB schema and starts the production server

echo "═══════════════════════════════════════════"
echo "  SyndiAI — Starting..."
echo "═══════════════════════════════════════════"

# Wait for PostgreSQL to be ready
echo "[1/3] Waiting for PostgreSQL..."
max_retries=30
retry_count=0
while [ $retry_count -lt $max_retries ]; do
    if node -e "
        const { Client } = require('pg');
        const c = new Client({ connectionString: process.env.DATABASE_URL });
        c.connect().then(() => c.query('SELECT 1')).then(() => { c.end(); process.exit(0); }).catch(() => process.exit(1));
    " 2>/dev/null; then
        echo "      PostgreSQL is ready!"
        break
    fi
    retry_count=$((retry_count + 1))
    echo "      Attempt $retry_count/$max_retries..."
    sleep 2
done

if [ $retry_count -eq $max_retries ]; then
    echo "WARNING: PostgreSQL did not become ready in time. Retrying schema push..."
fi

# Push schema (retry with backoff)
echo "[2/3] Pushing database schema..."
for attempt in 1 2 3; do
    if npx drizzle-kit push --config drizzle.config.ts 2>&1; then
        echo "      Schema push successful!"
        break
    fi
    if [ $attempt -eq 3 ]; then
        echo "WARNING: Schema push failed after 3 attempts. Starting server anyway..."
    else
        echo "      Push attempt $attempt failed. Retrying in 5s..."
        sleep 5
    fi
done

# Start server
echo "[3/3] Starting server on port ${PORT:-3000}..."
echo "═══════════════════════════════════════════"
npm start
