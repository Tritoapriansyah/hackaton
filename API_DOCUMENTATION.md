# Hackaton API Documentation

Complete API documentation for the Hackaton application.

## Base URL

- **Development**: `http://localhost:3333`
- **Production**: `https://api.hackaton.com`

## Interactive Documentation

Access the interactive Swagger UI documentation at:

- **Swagger UI**: `http://localhost:3333/api-docs`
- **OpenAPI Spec (JSON)**: `http://localhost:3333/api-docs.json`
- **OpenAPI Spec (YAML)**: `./openapi.yaml`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-token>
```

Obtain a token by logging in via the `/api/auth/login` endpoint.

---

## 📋 Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Products](#products-endpoints)
3. [Logs](#logs-endpoints)
4. [Transactions](#transactions-endpoints)
5. [Dashboard](#dashboard-endpoints)
6. [Ranking](#ranking-endpoints)

---

## 🔐 Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123!"
}
```

**Response** (201):

```json
{
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### Login

Authenticate and receive an access token.

**Endpoint**: `POST /api/auth/login`

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 📦 Products Endpoints

### Get All Products

Retrieve a paginated list of products with optional search.

**Endpoint**: `GET /api/products`

**Auth**: Required

**Query Parameters**:

- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 10) - Items per page
- `search` or `q` (string) - Search term

**Example Request**:

```bash
GET /api/products?page=1&limit=10&search=laptop
```

**Response** (200):

```json
{
  "meta": {
    "total": 50,
    "perPage": 10,
    "currentPage": 1,
    "lastPage": 5
  },
  "data": [
    {
      "id": 1,
      "name": "Gaming Laptop",
      "price": 1500.0,
      "description": "High-performance gaming laptop",
      "stock": 25,
      "image": "laptop.jpg",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### Get Product by ID

Retrieve a specific product.

**Endpoint**: `GET /api/products/:id`

**Auth**: Required

**Response** (200):

```json
{
  "id": 1,
  "name": "Gaming Laptop",
  "price": 1500.0,
  "description": "High-performance gaming laptop",
  "stock": 25,
  "image": "laptop.jpg",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Create Product

Add a new product to inventory.

**Endpoint**: `POST /api/products`

**Auth**: Required

**Request Body**:

```json
{
  "name": "Gaming Laptop",
  "price": 1500.0,
  "description": "High-performance gaming laptop",
  "stock": 25,
  "image": "laptop.jpg"
}
```

**Response** (201):

```json
{
  "id": 1,
  "name": "Gaming Laptop",
  "price": 1500.0,
  "description": "High-performance gaming laptop",
  "stock": 25,
  "image": "laptop.jpg",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Update Product

Update an existing product.

**Endpoint**: `PUT /api/products/:id`

**Auth**: Required

**Request Body**:

```json
{
  "name": "Gaming Laptop Pro",
  "price": 1800.0,
  "description": "Updated description",
  "stock": 30,
  "image": "laptop-pro.jpg"
}
```

**Note**: If stock is changed, a log entry will be automatically created.

### Update Product Stock

Update only the stock quantity (creates a log entry).

**Endpoint**: `PATCH /api/products/:id/stock`

**Auth**: Required

**Request Body**:

```json
{
  "stock": 50
}
```

**Response** (200):

```json
{
  "id": 1,
  "name": "Gaming Laptop",
  "price": 1500.0,
  "stock": 50,
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### Delete Product

Remove a product from inventory.

**Endpoint**: `DELETE /api/products/:id`

**Auth**: Required

**Response** (204): No content

### Import Products (CSV)

Bulk import products from a CSV file.

**Endpoint**: `POST /api/products/import`

**Auth**: Required

**Content-Type**: `multipart/form-data`

**Request Body**:

- `file` (file) - CSV file

**CSV Format**:

```csv
name,price,stock,description
"Product 1",100,50,"Description 1"
"Product 2",200,30,"Description 2"
```

**Response** (201):

```json
{
  "message": "Successfully imported 2 products"
}
```

### Export Products (CSV)

Export all products to CSV format.

**Endpoint**: `GET /api/products/export`

**Auth**: Required

**Response** (200): CSV file download

---

## 📊 Logs Endpoints

The logging system tracks all stock changes and system events.

### Get All Logs

Retrieve logs with filtering options.

**Endpoint**: `GET /api/logs`

**Auth**: Required

**Query Parameters**:

- `page` (integer, default: 1)
- `limit` (integer, default: 20)
- `type` (enum: info, error, warning, success)
- `action` (string) - Filter by action type
- `product_id` (integer) - Filter by product
- `user_id` (integer) - Filter by user
- `start_date` (datetime) - Filter from date
- `end_date` (datetime) - Filter to date

**Example Request**:

```bash
GET /api/logs?type=info&action=stock_increase&page=1&limit=20
```

**Response** (200):

```json
{
  "meta": {
    "total": 100,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 5
  },
  "data": [
    {
      "id": 1,
      "message": "Stock stock increase for \"Gaming Laptop\" from 25 to 50 (+25)",
      "type": "info",
      "action": "stock_increase",
      "productId": 1,
      "userId": 1,
      "oldStock": 25,
      "newStock": 50,
      "metadata": null,
      "product": {
        "id": 1,
        "name": "Gaming Laptop",
        "price": 1500.0
      },
      "user": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T12:00:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

### Get Recent Logs

Get the most recent log entries.

**Endpoint**: `GET /api/logs/recent`

**Auth**: Required

**Query Parameters**:

- `limit` (integer, default: 10)

**Response** (200):

```json
[
  {
    "id": 1,
    "message": "Stock updated",
    "type": "info",
    "action": "stock_increase",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
]
```

### Get Product Logs

Get all logs for a specific product.

**Endpoint**: `GET /api/products/:id/logs`

**Auth**: Required

**Query Parameters**:

- `page` (integer, default: 1)
- `limit` (integer, default: 20)

### Get Stock History

Get stock change history for a product.

**Endpoint**: `GET /api/products/:id/stock-history`

**Auth**: Required

**Query Parameters**:

- `page` (integer, default: 1)
- `limit` (integer, default: 20)

**Response** (200):

```json
{
  "meta": {
    "total": 10,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 1
  },
  "data": [
    {
      "id": 5,
      "message": "Stock stock decrease for \"Gaming Laptop\" from 50 to 45 (-5)",
      "type": "info",
      "action": "stock_decrease",
      "productId": 1,
      "userId": 2,
      "oldStock": 50,
      "newStock": 45,
      "user": {
        "id": 2,
        "fullName": "Admin User"
      },
      "createdAt": "2024-01-15T14:00:00.000Z"
    },
    {
      "id": 1,
      "message": "Stock stock increase for \"Gaming Laptop\" from 25 to 50 (+25)",
      "type": "info",
      "action": "stock_increase",
      "productId": 1,
      "userId": 1,
      "oldStock": 25,
      "newStock": 50,
      "user": {
        "id": 1,
        "fullName": "John Doe"
      },
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

### Cleanup Old Logs

Delete logs older than specified days.

**Endpoint**: `POST /api/logs/cleanup`

**Auth**: Required

**Request Body**:

```json
{
  "days": 90
}
```

**Response** (200):

```json
{
  "message": "Successfully deleted 150 old logs",
  "deleted": 150
}
```

---

## 💳 Transactions Endpoints

### Get My Transactions

Get transactions for the authenticated user.

**Endpoint**: `GET /api/transactions/my-transactions`

**Auth**: Required

**Response** (200):

```json
[
  {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "product": "Gaming Laptop",
    "name": "John Doe",
    "quantity": 1,
    "total": 1500.0,
    "status": "success",
    "paymentMethod": "credit_card",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

### Get Transaction by ID

**Endpoint**: `GET /api/transactions/transaction/:transactionId`

**Auth**: Required

### Get Transaction Statistics

**Endpoint**: `GET /api/transactions/statistics`

**Auth**: Required

### Get Transactions by Status

**Endpoint**: `GET /api/transactions/status/:status`

**Auth**: Required

**Parameters**:

- `status` (enum: pending, success, failed)

### Get Payment Method Distribution

**Endpoint**: `GET /api/transactions/method-distribution`

**Auth**: Required

---

## 📈 Dashboard Endpoints

All dashboard endpoints require authentication.

### Get Dashboard Overview

**Endpoint**: `GET /api/dashboard/overview`

Get comprehensive dashboard data.

### Get General Statistics

**Endpoint**: `GET /api/dashboard/stats`

### Get Stock Distribution

**Endpoint**: `GET /api/dashboard/stock-distribution`

### Get Revenue Time Series

**Endpoint**: `GET /api/dashboard/revenue-timeseries`

### Get Transaction Time Series

**Endpoint**: `GET /api/dashboard/transaction-timeseries`

### Get Transaction Status Distribution

**Endpoint**: `GET /api/dashboard/transaction-status`

### Get Payment Methods Distribution

**Endpoint**: `GET /api/dashboard/payment-methods`

### Get Top Selling Products

**Endpoint**: `GET /api/dashboard/top-selling-products`

### Get Revenue by Product

**Endpoint**: `GET /api/dashboard/revenue-by-product`

### Get Top Products

**Endpoint**: `GET /api/dashboard/top-products`

### Get Role Distribution

**Endpoint**: `GET /api/dashboard/role-distribution`

### Get Low Stock Alerts

**Endpoint**: `GET /api/dashboard/low-stock-alerts`

Returns products with low stock levels.

---

## 👥 Ranking Endpoints

### Get Current User Role

**Endpoint**: `GET /api/ranking/current`

**Auth**: Required

**Response** (200):

```json
{
  "role": "admin"
}
```

### Get Role Statistics

**Endpoint**: `GET /api/ranking/statistics`

**Auth**: Required

---

## 📝 Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Validation failed",
  "errors": {
    "field": ["Error message"]
  }
}
```

### 401 Unauthorized

```json
{
  "message": "Unauthorized access"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 422 Unprocessable Entity

```json
{
  "message": "Failed to process request",
  "error": "Detailed error message"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

---

## 🔧 Testing with cURL

### Register and Login

```bash
# Register
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Products

```bash
curl -X GET http://localhost:3333/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Stock

```bash
curl -X PATCH http://localhost:3333/api/products/1/stock \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stock": 50}'
```

### View Stock History

```bash
curl -X GET http://localhost:3333/api/products/1/stock-history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Additional Resources

- **Swagger UI**: Visit `/api-docs` for interactive API testing
- **OpenAPI Spec**: Download the complete spec from `/api-docs.json`
- **Source Code**: Check the repository for implementation details

## 🎯 Stock Logging System

The stock logging system automatically tracks:

- **Stock increases**: When stock quantity goes up
- **Stock decreases**: When stock quantity goes down
- **User tracking**: Who made the change
- **Timestamp**: When the change occurred
- **History**: Complete audit trail of all changes

Every time you update product stock (via `PATCH /api/products/:id/stock` or `PUT /api/products/:id`), a log entry is automatically created with:

- Old stock value
- New stock value
- User who made the change
- Timestamp
- Product information

Access this data via:

- `/api/logs` - All logs with filtering
- `/api/products/:id/logs` - All logs for a product
- `/api/products/:id/stock-history` - Stock changes only

---

## 📞 Support

For issues or questions, please contact the development team or create an issue in the repository.
