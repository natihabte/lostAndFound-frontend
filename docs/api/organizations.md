# Organizations API

Complete API reference for organization management endpoints.

## Endpoints Overview

- `GET /api/organizations` - List all organizations
- `GET /api/organizations/:id` - Get organization details
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization
- `GET /api/organizations/:id/stats` - Get organization statistics
- `POST /api/organizations/:id/verify` - Verify organization (admin)

## List Organizations

Retrieve a paginated list of organizations.

```http
GET /api/organizations?page=1&limit=10&type=university&status=active
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `type` - Filter by type (university, government, hospital, etc.)
- `status` - Filter by status (pending, active, suspended)
- `search` - Search by name
- `sort` - Sort field (name, createdAt, type)
- `order` - Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "org_id",
      "name": "Example University",
      "type": "university",
      "status": "active",
      "logo": "https://example.com/logo.png",
      "description": "Leading educational institution",
      "contactEmail": "info@example.edu",
      "contactPhone": "+1234567890",
      "address": {
        "street": "123 University Ave",
        "city": "City Name",
        "state": "State",
        "country": "Country",
        "postalCode": "12345"
      },
      "stats": {
        "users": 1250,
        "items": 450,
        "claims": 120
      },
      "verified": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## Get Organization Details

Retrieve detailed information about a specific organization.

```http
GET /api/organizations/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "org_id",
    "name": "Example University",
    "type": "university",
    "status": "active",
    "logo": "https://example.com/logo.png",
    "description": "Leading educational institution",
    "website": "https://example.edu",
    "contactEmail": "info@example.edu",
    "contactPhone": "+1234567890",
    "address": {
      "street": "123 University Ave",
      "city": "City Name",
      "state": "State",
      "country": "Country",
      "postalCode": "12345"
    },
    "locations": [
      {
        "id": "loc_1",
        "name": "Main Campus",
        "address": "123 University Ave",
        "code": "MAIN"
      },
      {
        "id": "loc_2",
        "name": "Library",
        "address": "456 Library St",
        "code": "LIB"
      }
    ],
    "settings": {
      "autoApproveItems": false,
      "requireEmailVerification": true,
      "allowPublicSearch": true,
      "theme": {
        "primaryColor": "#3B82F6",
        "secondaryColor": "#10B981"
      }
    },
    "stats": {
      "users": 1250,
      "activeUsers": 850,
      "items": {
        "total": 450,
        "lost": 200,
        "found": 250,
        "claimed": 180
      },
      "claims": {
        "total": 120,
        "pending": 15,
        "approved": 90,
        "rejected": 15
      }
    },
    "verified": true,
    "verifiedAt": "2024-01-05T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

## Create Organization

Register a new organization (requires verification).

```http
POST /api/organizations
Content-Type: application/json

{
  "name": "New University",
  "type": "university",
  "description": "A new educational institution",
  "website": "https://newuniversity.edu",
  "contactEmail": "admin@newuniversity.edu",
  "contactPhone": "+1234567890",
  "address": {
    "street": "789 College Rd",
    "city": "City Name",
    "state": "State",
    "country": "Country",
    "postalCode": "54321"
  },
  "adminUser": {
    "name": "Admin Name",
    "email": "admin@newuniversity.edu",
    "phone": "+1234567890"
  },
  "documents": {
    "registrationCertificate": "url_to_document",
    "authorizationLetter": "url_to_document"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization registration submitted for review",
  "data": {
    "id": "org_id",
    "name": "New University",
    "status": "pending",
    "createdAt": "2024-01-16T00:00:00Z"
  }
}
```

## Update Organization

Update organization information (admin or org admin only).

```http
PUT /api/organizations/:id
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "Updated University Name",
  "description": "Updated description",
  "logo": "https://example.com/new-logo.png",
  "contactEmail": "newemail@example.edu",
  "settings": {
    "autoApproveItems": true,
    "theme": {
      "primaryColor": "#EF4444"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization updated successfully",
  "data": {
    "id": "org_id",
    "name": "Updated University Name",
    "updatedAt": "2024-01-16T00:00:00Z"
  }
}
```

## Delete Organization

Delete an organization (super admin only).

```http
DELETE /api/organizations/:id
Authorization: Bearer <super_admin_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Organization deleted successfully"
}
```

## Get Organization Statistics

Retrieve detailed statistics for an organization.

```http
GET /api/organizations/:id/stats?period=30d
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period` - Time period (7d, 30d, 90d, 1y, all)
- `startDate` - Custom start date (YYYY-MM-DD)
- `endDate` - Custom end date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "users": {
      "total": 1250,
      "new": 45,
      "active": 850,
      "verified": 1200
    },
    "items": {
      "total": 450,
      "lost": 200,
      "found": 250,
      "claimed": 180,
      "returned": 165,
      "byCategory": {
        "electronics": 120,
        "documents": 80,
        "personal": 150,
        "other": 100
      }
    },
    "claims": {
      "total": 120,
      "pending": 15,
      "approved": 90,
      "rejected": 15,
      "successRate": 75
    },
    "activity": {
      "itemsReported": [
        { "date": "2024-01-01", "count": 15 },
        { "date": "2024-01-02", "count": 18 }
      ],
      "claimsSubmitted": [
        { "date": "2024-01-01", "count": 4 },
        { "date": "2024-01-02", "count": 6 }
      ]
    },
    "topLocations": [
      { "name": "Main Campus", "items": 180 },
      { "name": "Library", "items": 120 }
    ]
  }
}
```

## Verify Organization

Verify a pending organization (super admin only).

```http
POST /api/organizations/:id/verify
Authorization: Bearer <super_admin_jwt_token>
Content-Type: application/json

{
  "approved": true,
  "notes": "All documents verified"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization verified successfully",
  "data": {
    "id": "org_id",
    "status": "active",
    "verified": true,
    "verifiedAt": "2024-01-16T00:00:00Z"
  }
}
```

## Organization Types

Supported organization types:

- `university` - Educational institutions
- `government` - Government agencies
- `hospital` - Healthcare facilities
- `corporate` - Corporate offices
- `public_facility` - Public buildings
- `transportation` - Transit authorities
- `other` - Other organizations

## Organization Status

Possible status values:

- `pending` - Awaiting verification
- `active` - Verified and operational
- `suspended` - Temporarily suspended
- `inactive` - Deactivated

## Error Responses

### Organization Not Found
```json
{
  "success": false,
  "error": "Organization not found",
  "code": "ORG_NOT_FOUND"
}
```

### Unauthorized
```json
{
  "success": false,
  "error": "Insufficient permissions",
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
    "name": "Organization name is required",
    "contactEmail": "Invalid email format"
  }
}
```

This API reference provides complete documentation for organization management endpoints.