# Vercel Deployment Configuration

## Required Environment Variables

Make sure to add these environment variables in your Vercel project settings:

### Database
```
DATABASE_URL=your_postgres_connection_string
```

### Authentication
```
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
AUTH_TRUST_HOST=true
```

### Razorpay (Payment)
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### UploadThing (File Upload)
```
UPLOADTHING_TOKEN=your_uploadthing_token
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

## Deployment Steps

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Set build command** (already configured in package.json):
   ```
   npm run build
   ```
4. **Deploy** - Vercel will automatically:
   - Run `prisma generate` (via postinstall script)
   - Build the Next.js application
   - Deploy to production

## Database Setup

Make sure your PostgreSQL database is accessible from Vercel. Recommended options:
- Vercel Postgres
- Neon
- Supabase
- Railway
- Any cloud-hosted PostgreSQL

## Troubleshooting

### Error: Prisma Client not generated
**Solution**: The `postinstall` script in package.json automatically runs `prisma generate`. Make sure it's not failing due to missing DATABASE_URL.

### Error: Database connection failed
**Solution**: 
1. Verify DATABASE_URL is correct and accessible from Vercel
2. Ensure your database allows connections from Vercel IPs (or all IPs for hosted databases)
3. Check if your database requires SSL (add `?sslmode=require` to connection string if needed)
4. For Vercel Postgres, use the connection string from the Vercel dashboard
5. Test the connection string locally first

### Error: NEXTAUTH_SECRET missing
**Solution**: Generate a secret with: `openssl rand -base64 32` and add to environment variables

### Error: "Something went wrong! An error occurred in the Server Components render"
**Solutions**:
1. Check Vercel deployment logs for the actual error
2. Verify all environment variables are set correctly
3. Ensure DATABASE_URL is accessible from Vercel
4. Check that Prisma client generated correctly (look for "prisma generate" in build logs)
5. Verify AUTH_TRUST_HOST=true is set
6. Check that NEXTAUTH_URL matches your deployment URL

### Build fails with module errors
**Solution**: Clear Vercel build cache and redeploy

### Prisma Client Import Errors
**Solution**: Make sure the Prisma schema output path matches the import in lib/db.ts. The current setup uses `../lib/generated` as output.

## Post-Deployment

After successful deployment:
1. Run database migrations if needed
2. Seed initial data (admin user, courses)
3. Test authentication flow
4. Test payment integration
5. Verify file uploads work

## Important Notes

- The Prisma client is generated during the build process
- Environment variables must be set in Vercel dashboard before deployment
- Make sure your database is running and accessible
- NEXTAUTH_URL should match your production domain
