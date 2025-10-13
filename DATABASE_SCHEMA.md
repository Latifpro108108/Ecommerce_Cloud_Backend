# GoMart E-commerce Platform - Database Schema Documentation

## Overview
GoMart is a Ghana-focused e-commerce platform built with Next.js, Prisma, and MongoDB. This document outlines the corrected and optimized database schema, entity relationships, and folder structure.

## 🔧 Schema Corrections Made

### Critical Issues Fixed:
1. **Payment-Order Relationship**: Fixed 1:1 relationship conflict (was `Order[]`, now `Order`)
2. **Shipping-Order Relationship**: Fixed 1:1 relationship conflict (was `Order[]`, now `Order`)
3. **Added Cascade Deletes**: Proper cleanup when parent records are deleted
4. **Performance Indexes**: Added strategic indexes for frequent queries
5. **Unique Constraints**: Prevented duplicate cart items and ensured data integrity

---

## 📊 Entity Relationship Diagram (Corrected)

```
Customer (1) ←→ (N) Order ←→ (1) Payment
    ↓                ↓           
   (1)              (N)          
    ↓                ↓           
   Cart ←→ (N) CartItem    OrderItem ←→ (N) Product
                                              ↓
                                             (N)
                                              ↓
                                           Category
                                              ↑
                                             (N)
                                              ↑
                                           Vendor

Order (1) ←→ (1) Shipping ←→ (N) Courier
Customer (1) ←→ (N) Review ←→ (N) Product
```

---

## 🗃️ Database Entities

### 1. **Customer** 👤
**Purpose**: User account management with Ghana-specific localization

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique customer identifier |
| firstName | String | Required | Customer's first name |
| lastName | String | Required | Customer's last name |
| email | String | Unique, Required | Email address for login |
| phoneNumber | String | Unique, Required | Ghana phone number |
| password | String | Required | Hashed password |
| region | String | Required | Ghana region (Greater Accra, Ashanti, etc.) |
| city | String | Required | City within region |
| address | String | Required | Full address |
| dateJoined | DateTime | Auto-generated | Account creation date |
| isActive | Boolean | Default: true | Account status |

**Relationships**:
- One-to-Many with `Order` (customer can have multiple orders)
- One-to-Many with `Review` (customer can write multiple reviews)
- One-to-One with `Cart` (each customer has one active cart)

---

### 2. **Category** 📂
**Purpose**: Product categorization system

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique category identifier |
| categoryName | String | Unique, Required | Category display name |
| description | String | Optional | Category description |

**Relationships**:
- One-to-Many with `Product` (category can have multiple products)

---

### 3. **Vendor** 🏪
**Purpose**: Seller/merchant management

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique vendor identifier |
| vendorName | String | Required | Business/vendor name |
| email | String | Unique, Required | Vendor contact email |
| phoneNumber | String | Required | Vendor phone number |
| businessAddress | String | Required | Physical business address |
| region | String | Required | Ghana region |
| city | String | Required | City location |
| joinedDate | DateTime | Auto-generated | Vendor registration date |
| isVerified | Boolean | Default: false | Verification status |

**Relationships**:
- One-to-Many with `Product` (vendor can list multiple products)

---

### 4. **Product** 📦
**Purpose**: Main product catalog with Ghana Cedi pricing

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique product identifier |
| productName | String | Required | Product display name |
| description | String | Required | Product description |
| price | Float | Required | Price in Ghana Cedi (GHS) |
| stockQuantity | Int | Required | Available inventory |
| imageURL | String | Optional | Product image URL |
| createdAt | DateTime | Auto-generated | Product creation date |
| categoryId | String | FK, Required | Reference to Category |
| vendorId | String | FK, Required | Reference to Vendor |

**Indexes**: categoryId, vendorId, price, createdAt (for performance)

**Relationships**:
- Many-to-One with `Category`
- Many-to-One with `Vendor`
- One-to-Many with `OrderItem`
- One-to-Many with `Review`
- One-to-Many with `CartItem`

---

### 5. **Courier** 🚚
**Purpose**: Delivery service providers (Ghana Post, DHL, Bolt, etc.)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique courier identifier |
| courierName | String | Required | Courier company name |
| phoneNumber | String | Required | Contact number |
| email | String | Optional | Contact email |
| region | String | Required | Service coverage area |
| isActive | Boolean | Default: true | Service availability |

**Relationships**:
- One-to-Many with `Shipping` (courier can handle multiple deliveries)

---

### 6. **Order** 🛒
**Purpose**: Customer purchase transactions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique order identifier |
| orderDate | DateTime | Auto-generated | Order creation timestamp |
| status | String | Default: "pending" | Order status (pending, confirmed, shipped, delivered, cancelled) |
| totalAmount | Float | Required | Total order value in GHS |
| customerId | String | FK, Required | Reference to Customer |

**Indexes**: customerId, status, orderDate (for performance)

