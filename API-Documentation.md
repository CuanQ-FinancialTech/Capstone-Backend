# 📊 Capstone Money Management API Documentation

**Base URL:** `http://31.97.187.175:3000`

---

## 🔐 Auth

### 1. Register
- **Endpoint:** `/auth/register`  
- **Method:** `POST`  
- **Headers:** None  
- **Body:**
```json
{
  "username": "user 1",
  "email": "Budigaming1@gmail.com",
  "password": "12345678"
}
```
- **Response:**
```json
{
  "error": false,
  "message": "Register berhasil"
}
```

### 2. Login
- **Endpoint:** `/auth/login`  
- **Method:** `POST`  
- **Headers:** None  
- **Body:**
```json
{
  "email": "Budigaming1@gmail.com",
  "password": "12345678"
}
```
- **Response:**
```json
{
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "email": "Budigaming1@gmail.com",
      "username": "user 1",
      "access_token": "JWT_TOKEN_HERE"
    }
  }
}
```

---

## 💸 Transactions

### 3. Get Transaction History
- **Endpoint:** `/transactions`  
- **Method:** `GET`  
- **Headers:**  
  `Authorization: Bearer <access_token>`  
- **Response:**
```json
[
  {
    "transaction_id": 10,
    "amount": "10000.00",
    "description": "Beli teh botol Rp 10.000",
    "type": "expense",
    "created_at": "2025-06-03T08:00:00.000Z",
    "category": "FOOD & BEVERAGE"
  },
  {
    "transaction_id": 18,
    "amount": "500000.00",
    "description": "Pendapatan lepas Rp 500.000",
    "type": "income",
    "created_at": "2025-06-01T08:00:00.000Z",
    "category": "INCOME"
  }
]
```

### 4. Input Transaction via NLP
- **Endpoint:** `/transactions/input`  
- **Method:** `POST`  
- **Headers:**  
  `Authorization: Bearer <access_token>`  
- **Body:**
```json
{
  "text": "Gajian Rp 150000"
}
```
- **Response:**
```json
{
  "message": "Transaksi berhasil diproses",
  "data": {
    "transaction": {
      "transaction_id": 28,
      "account_id": 1,
      "amount": 150000,
      "description": "Gajian Rp 150.000",
      "type": "income",
      "category_id": 6
    },
    "newBalance": 30720000,
    "previousBalance": 30570000,
    "category": "Income",
    "type": "income",
    "description": "Gajian Rp 150.000",
    "amount": 150000
  }
}
```

### 5. Predict Transactions (Forecast)
- **Endpoint:** `/transactions/prediction`  
- **Method:** `POST`  
- **Headers:**  
  `Authorization: Bearer <access_token>`  
- **Body:**
```json
{
  "periods": 7
}
```
- **Response:**
```json
{
    "forecast": [
        {
            "ds": "2025-06-13T00:00:00",
            "yhat_income": 159451.64446343275,
            "yhat_expense": 0
        },
        {
            "ds": "2025-06-14T00:00:00",
            "yhat_income": 181184.08891966927,
            "yhat_expense": 0
        },
        {
            "ds": "2025-06-15T00:00:00",
            "yhat_income": 202916.5333759058,
            "yhat_expense": 0
        },
        {
            "ds": "2025-06-16T00:00:00",
            "yhat_income": 224648.97783214232,
            "yhat_expense": 0
        },
        {
            "ds": "2025-06-17T00:00:00",
            "yhat_income": 246381.42228837885,
            "yhat_expense": 0
        },
        {
            "ds": "2025-06-18T00:00:00",
            "yhat_income": 268113.8667446154,
            "yhat_expense": 0
        },
        {
            "ds": "2025-06-19T00:00:00",
            "yhat_income": 289846.31120085187,
            "yhat_expense": 0
        }
    ]
}
```

---

## 🏦 Account

### 6. Get Account Balance
- **Endpoint:** `/account/balance`  
- **Method:** `GET`  
- **Headers:**  
  `Authorization: Bearer <access_token>`  
- **Response:**
```json
{
  "accountId": 1,
  "userId": 1,
  "balance": "30570000.00",
  "createdAt": "2025-06-10T15:00:54.000Z",
  "updatedAt": "2025-06-11T12:24:54.000Z"
}
```