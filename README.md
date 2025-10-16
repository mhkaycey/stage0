# Stage Zero Backend Task

A production-ready Express.js API that serves profile information with dynamic cat facts from the Cat Facts API.

## 🚀 Live Demo

- **Production URL**: [https://stage0-production-38d1.up.railway.app/]
- **Profile Endpoint**: `GET /me`
- **Health Check**: `GET /health`

## 📋 Requirements Met

✅ **GET /me endpoint** returning JSON with correct Content-Type  
✅ **Integration with Cat Facts API** for dynamic facts  
✅ **Proper response structure** with all required fields  
✅ **Dynamic UTC timestamp** in ISO 8601 format  
✅ **Error handling** for external API failures  
✅ **CORS headers** enabled  
✅ **Rate limiting** implemented  
✅ **Security headers** with Helmet.js  
✅ **Comprehensive logging**  
✅ **Health check endpoint**  
✅ **Proper documentation**

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Security**: Helmet.js, CORS, Rate Limiting
- **Environment**: dotenv

## 📦 Installation & Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### 1. Clone the repository

```bash

git clone https://github.com/mhkaycey/stage-zero-backend.git
cd stage-zero-backend
```

### 2. Install dependencies

```bash

npm install

```

### 3. Configure environment variables

```bash

cp .env.example .env

Edit .env with actual information
USER_EMAIL=your.actual.email@domain.com
USER_NAME=Your Actual Full Name
USER_STACK=Node.js/Express
```

#### 4. Run the application

```bash
Development mode (with auto-reload):
npm run dev

Production mode:
npm start
```

### 5. Test the endpoint

```bash
curl http://localhost:3000/me
```
