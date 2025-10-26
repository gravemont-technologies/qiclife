# QIC Life Frontend - Backend Integration Guide

## Overview
This frontend is built to seamlessly integrate with the QIC Life Node.js/Express backend running on port 3001. The architecture uses session-based authentication via UUID stored in localStorage.

## Backend Requirements

### Backend Must Be Running
- **Port**: 3001
- **Base URL**: `http://localhost:3001/api`
- **CORS**: Must allow `http://localhost:8080` (Vite dev server)

### Required Backend Endpoints
All endpoints are already integrated. The backend should expose:

#### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/stats` - Get user statistics

#### Mission System
- `GET /api/missions` - List all missions
- `GET /api/missions/:id` - Get mission details
- `POST /api/missions/:id/start` - Start a mission
- `POST /api/missions/:id/complete` - Complete a mission

#### Rewards System
- `GET /api/rewards` - List all rewards
- `GET /api/rewards/:id` - Get reward details
- `POST /api/rewards/:id/redeem` - Redeem a reward
- `GET /api/rewards/redemptions` - Get redemption history

#### Skill Tree
- `GET /api/skills` - List all skills
- `POST /api/skills/:id/unlock` - Unlock a skill

#### Social Features
- `GET /api/social/leaderboard` - Get leaderboard
- `GET /api/social/friends` - List friends
- `POST /api/social/friends` - Add friend
- `DELETE /api/social/friends/:id` - Remove friend

#### Onboarding & Scenarios
- `POST /api/onboarding/complete` - Complete onboarding
- `GET /api/scenarios` - List scenarios
- `POST /api/scenarios/:id/submit` - Submit scenario choice

## Session Management

### How It Works
1. On first load, frontend generates a UUID via `crypto.randomUUID()`
2. UUID is stored in localStorage as `qic-session-id`
3. Every API request includes header: `x-session-id: <uuid>`
4. Backend uses this UUID to identify and track the user
5. No traditional authentication required for MVP

### Session Storage
```javascript
// Get or create session
const sessionId = localStorage.getItem('qic-session-id') || crypto.randomUUID();
localStorage.setItem('qic-session-id', sessionId);
```

## Configuration

### Environment Variables
Create a `.env` file in the frontend root:

```bash
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Optional: Enable debug mode
VITE_DEBUG=false
```

For production deployment:
```bash
VITE_API_URL=https://your-backend-domain.com/api
```

## API Client Structure

### Location
`src/lib/api.ts` - Centralized API client using Axios

### Features
- ✅ Automatic session ID injection via interceptors
- ✅ TypeScript types for all endpoints
- ✅ Error handling with user-friendly messages
- ✅ Network error detection
- ✅ Rate limiting detection (429 errors)
- ✅ Server error handling (5xx errors)

### Usage Example
```typescript
import { apiClient } from '@/lib/api';

// Fetch missions
const response = await apiClient.getMissions();
const missions = response.data.data.missions;

// Complete mission
await apiClient.completeMission('mission-id');
```

## TypeScript Types

### Location
`src/types/api.ts` - All backend response types

### Type Safety
Every API call is fully typed:
```typescript
// Response automatically typed
const { data } = await apiClient.getProfile();
// data.data is typed as UserProfile

// Request payload typed
await apiClient.updateProfile({
  name: "John Doe",
  email: "john@example.com"
});
```

## Error Handling

### Network Errors
If backend is not running, users see:
- User-friendly error message
- "Try Again" button to retry
- Console logging for developers

### HTTP Errors
- **429 Rate Limiting**: "Too many requests. Please wait..."
- **5xx Server Errors**: "Server error. Please try again later."
- **4xx Client Errors**: Backend error message passed through

### Implementation
```typescript
try {
  await apiClient.completeMission(id);
  toast.success("Mission completed!");
} catch (error) {
  toast.error("Failed to complete mission");
}
```

## Data Fetching Strategy

### React Query Integration
- Automatic caching of API responses
- Background refetching for fresh data
- Optimistic updates for better UX
- Loading and error states handled

### Query Keys
```typescript
// Consistent query keys for cache management
["profile"]           // User profile
["stats"]            // User statistics
["missions"]         // All missions
["rewards"]          // All rewards
["skills"]           // Skill tree
["leaderboard"]      // Social leaderboard
["redemptions"]      // Reward redemption history
```

## Testing Backend Integration

### 1. Start Backend
```bash
cd backend
npm install
npm start
# Should see: "Server running on port 3001"
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Should see: "Local: http://localhost:8080"
```

### 3. Test Flow
1. Open `http://localhost:8080`
2. Dashboard should load with default stats
3. Try starting a mission
4. Complete a mission to earn XP/Coins
5. Check rewards marketplace
6. View leaderboard

### 4. Check Session
Open browser DevTools Console:
```javascript
// View current session ID
localStorage.getItem('qic-session-id')

// Clear session (reset user)
localStorage.removeItem('qic-session-id')
// Reload page to get new session
```

## Production Deployment

### Backend Requirements
1. Deploy backend to production server
2. Configure CORS to allow your frontend domain
3. Update rate limiting if needed
4. Set up database (Supabase or in-memory)

### Frontend Configuration
1. Update `.env` with production backend URL:
   ```bash
   VITE_API_URL=https://api.qiclife.qa/api
   ```
2. Build frontend:
   ```bash
   npm run build
   ```
3. Deploy `dist/` folder to hosting service
4. Ensure HTTPS for production

### Security Notes
- Session IDs are UUIDs (random, non-guessable)
- Backend implements rate limiting
- No sensitive data in localStorage
- HTTPS required for production
- CORS properly configured on backend

## Troubleshooting

### "Unable to connect to server"
- ✅ Check backend is running: `http://localhost:3001/api/health`
- ✅ Verify CORS allows `http://localhost:8080`
- ✅ Check `.env` file has correct `VITE_API_URL`
- ✅ Look for console errors in browser DevTools

### "Too many requests"
- Backend rate limit (100 req/15min) exceeded
- Wait 15 minutes or restart backend to reset

### Session not persisting
- Check localStorage in DevTools > Application
- Ensure not in private/incognito mode
- Clear cache and reload

### Data not updating
- Check React Query cache invalidation
- Force refresh with `refetch()` functions
- Clear browser cache

## Backend Response Format

All endpoints follow this structure:
```json
{
  "success": true,
  "data": {
    // Actual response data
  },
  "message": "Optional success message"
}
```

Errors:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error"
    }
  ]
}
```

## Migration Path

### Adding Real Authentication
When ready to add real authentication:

1. **Backend**: Add auth middleware
2. **Frontend**: 
   - Replace session UUID with JWT tokens
   - Update `src/lib/api.ts` interceptors
   - Add login/register pages
   - Store JWT in localStorage instead of session ID

3. **Backward Compatible**:
   - Keep `x-session-id` header for migration period
   - Backend can support both authentication methods

## Support & Documentation

- **Backend Docs**: Check backend README for full API documentation
- **Frontend Docs**: See component documentation in `/src/components`
- **Type Definitions**: Review `/src/types/api.ts` for data structures
- **API Client**: Check `/src/lib/api.ts` for endpoint implementations
