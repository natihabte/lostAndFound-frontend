# Authentication API

The authentication system provides secure access to the platform using JWT tokens with support for multiple user roles and organization-based access control.

## Authentication Flow

### 1. User Registration

Register a new user account.

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!",
  "organization": "org_id_optional"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification.",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "organization": "org_id",
    "verified": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Email Verification

Verify user email address using the token sent via email.

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "user": {
    "id": "user_id",
    "verified": true
  }
}
```

### 3. User Login

Authenticate user and receive JWT token.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "organization": {
      "id": "org_id",
      "name": "Organization Name",
      "type": "university"
    },
    "permissions": ["read_items", "create_items", "submit_claims"]
  }
}
```

### 4. Token Refresh

Refresh expired JWT token using refresh token.

```http
POST /api/auth/refresh
Content-Type: application/json
Authorization: Bearer <refresh_token>

{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### 5. Logout

Invalidate current session and tokens.

```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Password Management

### Forgot Password

Request password reset email.

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### Reset Password

Reset password using token from email.

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Change Password

Change password for authenticated user.

```http
PUT /api/auth/change-password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Admin Authentication

### Admin Login

Separate login endpoint for administrators.

```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "AdminPassword123!",
  "adminType": "super_admin" // or "org_admin", "hall_admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "admin_jwt_token",
  "admin": {
    "id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "super_admin",
    "organization": "org_id_if_applicable",
    "permissions": [
      "manage_users",
      "manage_organizations",
      "view_reports",
      "system_config"
    ]
  }
}
```

## Token Structure

### JWT Token Payload

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "user",
  "organization": "org_id",
  "permissions": ["read_items", "create_items"],
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Token Validation

All protected endpoints require valid JWT token in Authorization header:

```http
Authorization: Bearer <jwt_token>
```

## User Roles and Permissions

### User Role Hierarchy

1. **Super Admin**
   - Platform-wide access
   - Manage all organizations
   - System configuration
   - Global reports

2. **Organization Admin**
   - Organization-specific access
   - Manage organization users
   - Organization settings
   - Organization reports

3. **Hall Admin**
   - Location-specific access
   - Manage location items
   - Local user support
   - Location reports

4. **User**
   - Basic platform access
   - Report items
   - Submit claims
   - Personal profile management

### Permission System

```json
{
  "permissions": {
    "items": {
      "create": true,
      "read": true,
      "update": "own", // own items only
      "delete": "own"
    },
    "claims": {
      "create": true,
      "read": "own",
      "update": false,
      "delete": "own"
    },
    "users": {
      "create": false,
      "read": "public_profile",
      "update": "own",
      "delete": false
    },
    "admin": {
      "access_dashboard": false,
      "manage_users": false,
      "view_reports": false
    }
  }
}
```

## Security Features

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Cannot be common passwords

### Rate Limiting

- **Login attempts**: 5 attempts per 15 minutes per IP
- **Registration**: 3 registrations per hour per IP
- **Password reset**: 3 requests per hour per email
- **Token refresh**: 10 requests per minute per user

### Security Headers

All authentication responses include security headers:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Error Handling

### Authentication Errors

```json
{
  "success": false,
  "error": "Invalid credentials",
  "code": "AUTH_INVALID_CREDENTIALS",
  "details": {
    "field": "password",
    "message": "Password is incorrect"
  }
}
```

### Common Error Codes

- `AUTH_INVALID_CREDENTIALS` - Wrong email/password
- `AUTH_USER_NOT_FOUND` - User doesn't exist
- `AUTH_USER_NOT_VERIFIED` - Email not verified
- `AUTH_ACCOUNT_LOCKED` - Too many failed attempts
- `AUTH_TOKEN_EXPIRED` - JWT token expired
- `AUTH_TOKEN_INVALID` - Invalid JWT token
- `AUTH_INSUFFICIENT_PERMISSIONS` - Access denied
- `AUTH_PASSWORD_TOO_WEAK` - Password doesn't meet requirements

## Integration Examples

### JavaScript/Node.js

```javascript
class AuthService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      },
      body: JSON.stringify({ refreshToken })
    });

    const data = await response.json();
    
    if (data.success) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return data;
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
}
```

### Python

```python
import requests
import json
from datetime import datetime, timedelta

class AuthService:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.refresh_token = None
        self.token_expires = None

    def login(self, email, password):
        response = requests.post(
            f"{self.base_url}/auth/login",
            json={"email": email, "password": password}
        )
        
        data = response.json()
        
        if data.get('success'):
            self.token = data['token']
            self.refresh_token = data['refreshToken']
            # JWT tokens typically expire in 1 hour
            self.token_expires = datetime.now() + timedelta(hours=1)
        
        return data

    def get_auth_headers(self):
        if self.token_expires and datetime.now() >= self.token_expires:
            self.refresh_token_request()
        
        return {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }

    def refresh_token_request(self):
        response = requests.post(
            f"{self.base_url}/auth/refresh",
            json={"refreshToken": self.refresh_token},
            headers={'Authorization': f'Bearer {self.refresh_token}'}
        )
        
        data = response.json()
        
        if data.get('success'):
            self.token = data['token']
            self.refresh_token = data['refreshToken']
            self.token_expires = datetime.now() + timedelta(hours=1)
```

## Testing

### Authentication Test Suite

```javascript
describe('Authentication API', () => {
  test('should register new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      phone: '+1234567890'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(userData.email);
  });

  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPassword123!'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  test('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid credentials');
  });
});
```

This authentication system provides secure, scalable access control for the platform with comprehensive user management and role-based permissions.