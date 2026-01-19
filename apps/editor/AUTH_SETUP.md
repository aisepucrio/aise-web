# Authentication System Setup

## Overview

The editor uses Google OAuth authentication with **HttpOnly cookies** for secure session management. Only authorized users listed in the Google Sheets "Login" tab can access the editor.

**Security Model**: 
- ✅ **XSS Protection**: HttpOnly cookies prevent JavaScript token theft
- ✅ **CSRF Protection**: SameSite=Strict + Origin/Referer validation
- ✅ **HTTPS Enforcement**: Secure flag in production
- ✅ **Server-side validation**: Token verified on every request
- ✅ **Defense in depth**: Multiple layers of security

## Setup Instructions

### 1. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Go to **APIs & Services** > **OAuth consent screen**
   - Configure the consent screen (internal or external)
   - Add necessary scopes (email, profile)
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Select **Web application** as application type
6. Add **Authorized JavaScript origins**:
   - `http://localhost:3001` (development)
   - `https://your-production-domain.com` (production)
7. Add **Authorized redirect URIs** (if needed):
   - `http://localhost:3001` (development)
   - `https://your-production-domain.com` (production)
8. Copy the **Client ID**

**Note**: This uses Google Identity Services (GIS), not the deprecated Google+ API.

### 2. Environment Variables

Update your `.env.local` file:

```env
# Google OAuth (same Client ID for both)
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com

# Website Publishing (Admin only)
WEBSITE_API_TOKEN=your_secure_token_here
```

### 3. Google Sheets "Login" Tab

Create a new sheet tab called **"Login"** with the following structure:

| google email | cargo |
|--------------|-------|
| user1@example.com | |
| admin@example.com | admin |
| user2@example.com | |

**Columns:**
- **google email**: User's Google email address (must match their Google account)
- **cargo**: Leave empty for regular users, or set to `admin` for administrators

**Permissions:**
- **Users**: Can edit Google Sheets data (Team, Researches, Tools, Publications)
- **Admins**: Can edit data + publish to external website

## User Flow

### Login
1. User visits `/login` (or any protected route)
2. Clicks "Sign in with Google"
3. Authenticates with Google account
4. System validates:
   - Google token is valid (JWT signature verification)
   - Email is verified
   - Email exists in "Login" sheet
5. **Server sets HttpOnly cookie** with the validated token
6. User is redirected to home page
7. **Client never sees the token** - it's stored securely by the browser

### Session Management
- **Cookie-based authentication**: Token stored in HttpOnly cookie (inaccessible to JavaScript)
- **XSS protection**: Even if malicious script runs, it cannot steal the token
- **Automatic transmission**: Browser sends cookie with every request
- **Server validation**: Every API request validates the token from the cookie
- **7-day expiration**: Sessions last 7 days, then user must re-login

### Access Control
- All pages (except `/login`) require authentication
- Middleware checks session on every route
- API routes validate token from cookie on every request
- Client calls `/api/auth/me` to check "who am I?" without handling tokens directly

## Architecture Details

### Authentication Flow
```
┌─────────┐         ┌──────────┐         ┌────────────┐
│ Client  │         │  Server  │         │   Google   │
└────┬────┘         └─────┬────┘         └─────┬──────┘
     │                    │                    │
     │ 1. Google Sign-In  │                    │
     ├───────────────────────────────────────► │
     │                    │  2. ID Token       │
     │ ◄──────────────────────────────────────┤
     │                    │                    │
     │ 3. POST /api/auth/verify + token        │
     ├───────────────────►│                    │
     │                    │ 4. Validate JWT    │
     │                    ├───────────────────►│
     │                    │ ◄──────────────────┤
     │                    │ 5. Check Login sheet
     │                    │                    │
     │ 6. Set HttpOnly cookie                 │
     │ ◄──────────────────┤                    │
     │                    │                    │
     │ 7. GET /api/auth/me (cookie auto-sent) │
     ├───────────────────►│                    │
     │                    │ 8. Read cookie     │
     │                    │ 9. Return user data│
     │ ◄──────────────────┤                    │
```

### Security Implementation

1. **Token Validation**: Google ID tokens (JWT) verified server-side using Google's public keys
2. **HttpOnly Cookies**: 
   - Set with `httpOnly: true` (JavaScript cannot access)
   - `secure: true` in production (HTTPS only)
   - `sameSite: 'strict'` (maximum CSRF protection)
   - 7-day expiration
