# PG Perfect - Setup Guide

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (Community Edition) - [Installation Guide](https://docs.mongodb.com/manual/installation/)
- **Git** (for cloning the repository)

## Required External Services

You'll need accounts and API keys for:

1. **Cloudinary** (for image storage) - [Sign up here](https://cloudinary.com/)
2. **Gmail App Password** (for email notifications) - [Setup Guide](https://support.google.com/accounts/answer/185833)
3. **Razorpay** (for payment processing) - [Sign up here](https://razorpay.com/)

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Make the setup script executable and run it:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend/perfect-pg-front
   npm install
   cd ../..
   ```

2. **Setup environment variables:**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   cp frontend/perfect-pg-front/.env.example frontend/perfect-pg-front/.env
   ```

3. **Update backend/.env with your credentials:**
   ```env
   MONGO_URI=mongodb://localhost:27017/pg-perfect
   PORT=5000
   CLIENT_URL=http://localhost:5174
   JWT_SECRET_CODE=your-super-secret-jwt-key-here
   
   # Cloudinary
   CLOUD_NAME=your-cloudinary-cloud-name
   API_KEY=your-cloudinary-api-key
   API_SECRET=your-cloudinary-api-secret
   
   # Gmail
   GMAIL_APP_ID=your-gmail-id@gmail.com
   GMAIL_APP_PASSWORD=your-gmail-app-password
   
   # Razorpay
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_SECRET_KEY=your-razorpay-secret-key
   ```

4. **Start MongoDB:**
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   ```

5. **Run the application:**
   ```bash
   # Option A: Run both servers with concurrently
   npm run dev
   
   # Option B: Run servers separately
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

## Access the Application

- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/ping

## Default Routes

### Public Routes
- `/homepage` - Landing page
- `/aboutuspage` - About us page
- `/contactus` - Contact form
- `/findpg` - Search PGs
- `/signup` - Owner registration
- `/login` - Owner login
- `/userlogin` - Student/Guest login

### Owner Dashboard Routes
- `/admindashboard` - Owner dashboard
- `/addbuilding` - Add new property
- `/listbuilding` - View all properties
- `/adduser` - Add new tenant

### Student Dashboard Routes
- `/studentdashboard` - Student dashboard
- `/addfeedback` - Provide feedback
- `/updateuserlogin` - Update login credentials

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `sudo systemctl status mongod`
   - Check connection string in backend/.env

2. **Port Already in Use**
   - Backend (5000): `lsof -ti:5000 | xargs kill -9`
   - Frontend (5174): `lsof -ti:5174 | xargs kill -9`

3. **Image Upload Issues**
   - Verify Cloudinary credentials in backend/.env
   - Check upload folder permissions: `chmod 755 backend/uploads`

4. **Email Not Sending**
   - Enable 2-factor authentication on Gmail
   - Generate and use App Password instead of regular password

5. **Payment Integration Issues**
   - Verify Razorpay API keys
   - Ensure test/live mode consistency

### Development Tips

1. **Database Management**
   - Use MongoDB Compass for GUI: [Download here](https://www.mongodb.com/products/compass)
   - Connection string: `mongodb://localhost:27017/pg-perfect`

2. **API Testing**
   - Use Postman or Thunder Client
   - Import the API collection from `/docs/api-collection.json` (if available)

3. **Logs and Debugging**
   - Backend logs: Check terminal running `npm run dev:backend`
   - Frontend logs: Check browser console (F12)
   - MongoDB logs: `sudo journalctl -u mongod`

## Docker Setup (Alternative)

If you prefer using Docker:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

## Project Structure

```
pg-perfect/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controller/     # Route controllers
│   │   ├── model/         # MongoDB schemas
│   │   ├── middleware/    # Auth & validation
│   │   ├── router/        # API routes
│   │   └── config/        # Database config
│   ├── uploads/           # Temp file uploads
│   └── .env              # Backend environment
├── frontend/perfect-pg-front/  # React frontend
│   ├── src/
│   │   ├── pages/        # React components
│   │   ├── redux/        # State management
│   │   └── helper/       # Utilities
│   └── .env              # Frontend environment
└── README.md
```

## Support

If you encounter any issues:

1. Check this setup guide
2. Review the troubleshooting section
3. Check the project's README.md
4. Create an issue in the project repository

## Next Steps

After successful setup:

1. Create an owner account via `/signup`
2. Add your first property via `/addbuilding`
3. Add tenants via `/adduser`
4. Test the complaint system
5. Configure payment integration
6. Customize the application as needed

Happy coding! 🚀