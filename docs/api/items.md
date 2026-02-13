# Items API

Complete API reference for lost and found item management.

## Endpoints Overview

- `GET /api/items` - List items
- `GET /api/items/:id` - Get item details
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/search` - Search items
- `POST /api/items/:id/claim` - Submit claim

## List Items

```http
GET /api/items?type=lost&category=electronics&status=active
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `type` - Item type (lost, found)
- `category` - Category filter
- `status` - Status (active, claimed, returned)
- `organization` - Organization ID
- `location` - Location filter
- `dateFrom` - Start date
- `dateTo` - End date
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "item_id",
      "type": "lost",
      "title": "iPhone 13 Pro",
      "description": "Black iPhone with cracked screen",
      "category": "electronics",
      "status": "active",
      "images": ["url1", "url2"],
      "location": "Main Library",
      "dateLost": "2024-01-15T00:00:00Z",
      "organization": {
        "id": "org_id",
        "name": "Example University"
      },
      "postedBy": {
        "id": "user_id",
        "name": "John Doe"
      },
      "createdAt": "2024-01-15T10:00:00Z"
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

## Get Item Details

```http
GET /api/items/:id
Authorization: Bearer <jwt_token>
```

## Create Item

```http
POST /api/items
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "type": "lost",
  "title": "Lost Wallet",
  "description": "Brown leather wallet",
  "category": "personal",
  "location": "Student Center",
  "dateLost": "2024-01-15",
  "images": ["image_url"],
  "contactPreference": "email"
}
```

## Search Items

```http
GET /api/items/search?q=iphone&category=electronics
Authorization: Bearer <jwt_token>
```

This API provides comprehensive item management functionality.