3. **CSRF Protection** (Defense in Depth):
   - **Layer 1**: SameSite=Strict cookie attribute
   - **Layer 2**: Origin/Referer header validation on all POST/PUT/DELETE/PATCH requests
   - Requests without valid Origin/Referer are rejected with 403
4. **Role-Based Access**: Admin-only features protected at UI and API levels
5. **Secure Publishing**: Website API token kept server-side only (never exposed to client)
6. **No Client-Side Tokens**: Client asks "who am I?" via `/api/auth/me` - server handles all token logic
## Troubleshooting

### "Unauthorized" error
- Check if email is in "Login" sheet (case-sensitive)
- Verify `GOOGLE_CLIENT_ID` matches OAuth credentials
- Check if session cookie exists (browser dev tools → Application/Storage → Cookies)
- Cookie may have expired - re-login

### "Admin access required"
- Ensure user has `admin` in the cargo column (lowercase)
- Check case sensitivity (must be lowercase "admin")

### Login page not loading
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
- Check browser console for errors
- Ensure Google Sign-In script loads successfully (`https://accounts.google.com/gsi/client`)
- Verify your domain is in the authorized JavaScript origins

### Session expires unexpectedly
- Default session: 7 days
- Check server logs for cookie validation errors
- Ensure browser allows cookies
- If using incognito/private mode, cookies clear when window closes
## Development vs Production

**Development** (localhost:3001):
- Use `http://localhost:3001` in OAuth authorized origins
- Test with development Google account
- Cookies work on HTTP (localhost exception)

**Production**:
- Add production domain to OAuth authorized origins
- Use production Google Sheets
- Secure WEBSITE_API_TOKEN properly (use environment variables, never commit)
- **HTTPS required**: HttpOnly + Secure cookies only work over HTTPS
- Implement Content Security Policy (CSP) headers
- Monitor for suspicious login patterns

## Security Features

### ✅ Implemented (Production-Ready Security)
1. **XSS Protection**: HttpOnly cookies inaccessible to JavaScript (even malicious scripts)
2. **CSRF Protection** (Multiple Layers):
   - SameSite=Strict cookie attribute (blocks cross-site cookie sending)
   - Origin/Referer validation on state-changing requests (POST/PUT/DELETE/PATCH)
   - Rejects requests without valid origin/referer headers
3. **HTTPS Enforcement**: Secure flag in production (cookies only sent over HTTPS)
4. **Server-side Validation**: All token validation happens server-side
5. **No Token Exposure**: Client never sees or handles raw tokens

### 📋 Best Practices Followed
- ✅ Token stored in HttpOnly cookie (not localStorage - XSS immune)
- ✅ Cookie has Secure flag in production (HTTPS only)
- ✅ Cookie has SameSite=Strict (maximum CSRF protection)
- ✅ Origin/Referer validation on mutations (defense in depth)
- ✅ Server validates JWT on every request (against Google's public keys)
- ✅ Website API token never exposed to client (server-side only)
- ✅ Role-based access control (user vs admin)
- ✅ Error handling doesn't leak sensitive info
- ✅ Client-side fetch errors propagate to caller (no forced redirects in utility functions)

### 🔐 CSRF Protection Details

**Why it matters**: Cookie-based auth is vulnerable to CSRF attacks where malicious sites trigger authenticated requests.

**Our defense**:
1. **SameSite=Strict**: Browser won't send cookie on cross-site requests
2. **Origin/Referer validation**: Server checks request came from our domain
3. **Applied to**: All POST/PUT/DELETE/PATCH endpoints (state-changing operations)

**Example**: Attacker tries `<form action="https://your-editor.com/api/team" method="POST">` on evil.com
- ❌ Browser won't send auth cookie (SameSite=Strict)
- ❌ Even if bypassed, server rejects (invalid Origin header)

### 🔮 Future Enhancements
- Implement token refresh for seamless re-authentication
- Add rate limiting on login endpoint (prevent brute force)
- Implement 2FA for admin accounts
- Add audit logging for admin actions
- Session management dashboard for admins
- Add CSP headers to prevent XSS injection vectors
If upgrading from the previous version:

1. Install dependencies: `npm install google-auth-library`
2. Add OAuth environment variables
3. Create "Login" sheet tab
4. Add authorized users to the sheet
5. Remove old API token prompts from UI (already done)

## Development vs Production

**Development** (localhost:3001):
- Use `http://localhost:3001` in OAuth authorized origins
- Test with development Google account

**Production**:
- Add production domain to OAuth authorized origins
- Use production Google Sheets
- Secure WEBSITE_API_TOKEN properly
