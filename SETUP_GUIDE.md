# 🚀 GoMart Quick Setup Guide

## Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd gomart
npm install
```

### Step 2: Set Up Environment
Create a `.env` file in the gomart folder:

```env
DATABASE_URL="mongodb://localhost:27017/gomart"
NEXTAUTH_SECRET="your-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

**For MongoDB Atlas (Cloud):**
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/gomart?retryWrites=true&w=majority"
```

### Step 3: Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### Step 4: Run the App
```bash
npm run dev
```

### Step 5: Open Browser
Go to: **http://localhost:3000**

---

## ✅ First Steps After Installation

### 1. Add Categories (Essential)
Navigate to: `/ui/categories/new`

**Suggested categories for Ghana:**
- Electronics & Phones
- Fashion & Clothing
- Food & Beverages
- Home & Furniture
- Beauty & Cosmetics
- Sports & Fitness
- Agriculture & Farming

### 2. Add Vendors
Navigate to: `/ui/vendors/new`

**Sample vendor:**
- Name: Kwame's Electronics
- Email: kwame@example.com
- Phone: +233 XX XXX XXXX
- Region: Greater Accra
- City: Accra

### 3. Add Products
Navigate to: `/ui/products/new`

**Before adding products:**
- Read the `IMAGE_GUIDE.md` for image upload instructions
- Make sure you have at least one category
- Make sure you have at least one vendor

---

## 📸 Quick Image Setup

### Option 1: ImgBB (Easiest)
1. Go to https://imgbb.com
2. Upload your product image
3. Copy the "Direct Link"
4. Paste in the "Product Image URL" field

### Option 2: Use Sample URLs
For testing, use these free image URLs:

**Electronics:**
```
https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format
```

**Fashion:**
```
https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format
```

**Food:**
```
https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format
```

---

## 🇬🇭 Ghana-Specific Setup

### Ghana Regions (All 16 included)
When adding vendors, customers, or couriers, select from:
- Greater Accra
- Ashanti
- Western
- Eastern
- Central
- Northern
- Upper East
- Upper West
- Volta
- Brong-Ahafo
- Oti
- Bono East
- Ahafo
- Savannah
- North East
- Western North

### Payment Methods (Displayed but not yet integrated)
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money
- Bank Transfer
- Cash on Delivery

---

## 🛠️ Troubleshooting

### MongoDB Connection Issues

**Problem:** Can't connect to MongoDB

**Solution 1 - Local MongoDB:**
```bash
# Install MongoDB locally
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt install mongodb

# Start MongoDB
mongod

# Then use this in .env:
DATABASE_URL="mongodb://localhost:27017/gomart"
```

**Solution 2 - MongoDB Atlas (Cloud - FREE):**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Replace `<password>` and `<username>` in connection string
6. Use in .env:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/gomart"
```

### Port 3000 Already in Use

**Problem:** Error: Port 3000 is already in use

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001

# Or kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Errors

**Problem:** Prisma Client is not generated

**Solution:**
```bash
npx prisma generate
```

### Build Errors

**Problem:** TypeScript or ESLint errors

**Solution:**
```bash
# Check for errors
npm run lint

# Build and check
npm run build
```

---

## 📚 Learning Path

### Day 1: Setup & Basics
1. ✅ Install and run the app
2. ✅ Create 5 categories
3. ✅ Create 2-3 vendors
4. ✅ Add 5-10 products with images

### Day 2: Operations
1. ✅ Create customer accounts
2. ✅ Test the cart functionality
3. ✅ Create sample orders
4. ✅ Add product reviews

### Day 3: Advanced
1. ✅ Set up couriers for your regions
2. ✅ Test order status updates
3. ✅ Explore filter and search features
4. ✅ Customize the styling

---

## 🎨 Customization Tips

### Change Colors
Edit `gomart/src/app/globals.css`:

```css
:root {
  --primary: #059669; /* Green */
  --secondary: #dc2626; /* Red */
  --gold: #fbbf24; /* Gold */
}
```

### Change Logo/Brand
Edit `gomart/src/components/Navigation.tsx`:

```tsx
<span className="text-2xl font-bold text-green-600">YourBrandName</span>
```

### Add Footer Links
Edit `gomart/src/app/layout.tsx` in the footer section.

---

## 📞 Need Help?

### Documentation Files
1. **PROJECT_DOCUMENTATION.md** - Complete project overview
2. **IMAGE_GUIDE.md** - How to add images
3. **DATABASE_SCHEMA.md** - Database structure (if exists)
4. **DEVELOPMENT.md** - Development notes (if exists)

### Common Questions

**Q: Can I use this commercially?**
A: Yes! It's built for commercial use in Ghana.

**Q: Do I need coding experience?**
A: Basic understanding helps, but the app is ready to use.

**Q: How do I add more products?**
A: Just go to `/ui/products/new` and fill the form!

**Q: Can I change the currency?**
A: The app is built for Ghana Cedis (GH₵). Changing requires code updates.

**Q: How do I add real payment processing?**
A: You'll need to integrate with payment providers like Paystack, Flutterwave, or local mobile money APIs.

---

## 🚀 Going Live (Production)

### 1. Choose a Hosting Platform

**Vercel (Recommended - FREE tier):**
```bash
npm install -g vercel
vercel login
vercel
```

**Railway (Easy - FREE tier):**
1. Go to https://railway.app
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### 2. Set Up Production Database

Use MongoDB Atlas (FREE tier):
1. Create production cluster
2. Whitelist all IPs (0.0.0.0/0) or specific IPs
3. Update DATABASE_URL in production

### 3. Update Environment Variables

In your hosting platform, set:
```env
DATABASE_URL="your-production-mongodb-url"
NEXTAUTH_SECRET="secure-random-string"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

### 4. Custom Domain (Optional)

- Most platforms allow free custom domain
- Follow platform-specific instructions
- Update NEXTAUTH_URL to your domain

---

## ✨ Success Checklist

Before launching:
- [ ] Database is set up and connected
- [ ] At least 3 categories created
- [ ] At least 2 vendors registered
- [ ] At least 10 products with images added
- [ ] All images are loading correctly
- [ ] Cart functionality tested
- [ ] Order creation tested
- [ ] All main pages loading without errors
- [ ] Mobile responsiveness checked
- [ ] Production environment variables set

---

## 🎉 You're Ready!

Your GoMart e-commerce platform is now set up and ready to use!

**What's Next?**
1. Add more products
2. Customize the design
3. Integrate payment processing
4. Add email notifications
5. Deploy to production

**Welcome to GoMart - Ghana's Premier E-commerce Platform! 🇬🇭**

---

**Happy Selling! 🛍️**







