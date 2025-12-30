# 🚀 Deployment Guide

## Option 1: Deploy to Render (Recommended for Traditional Hosting)

### Prerequisites
- Render account (https://render.com)
- Git repository

### Steps

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Add OSINT API server"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your Git repository

3. **Configure Build Settings**
   - **Runtime**: Node.js
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`

4. **Environment Variables**
   Add these environment variables in Render dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=your-secure-jwt-secret
   SERVER_AUTH_KEY=your-server-auth-key
   ADMIN_KEY=your-admin-key
   ```

5. **Deploy**
   - Render will automatically build and deploy
   - Your API will be available at `https://your-app-name.onrender.com`

## Option 2: Deploy to Cloudflare Workers (Serverless)

### Prerequisites
- Cloudflare account
- Wrangler CLI installed

### Steps

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler auth login
   ```

3. **Configure KV Namespaces**
   Edit `wrangler.toml` and replace the KV IDs with your actual namespace IDs:
   ```toml
   [[kv_namespaces]]
   binding = "CREDITS"
   id = "your-actual-kv-id"
   preview_id = "your-preview-kv-id"
   ```

4. **Deploy**
   ```bash
   wrangler publish
   ```

5. **Your API will be available at:**
   `https://your-worker-name.your-subdomain.workers.dev`

## API Endpoints

Once deployed, your API will have these endpoints:

### User Management
- `POST /api/users/create` - Create new user
- `POST /api/verify-key` - Verify API key
- `GET /api/user-credits` - Get user credits
- `POST /api/deduct-credits` - Deduct credits
- `GET /api/users` - Get all users
- `POST /api/add-credits` - Add credits
- `GET /api/user/:apiKey/stats` - Get user stats

### Authentication
All admin endpoints require:
```
Authorization: Bearer YOUR_SERVER_AUTH_KEY
```

## Testing Your Deployment

### Test Basic Connectivity
```bash
curl https://your-api-url.onrender.com/api/users/create \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Test Credit System
```bash
# Get user credits
curl https://your-api-url.onrender.com/api/user-credits \
  -H "Authorization: Bearer sk_sample_1234567890abcdef"
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by Render) | `10000` |
| `JWT_SECRET` | JWT signing secret | `your-secure-secret` |
| `SERVER_AUTH_KEY` | Server authentication key | `your-auth-key` |
| `ADMIN_KEY` | Admin access key | `your-admin-key` |

## Troubleshooting

### Build Errors
- Ensure all dependencies are in `server/package.json`
- Check TypeScript compilation: `cd server && npm run build`

### Runtime Errors
- Check environment variables are set correctly
- Verify PORT is being used: `process.env.PORT || 3000`

### CORS Issues
- Add CORS middleware if needed:
  ```javascript
  import cors from 'cors';
  app.use(cors());
  ```

## Monitoring

### Logs
- **Render**: View logs in Render dashboard
- **Cloudflare**: Use `wrangler tail` to view logs

### Health Check
```bash
curl https://your-api-url.onrender.com/api/users
```

## Security Notes

1. **Change default secrets** in production
2. **Use HTTPS** (automatically provided by Render/Cloudflare)
3. **Implement rate limiting** for production use
4. **Add input validation** for all endpoints
5. **Use a real database** instead of in-memory storage

## Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify environment variables are set
3. Test locally first: `cd server && npm run dev`
