# Installation Guide

This guide will walk you through setting up the Public Sector Lost & Found Management Platform on your local development environment or production server.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v5.0 or higher)
- **Git**

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd public-sector-lost-found
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env` file:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/public-sector-lost-found

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure your frontend `.env` file:

```env
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=Public Sector Lost & Found
```

## Database Setup

### Local MongoDB

1. **Install MongoDB** following the [official guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB service**:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Ubuntu/Debian
   sudo systemctl start mongod

   # On Windows
   net start MongoDB
   ```

3. **Create database** (optional - will be created automatically):
   ```bash
   mongosh
   use public-sector-lost-found
   ```

### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in backend `.env`

## External Services Setup

### Cloudinary (Image Storage)

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Update the Cloudinary configuration in backend `.env`

### Email Service

#### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Use your Gmail and app password in the email configuration

#### Other Email Providers
Update the email configuration based on your provider's SMTP settings.

## Running the Application

### Development Mode

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

### Production Build

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production**:
   ```bash
   cd backend
   npm start
   ```

## Initial Data Setup

### Create Super Admin User

Run the admin user creation script:

```bash
cd backend
node create-admin-users-direct.js
```

This will create:
- Super Admin user with email: `superadmin@system.com`
- Default password: `SuperAdmin123!`

### Create Sample Organizations

```bash
cd backend
node create-organizations-simple.js
```

## Verification

### Health Check

Visit these URLs to verify the setup:

- Frontend: http://localhost:3000
- Backend Health: http://localhost:5001/api/health
- Admin Login: http://localhost:3000/admin/login

### Test Email

Run the email test script:

```bash
cd backend
node test-email.js
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Email Not Working**
   - Verify SMTP settings
   - Check app password for Gmail
   - Test with email test script

3. **Cloudinary Upload Fails**
   - Verify API credentials
   - Check network connectivity
   - Ensure proper environment variables

4. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Logs and Debugging

- Backend logs: Check console output when running `npm run dev`
- Frontend logs: Check browser console
- Database logs: Check MongoDB logs
- Email logs: Check backend console for email sending status

## Next Steps

Once installation is complete:

1. [Quick Start Guide](./quick-start.md) - Get familiar with basic operations
2. [User Registration](./user-registration.md) - Learn about user onboarding
3. [Organization Setup](./organization-setup.md) - Configure your organization
4. [Admin Guide](/admin/) - Understand administration features