# API Reference

The Public Sector Lost & Found Management Platform provides a comprehensive REST API for integration with external systems and custom applications.

## Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:5001/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "data": {}, // Response data (on success)
  "message": "Success message",
  "error": "Error message", // On failure
  "pagination": { // For paginated responses
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": {
    "field": "Specific field error"
  }
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination using query parameters:

```http
GET /api/items?page=1&limit=10&sort=createdAt&order=desc
```

Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc|desc (default: desc)

## Filtering

Most list endpoints support filtering:

```http
GET /api/items?category=electronics&status=active&organization=org_id
```

## File Uploads

File uploads use multipart/form-data:

```http
POST /api/upload
Content-Type: multipart/form-data

file: <binary-data>
```

Response:
```json
{
  "success": true,
  "data": {
    "url": "https://cloudinary.com/image/upload/v1234567890/sample.jpg",
    "publicId": "sample",
    "format": "jpg",
    "size": 1024000
  }
}
```

## Webhooks

The platform supports webhooks for real-time notifications:

### Supported Events

- `item.created` - New item reported
- `item.updated` - Item details updated
- `claim.submitted` - New claim submitted
- `claim.approved` - Claim approved
- `claim.rejected` - Claim rejected
- `user.registered` - New user registered
- `organization.approved` - Organization approved

### Webhook Payload

```json
{
  "event": "item.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "item_id",
    "type": "lost",
    "title": "Lost iPhone",
    "organization": "org_id"
  }
}
```

## API Endpoints Overview

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/:id` - Get user by ID
- `GET /users` - List users (admin only)

### Organizations
- `GET /organizations` - List organizations
- `GET /organizations/:id` - Get organization details
- `POST /organizations` - Create organization
- `PUT /organizations/:id` - Update organization
- `DELETE /organizations/:id` - Delete organization

### Items
- `GET /items` - List items
- `GET /items/:id` - Get item details
- `POST /items` - Create item
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item
- `GET /items/search` - Search items

### Claims
- `GET /claims` - List claims
- `GET /claims/:id` - Get claim details
- `POST /claims` - Submit claim
- `PUT /claims/:id` - Update claim status
- `DELETE /claims/:id` - Delete claim

### Admin
- `GET /admin/dashboard` - Admin dashboard data
- `GET /admin/users` - Manage users
- `GET /admin/organizations` - Manage organizations
- `GET /admin/reports` - Generate reports
- `GET /admin/logs` - System logs

## SDK and Libraries

### JavaScript/Node.js

```javascript
const LostFoundAPI = require('@public-sector/lost-found-api');

const client = new LostFoundAPI({
  baseURL: 'https://your-domain.com/api',
  token: 'your-jwt-token'
});

// Get items
const items = await client.items.list({
  category: 'electronics',
  limit: 20
});

// Create item
const newItem = await client.items.create({
  title: 'Lost Laptop',
  description: 'MacBook Pro 13-inch',
  category: 'electronics',
  type: 'lost'
});
```

### Python

```python
from lost_found_api import Client

client = Client(
    base_url='https://your-domain.com/api',
    token='your-jwt-token'
)

# Get items
items = client.items.list(category='electronics', limit=20)

# Create item
new_item = client.items.create({
    'title': 'Lost Laptop',
    'description': 'MacBook Pro 13-inch',
    'category': 'electronics',
    'type': 'lost'
})
```

## Testing

### Postman Collection

Import our Postman collection for easy API testing:

```json
{
  "info": {
    "name": "Public Sector Lost & Found API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  }
}
```

### cURL Examples

```bash
# Login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get items
curl -X GET https://your-domain.com/api/items \
  -H "Authorization: Bearer your-jwt-token"

# Create item
curl -X POST https://your-domain.com/api/items \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"title":"Lost Keys","type":"lost","category":"personal"}'
```

## Next Steps

- [Authentication Details](./auth.md)
- [Users API](./users.md)
- [Organizations API](./organizations.md)
- [Items API](./items.md)
- [Claims API](./claims.md)