# Vercel Deployment Checklist

## Before Deployment

### 1. Environment Variables Setup
Ensure all these are set in Vercel dashboard under Project Settings → Environment Variables:

#### Required (Production)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., https://your-app.vercel.app)
- [ ] `AUTH_TRUST_HOST` - Set to `true`
- [ ] `RAZORPAY_KEY_ID` - Your Razorpay key ID
- [ ] `RAZORPAY_KEY_SECRET` - Your Razorpay key secret
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Same as RAZORPAY_KEY_ID (for client-side)

#### Optional (but recommended)
- [ ] `RAZORPAY_WEBHOOK_SECRET` - For payment webhooks
- [ ] `UPLOADTHING_TOKEN` - For file uploads
- [ ] `UPLOADTHING_APP_ID` - For file uploads

### 2. Database Preparation
- [ ] Database is running and accessible
- [ ] Database allows connections from external IPs (Vercel)
- [ ] Connection string includes SSL if required (`?sslmode=require`)
- [ ] Test connection string works locally

### 3. Code Verification
- [ ] All TypeScript errors resolved locally
- [ ] Run `npm run build` locally to verify build succeeds
- [ ] Prisma client generates correctly (`npx prisma generate`)
- [ ] No sensitive data in code (use environment variables)

## Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin master
   ```

2. **Trigger Vercel deployment**
   - Vercel will auto-deploy on push (if connected)
   - Or manually trigger from Vercel dashboard

3. **Monitor build logs**
   - Watch for "prisma generate" success
   - Check for any errors during build
   - Verify all dependencies install correctly

## After Deployment

### 1. Verify Deployment
- [ ] Visit your Vercel URL
- [ ] Check that homepage loads without errors
- [ ] No "Something went wrong" errors

### 2. Test Authentication
- [ ] Can access signup page
- [ ] Can create new account
- [ ] Can login successfully
- [ ] Can logout

### 3. Test Core Features
- [ ] Browse courses page loads
- [ ] Course cards display correctly
- [ ] Admin dashboard accessible (if admin user)
- [ ] Profile page loads

### 4. Database Check
- [ ] Data persists correctly
- [ ] No connection timeout errors
- [ ] Queries execute successfully

## Common Issues & Solutions

### Issue: "Server-side exception has occurred"
**Check:**
1. Vercel deployment logs for actual error
2. DATABASE_URL is correct and accessible
3. All required environment variables are set
4. Prisma client generated successfully (check build logs)

### Issue: Authentication not working
**Check:**
1. NEXTAUTH_SECRET is set
2. NEXTAUTH_URL matches your deployment URL
3. AUTH_TRUST_HOST=true is set
4. Database has User table with proper schema

### Issue: Database connection failed
**Check:**
1. DATABASE_URL format is correct
2. Database allows external connections
3. SSL is configured if required
4. Database is running and accessible

### Issue: Build fails
**Check:**
1. All TypeScript errors resolved
2. Dependencies are correct in package.json
3. Prisma schema is valid
4. Clear build cache and retry

## Rollback Plan

If deployment fails:
1. Check previous working commit
2. Revert to that commit: `git revert <commit-hash>`
3. Push to trigger new deployment
4. Or use Vercel dashboard to rollback to previous deployment

## Post-Deployment Tasks

- [ ] Set up custom domain (if needed)
- [ ] Configure Razorpay webhooks with production URL
- [ ] Monitor error logs in Vercel dashboard
- [ ] Test payment flow end-to-end
- [ ] Verify email notifications (if implemented)
- [ ] Set up monitoring/alerting

## Success Criteria

✅ Application loads without errors
✅ Users can sign up and login
✅ Courses display correctly
✅ Admin can manage courses
✅ Database operations work
✅ No console errors in browser
✅ Payment flow works (if testing)

---

**Last Updated:** November 18, 2025
**Status:** Ready for deployment
