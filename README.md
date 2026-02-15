# Product & Buyer Management System

A web application for managing products and buyers with add and delete functionality.

## Features

### Products Management
- Add new products with name, category, price, quantity, and description
- View all products in a table format
- Delete products with confirmation dialog
- Form validation for required fields and data types

### Buyers Management
- Add new buyers with name, email, phone, and address
- View all buyers in a table format
- Delete buyers with confirmation dialog
- Email validation and duplicate email prevention

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite3
- **Frontend**: HTML, CSS, EJS templating
- **Styling**: Custom CSS with responsive design

## Prerequisites

- Node.js (version 14 or higher) - Download from [nodejs.org](https://nodejs.org/)
- npm (comes with Node.js)

## Installation

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Clone or download the project files
3. Navigate to the project directory
4. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. For development (with auto-restart):
   ```bash
   npm run dev
   ```

3. Open your browser and go to `http://localhost:3000`

## Project Structure

```
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── database.db        # SQLite database (created automatically)
├── views/             # EJS templates
│   ├── index.ejs
│   ├── products.ejs
│   ├── add-product.ejs
│   ├── buyers.ejs
│   └── add-buyer.ejs
└── public/            # Static files
    └── styles.css
```

## API Endpoints

### Products
- `GET /products` - View all products
- `GET /products/add` - Show add product form
- `POST /products/add` - Add new product
- `POST /products/delete/:id` - Delete product by ID

### Buyers
- `GET /buyers` - View all buyers
- `GET /buyers/add` - Show add buyer form
- `POST /buyers/add` - Add new buyer
- `POST /buyers/delete/:id` - Delete buyer by ID

## Database Schema

### Products Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    description TEXT
);
```

### Buyers Table
```sql
CREATE TABLE buyers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    address TEXT
);
```

## Validation

- **Products**: Name, category, price (>0), quantity (≥0) are required
- **Buyers**: Name, email (valid format), phone are required
- Email uniqueness is enforced for buyers

## Security Considerations

- Basic input validation implemented
- SQL injection prevention using parameterized queries
- Confirmation dialogs for delete operations

## Future Enhancements

- User authentication and authorization
- Product search and filtering
- Bulk operations
- Data export functionality
- Soft delete with recovery option
- Audit logging
