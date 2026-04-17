# CloudPulse Test Credentials

## Admin User
- **Email:** admin@cloudpulse.io
- **Password:** CloudPulse2024!
- **Role:** admin

## Test User (created during testing)
- **Email:** testuser@cloudpulse.io
- **Password:** Test1234!
- **Role:** viewer

## Auth Method
- Bearer token via Authorization header
- Tokens stored in localStorage (access_token, refresh_token)

## Auth Endpoints
- POST /api/auth/register - returns access_token + refresh_token in body
- POST /api/auth/login - returns access_token + refresh_token in body
- POST /api/auth/logout
- GET /api/auth/me - requires Authorization: Bearer <token>
- POST /api/auth/refresh - accepts refresh_token in body