**Relationships**:
- Many-to-One with `Customer`
- One-to-One with `Payment` (each order has one payment)
- One-to-One with `Shipping` (each order has one shipping record)
- One-to-Many with `OrderItem` (order contains multiple products)

---

### 7. **OrderItem** 📋
**Purpose**: Individual products within an order

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique order item identifier |
| quantity | Int | Required | Number of items ordered |
| unitPrice | Float | Required | Price per item at time of order (GHS) |
| subtotal | Float | Required | quantity × unitPrice |
| orderId | String | FK, Required | Reference to Order |
| productId | String | FK, Required | Reference to Product |

**Relationships**:
- Many-to-One with `Order`
- Many-to-One with `Product`

---

### 8. **Payment** 💳
**Purpose**: Payment processing with Mobile Money support

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique payment identifier |
| paymentDate | DateTime | Auto-generated | Payment timestamp |
| amount | Float | Required | Payment amount in GHS |
| paymentMethod | String | Required | MTN Mobile Money, Vodafone Cash, AirtelTigo Money, Bank Transfer, Cash |
| transactionReference | String | Optional | Mobile Money transaction ID |
| status | String | Default: "pending" | Payment status (pending, completed, failed, refunded) |
| orderId | String | FK, Unique | Reference to Order |

**Relationships**:
- One-to-One with `Order` (each payment belongs to one order)

---

### 9. **Shipping** 📦
**Purpose**: Order delivery management

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique shipping identifier |
| shippingAddress | String | Required | Delivery address |
| city | String | Required | Delivery city |
| region | String | Required | Ghana region |
| postalCode | String | Optional | Ghana postal code |
| shippingDate | DateTime | Optional | Dispatch date |
| deliveryDate | DateTime | Optional | Actual delivery date |
| status | String | Default: "pending" | Shipping status (pending, shipped, in_transit, delivered, failed) |
| orderId | String | FK, Unique | Reference to Order |
| courierId | String | FK, Required | Reference to Courier |

**Relationships**:
- One-to-One with `Order`
- Many-to-One with `Courier`

---

### 10. **Review** ⭐
**Purpose**: Product reviews and ratings system

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique review identifier |
| rating | Int | Required | 1-5 star rating |
| comment | String | Optional | Review text |
| createdAt | DateTime | Auto-generated | Review creation date |
| customerId | String | FK, Required | Reference to Customer |
| productId | String | FK, Required | Reference to Product |

**Indexes**: customerId, productId, rating (for performance)

**Relationships**:
- Many-to-One with `Customer` (with cascade delete)
- Many-to-One with `Product` (with cascade delete)

---

### 11. **Cart** 🛒
**Purpose**: Shopping cart management

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique cart identifier |
| createdAt | DateTime | Auto-generated | Cart creation date |
| customerId | String | FK, Unique | Reference to Customer |

**Relationships**:
- One-to-One with `Customer` (with cascade delete)
- One-to-Many with `CartItem`

---

### 12. **CartItem** 🛍️
**Purpose**: Items in shopping cart

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, ObjectId | Unique cart item identifier |
| quantity | Int | Required | Number of items in cart |
| cartId | String | FK, Required | Reference to Cart |
| productId | String | FK, Required | Reference to Product |

**Unique Constraint**: [cartId, productId] (prevents duplicate products in same cart)
**Indexes**: cartId, productId (for performance)

**Relationships**:
- Many-to-One with `Cart` (with cascade delete)
- Many-to-One with `Product` (with cascade delete)

---

## 🏗️ Folder Structure

```
gomart/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── app/
│   │   └── api/               # Next.js API Routes (TypeScript)
│   │       ├── customers/
│   │       │   ├── route.ts   # GET, POST /api/customers
│   │       │   └── [id]/
│   │       │       └── route.ts # GET, PUT, DELETE /api/customers/[id]
│   │       ├── products/
│   │       │   ├── route.ts   # GET, POST /api/products
│   │       │   └── [id]/
│   │       │       └── route.ts # GET, PUT, DELETE /api/products/[id]
│   │       ├── categories/
│   │       │   ├── route.ts   # GET, POST /api/categories
│   │       │   └── [id]/
│   │       │       └── route.ts # GET, PUT, DELETE /api/categories/[id]
│   │       ├── vendors/
│   │       │   ├── route.ts   # GET, POST /api/vendors
│   │       │   └── [id]/
│   │       │       └── route.ts # GET, PUT, DELETE /api/vendors/[id]
│   │       ├── orders/
│   │       │   ├── route.ts   # GET, POST /api/orders
│   │       │   └── [id]/
│   │       │       └── route.ts # GET, PUT, DELETE /api/orders/[id]
│   │       ├── payments/
│   │       │   ├── route.ts   # GET, POST /api/payments
│   │       │   └── [id]/
│   │       │       └── route.ts # GET, PUT, DELETE /api/payments/[id]
│   │       ├── shipping/
│   │       │   ├── route.ts   # GET, POST /api/shipping
│   │       │   └── [id]/
│   │       │       └── route.ts # GET, PUT, DELETE /api/shipping/[id]
│   │       ├── reviews/
│   │       │   ├── route.ts   # GET, POST /api/reviews
│   │       │   └── [id]/
│   │       │       └── route.ts # GET, PUT, DELETE /api/reviews/[id]
│   │       ├── cart/
│   │       │   ├── route.ts   # GET, POST /api/cart
│   │       │   └── [id]/
│   │       │       └── route.ts # GET, PUT, DELETE /api/cart/[id]
│   │       └── couriers/
│   │           ├── route.ts   # GET, POST /api/couriers
│   │           └── [id]/
│   │               └── route.ts # GET, PUT, DELETE /api/couriers/[id]
│   └── pages/
│       ├── _app.js            # Next.js app wrapper
│       └── index.js           # Homepage
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── next.config.js             # Next.js configuration
├── README.md                  # Project documentation
├── DEVELOPMENT.md             # Development workflow
└── DATABASE_SCHEMA.md         # This file
```

