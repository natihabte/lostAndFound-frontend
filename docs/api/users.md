# Users API

Complete API reference for user management endpoints.

## Endpoints Overview

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - List users (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Get Current User Profile

Retrieve the authenticated user's profile information.

```http
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "organization": {
      "id": "org_id",
      "name": "Organization Name",
      "type": "university"
    },
    "verified": true,
    "avatar": "https://example.com/avatar.jpg",
    "preferences": {
      "language": "en",
      "notifications": {
        "email": true,
        "sms": false
      }
    },
    "stats": {
      "itemsReported": 5,
      "itemsClaimed": 2,
      "itemsReturned": 1
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

## Update User Profile

Update the authenticated user's profile information.

```http
PUT /api/users/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Updated Doe",
  "phone": "+1234567891",
  "avatar": "https://example.com/new-avatar.jpg",
  "preferences": {
    "language": "am",
    "notifications": {
      "email": true,
      "sms": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "name": "John Updated Doe",
    "phone": "+1234567891",
    "avatar": "https://example.com/new-avatar.jpg",
    "updatedAt": "2024-01-16T00:00:00Z"
  }
}
```

## Get User by ID

Retrieve public profile information for a specific user.

```http
GET /api/users/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "organization": {
      "id": "org_id",
      "name": "Organization Name"
    },
    "stats": {
      "itemsReported": 5,
      "itemsReturned": 1
    },
    "memberSince": "2024-01-01T00:00:00Z"
  }
}
```

## List Users (Admin Only)

Retrieve a paginated list of users.

```http
GET /api/users?page=1&limit=10&role=user&organization=org_id&search=john
Authorization: Bearer <admin_jwt_token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `role` - Filter by role (user, org_admin, hall_admin, super_admin)
- `organization` - Filter by organization ID
- `search` - Search by name or email
- `verified` - Filter by verification status (true/false)
- `sort` - Sort field (createdAt, name, email)
- `order` - Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_id_1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "organization": {
        "id": "org_id",
        "name": "Organization Name"
      },
      "verified": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Update User (Admin Only)

Update any user's information (admin only).

```http
PUT /api/users/:id
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "hall_admin",
  "verified": true,
  "organization": "new_org_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "user_id",
    "name": "Updated Name",
    "role": "hall_admin",
    "verified": true,
    "updatedAt": "2024-01-16T00:00:00Z"
  }
}
```

## Delete User (Admin Only)

Delete a user account (admin only).

```http
DELETE /api/users/:id
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## User Statistics

Get detailed statistics for a user.

```http
GET /api/users/:id/stats
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": {
      "lost": 3,
      "found": 2,
      "total": 5
    },
    "claims": {
      "submitted": 4,
      "approved": 2,
      "pending": 1,
      "rejected": 1
    },
    "returns": {
      "successful": 2,
      "pending": 1
    },
    "activity": {
      "lastLogin": "2024-01-16T00:00:00Z",
      "lastItemReported": "2024-01-15T00:00:00Z",
      "lastClaimSubmitted": "2024-01-14T00:00:00Z"
    }
  }
}
```

## Error Responses

### User Not Found
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

### Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized access",
  "code": "UNAUTHORIZED"
}
```

### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format",
    "phone": "Phone number is required"
  }
}
```

This API reference provides complete documentation for user management endpoints.