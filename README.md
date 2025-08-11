# PG Perfect - PG Management System

A comprehensive PG (Paying Guest) management system built with Node.js, Express, React, and MongoDB.

## Features

- **Owner Dashboard**: Manage properties, tenants, and complaints
- **Student Dashboard**: Pay rent, lodge complaints, provide feedback
- **Property Management**: Add/edit properties with photos and details
- **Complaint System**: Track and resolve tenant complaints
- **Payment Integration**: Razorpay integration for rent and deposit payments
- **Feedback System**: Collect and analyze tenant feedback
- **Search & Filter**: Find PGs by location and category

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- Razorpay (Payment Gateway)
- Nodemailer (Email Service)

### Frontend
- React.js with Vite
- Redux Toolkit (State Management)
- Tailwind CSS & DaisyUI
- Framer Motion (Animations)
- Chart.js (Analytics)
- React Router (Navigation)

## Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)
- Gmail account with app password (for emails)
- Razorpay account (for payments)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pg-perfect
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Update the `.env` file with your actual credentials:
- MongoDB connection string
- Cloudinary credentials
- Gmail app credentials
- Razorpay API keys
- JWT secret key

### 3. Frontend Setup

```bash
cd frontend/perfect-pg-front
npm install
```

Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Update the frontend `.env` file with your backend URL.

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the required collections.

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend/perfect-pg-front
npm run start
```
The frontend will run on `http://localhost:5174`

## Default Routes

### Public Routes
- `/homepage` - Landing page
- `/aboutuspage` - About us page
- `/contactus` - Contact form
- `/findpg` - Search PGs
- `/signup` - Owner registration
- `/login` - Owner login
- `/userlogin` - Student/Guest login

### Protected Routes (Owner)
- `/admindashboard` - Owner dashboard
- `/addbuilding` - Add new property
- `/listbuilding` - View all properties
- `/adduser` - Add new tenant

### Protected Routes (Student/Guest)
- `/studentdashboard` - Student dashboard
- `/addfeedback` - Provide feedback
- `/updateuserlogin` - Update login credentials

## API Endpoints

### Owner Routes
- `POST /app/owner/signup` - Owner registration
- `POST /app/owner/login` - Owner login
- `POST /app/owner/property/add` - Add property
- `GET /app/owner/property/getallproperty` - Get all properties
- `POST /app/owner/addguest` - Add tenant

### User Routes
- `POST /app/user/login` - Student login
- `POST /app/user/property/search` - Search properties
- `POST /app/user/addcomplain` - Lodge complaint
- `POST /app/user/addfeedback` - Submit feedback

### Helper Routes
- `GET /app/helper/complainSummery` - Get complaint analytics
- `POST /app/helper/rating/:propertyId` - Calculate property rating

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/pg-perfect
PORT=5000
CLIENT_URL=http://localhost:5174
JWT_SECRET_CODE=your-jwt-secret
CLOUD_NAME=your-cloudinary-name
API_KEY=your-cloudinary-key
API_SECRET=your-cloudinary-secret
GMAIL_APP_ID=your-gmail-id
GMAIL_APP_PASSWORD=your-gmail-password
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_SECRET_KEY=your-razorpay-secret
```

### Frontend (.env)
```
VITE_BASE_URL=http://localhost:5000/app
VITE_RAZORPAY_CHECKOUT_URL=https://checkout.razorpay.com/v1/checkout.js
```

## Project Structure

```
pg-perfect/
├── backend/
│   ├── src/
│   │   ├── controller/     # Route controllers
│   │   ├── model/         # MongoDB schemas
│   │   ├── middleware/    # Authentication & validation
│   │   ├── router/        # API routes
│   │   └── config/        # Database configuration
│   ├── uploads/           # Temporary file uploads
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── frontend/perfect-pg-front/
│   ├── src/
│   │   ├── pages/        # React components/pages
│   │   ├── redux/        # State management
│   │   ├── helper/       # Utility functions
│   │   └── main.jsx      # App entry point
│   └── public/           # Static assets
└── README.md
```

## Key Features Explained

### 1. Property Management
- Owners can add properties with photos, descriptions, and facilities
- Support for different categories (Boys, Girls, Co-living)
- Room management with occupancy tracking

### 2. Tenant Management
- Add tenants with room assignments
- Generate login credentials automatically
- Send credentials via email

### 3. Complaint System
- Tenants can lodge complaints with photos
- Categorized complaints (cleaning, food, maintenance, etc.)
- Owner can resolve complaints
- Rating system based on complaint resolution

### 4. Payment System
- Razorpay integration for rent and deposits
- Monthly payment tracking
- Payment status verification

### 5. Analytics Dashboard
- Complaint analytics with charts
- Revenue tracking
- Property-wise performance metrics

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check upload folder permissions

3. **Email Not Sending**
   - Verify Gmail app password
   - Enable 2-factor authentication on Gmail

4. **Payment Integration Issues**
   - Check Razorpay API keys
   - Ensure test/live mode consistency

### Development Tips

1. Use MongoDB Compass for database visualization
2. Check browser console for frontend errors
3. Monitor backend logs for API issues
4. Use Postman for API testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.