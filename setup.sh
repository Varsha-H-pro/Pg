#!/bin/bash

echo "🏠 Setting up PG Perfect Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: sudo systemctl start mongod"
    echo "   Or if using Homebrew on macOS: brew services start mongodb-community"
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend/perfect-pg-front
npm install

echo "⚙️  Setting up environment files..."
cd ../../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend .env file - Please update with your credentials"
else
    echo "✅ Backend .env file already exists"
fi

cd ../frontend/perfect-pg-front
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend .env file"
else
    echo "✅ Frontend .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your MongoDB, Cloudinary, Gmail, and Razorpay credentials"
echo "2. Start MongoDB if not already running"
echo "3. Run the backend: cd backend && npm start"
echo "4. Run the frontend: cd frontend/perfect-pg-front && npm run start"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:5174"
echo "   Backend:  http://localhost:5000"