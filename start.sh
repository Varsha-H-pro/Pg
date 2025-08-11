#!/bin/bash

echo "🏠 Starting PG Perfect Management System..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Check if MongoDB is installed and running
if command_exists mongod; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo "⚠️  MongoDB is not running. Attempting to start..."
        if command_exists systemctl; then
            sudo systemctl start mongod
        elif command_exists brew; then
            brew services start mongodb-community
        else
            echo "❌ Please start MongoDB manually"
            exit 1
        fi
    fi
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not installed. Please install MongoDB first."
    echo "   Visit: https://docs.mongodb.com/manual/installation/"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/perfect-pg-front/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend/perfect-pg-front && npm install && cd ../..
fi

# Check if environment files exist
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creating backend environment file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your actual credentials before running the application"
fi

if [ ! -f "frontend/perfect-pg-front/.env" ]; then
    echo "⚙️  Creating frontend environment file..."
    cp frontend/perfect-pg-front/.env.example frontend/perfect-pg-front/.env
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 Starting the application..."
echo ""

# Start both backend and frontend
if command_exists concurrently; then
    npm run dev
else
    echo "📦 Installing concurrently for running both servers..."
    npm install -g concurrently
    npm run dev
fi