---

## 🔄 Key Relationships Explained

### 1. **Customer-Centric Relationships**
- **Customer → Orders**: One customer can place multiple orders
- **Customer → Cart**: Each customer has exactly one active shopping cart
- **Customer → Reviews**: Customers can write multiple product reviews

### 2. **Product Catalog Relationships**
- **Category → Products**: One category contains multiple products
- **Vendor → Products**: One vendor can list multiple products
- **Product → OrderItems**: Products can appear in multiple orders
- **Product → CartItems**: Products can be in multiple shopping carts
- **Product → Reviews**: Products can have multiple customer reviews

### 3. **Order Processing Relationships**
- **Order → OrderItems**: One order contains multiple products
- **Order → Payment**: Each order has exactly one payment record
- **Order → Shipping**: Each order has exactly one shipping record

### 4. **Delivery System Relationships**
- **Courier → Shipping**: One courier handles multiple deliveries
- **Shipping → Order**: Each shipping record belongs to one order

---

## 🚀 Ghana-Specific Features

### **Payment Methods**
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money
- Bank Transfer
- Cash on Delivery

### **Regional Coverage**
- Greater Accra Region
- Ashanti Region
- Western Region
- Eastern Region
- Northern Region
- Upper East Region
- Upper West Region
- Central Region
- Volta Region
- Brong-Ahafo Region

### **Local Couriers**
- Ghana Post
- DHL Ghana
- Bolt Delivery
- Jumia Logistics
- Local courier services

### **Currency**
- All prices stored in Ghana Cedi (GHS)
- Float data type for precise decimal handling

---

## 🔧 Performance Optimizations

### **Strategic Indexes**
1. **Product Indexes**: categoryId, vendorId, price, createdAt
2. **Order Indexes**: customerId, status, orderDate
3. **Review Indexes**: customerId, productId, rating
4. **Cart Indexes**: cartId, productId

### **Data Integrity**
1. **Unique Constraints**: Prevent duplicate cart items
2. **Cascade Deletes**: Automatic cleanup of related records
3. **Foreign Key Relationships**: Maintain referential integrity

### **Query Optimization**
- Indexed fields for common search patterns
- Efficient relationship traversal
- Optimized for e-commerce query patterns

---

## 🛡️ Security Considerations

1. **Password Hashing**: Customer passwords should be hashed using bcrypt
2. **Input Validation**: All API endpoints should validate input data
3. **Authentication**: JWT tokens for session management
4. **Authorization**: Role-based access control for vendors vs customers
5. **Rate Limiting**: Prevent API abuse and spam

---

## 📈 Future Enhancements

### **Planned Features**
1. **AI Recommendations**: Product suggestion system
2. **Voice Search**: Speech-to-text product search
3. **AR/3D Preview**: Augmented reality product viewing
4. **Gamification**: Points and rewards system
5. **Multi-language**: Support for local Ghanaian languages

### **Additional Entities (Future)**
1. **Wishlist**: Customer product wishlists
2. **Promotions**: Discount and coupon system
3. **Notifications**: Push notification system
4. **Analytics**: User behavior tracking
5. **Inventory**: Advanced stock management

---

## ✅ Schema Validation Checklist

- [x] All relationships properly defined
- [x] Cascade deletes implemented
- [x] Performance indexes added
- [x] Unique constraints enforced
- [x] Ghana-specific fields included
- [x] Mobile Money payment support
- [x] Regional addressing system
- [x] Local courier integration
- [x] GHS currency support
- [x] Data integrity maintained

---

## 🚀 Next Steps

1. **Regenerate Prisma Client**: Run `npx prisma generate`
2. **Push Schema**: Run `npx prisma db push`
3. **Test API Endpoints**: Verify all CRUD operations
4. **Seed Database**: Add sample data for testing
5. **Frontend Integration**: Connect UI to API endpoints

This schema provides a solid foundation for a comprehensive Ghana-focused e-commerce platform with proper relationships, performance optimizations, and local market considerations.
