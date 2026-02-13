# Claims API

Complete API reference for claim management.

## Endpoints Overview

- `GET /api/claims` - List claims
- `GET /api/claims/:id` - Get claim details
- `POST /api/claims` - Submit claim
- `PUT /api/claims/:id` - Update claim status
- `DELETE /api/claims/:id` - Cancel claim

## List Claims

```http
GET /api/claims?status=pending&item=item_id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "claim_id",
      "item": {
        "id": "item_id",
        "title": "iPhone 13 Pro",
        "type": "found"
      },
      "claimant": {
        "id": "user_id",
        "name": "John Doe"
      },
      "status": "pending",
      "description": "This is my phone, I can prove ownership",
      "proofDocuments": ["url1", "url2"],
      "createdAt": "2024-01-16T00:00:00Z"
    }
  ]
}
```

## Submit Claim

```http
POST /api/claims
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "itemId": "item_id",
  "description": "Detailed description proving ownership",
  "proofDocuments": ["document_url"],
  "contactMethod": "email"
}
```

## Update Claim Status

```http
PUT /api/claims/:id
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "status": "approved",
  "notes": "Ownership verified"
}
```

This API manages the complete claims workflow.