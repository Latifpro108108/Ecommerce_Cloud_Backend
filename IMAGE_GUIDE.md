# 📸 GoMart E-commerce - Image Upload Guide

## Overview
This guide explains how to add images to your GoMart e-commerce platform for Ghana.

## Image Upload Methods

### Method 1: Using Free Image Hosting Services (Recommended)

#### 🔵 ImgBB (Easiest - No Account Required)
1. Go to https://imgbb.com
2. Click "Start uploading" or drag and drop your image
3. Wait for upload to complete
4. Copy the **Direct Link** (ends with .jpg, .png, etc.)
5. Paste this link in the "Product Image URL" field in GoMart

**Example URL format:**
```
https://i.ibb.co/ABC123/product-image.jpg
```

#### 🟢 Cloudinary (Professional Option)
1. Create free account at https://cloudinary.com
2. Upload your image via their dashboard
3. Right-click on image → "Copy image address"
4. Paste this URL in GoMart

**Example URL format:**
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/product.jpg
```

#### 🟣 Imgur (Popular & Reliable)
1. Go to https://imgur.com
2. Click "New post"
3. Upload your image
4. Right-click uploaded image → "Copy image address"
5. Make sure the URL ends with the image extension (.jpg, .png)

**Example URL format:**
```
https://i.imgur.com/ABC123.jpg
```

---

## Recommended Image Specifications

### Product Images
- **Size:** 800x800px to 1200x1200px
- **Format:** JPG or PNG
- **File Size:** Under 500KB for fast loading
- **Background:** White or transparent (for products)
- **Aspect Ratio:** 1:1 (square) preferred

### Category Icons
- Use emoji or simple images
- Keep consistent style across categories

### Vendor/Store Logos
- **Size:** 400x400px minimum
- **Format:** PNG with transparency preferred
- **File Size:** Under 200KB

---

## Sample Product Images for Testing

You can use these free stock image websites to find product images:

### 📱 Electronics
- **Unsplash:** https://unsplash.com/s/photos/electronics
- **Pexels:** https://www.pexels.com/search/smartphone/
- **Pixabay:** https://pixabay.com/images/search/laptop/

### 👔 Fashion/Clothing
- **Unsplash:** https://unsplash.com/s/photos/fashion
- **Pexels:** https://www.pexels.com/search/clothing/

### 🍎 Food & Groceries
- **Unsplash:** https://unsplash.com/s/photos/food
- **Pexels:** https://www.pexels.com/search/groceries/

### 🏠 Home & Furniture
- **Unsplash:** https://unsplash.com/s/photos/furniture
- **Pexels:** https://www.pexels.com/search/home-decor/

---

## Step-by-Step: Adding a Product with Image

### Example Workflow:

1. **Find or Take Product Photo**
   - Use your phone camera for real products
   - Or download from free stock photo sites

2. **Upload to ImgBB**
   - Go to https://imgbb.com
   - Upload your image
   - Copy the **Direct Link**

3. **Add Product in GoMart**
   - Navigate to: `/ui/products/new`
   - Fill in product details:
     - **Product Name:** Samsung Galaxy A54
     - **Description:** Latest smartphone with amazing features...
     - **Price:** 2500.00
     - **Stock Quantity:** 50
     - **Category:** Select "Electronics"
     - **Vendor:** Select a verified vendor
     - **Image URL:** Paste the ImgBB direct link
   - Click "Create Product"

4. **Verify**
   - Go to `/ui/products/list`
   - Your product should display with the image

---

## Ghana-Specific Product Suggestions

### Popular Products to Add:

#### Electronics
- Mobile phones (Samsung, iPhone, Tecno, Infinix)
- Laptops and computers
- Headphones and speakers
- Phone accessories

#### Fashion
- African print clothing (Kente, Ankara)
- Traditional wear (Kaba and Slit, Agbada)
- Modern fashion
- Shoes and accessories

#### Food & Beverages
- Local spices and ingredients
- Packaged foods
- Beverages (Sobolo, Bissap)
- Cooking ingredients

#### Home & Garden
- Furniture
- Kitchen appliances
- Home decor
- Bedding and linens

---

## Image URL Formats (Examples)

### ✅ GOOD - Direct Image Links
```
https://i.ibb.co/ABC123/product.jpg
https://res.cloudinary.com/demo/image/upload/sample.jpg
https://i.imgur.com/ABC123.png
https://images.unsplash.com/photo-123456?auto=format&fit=crop
```

### ❌ BAD - These Won't Work
```
https://imgbb.com/album/ABC123          ← Album link, not direct image
https://imgur.com/gallery/ABC123        ← Gallery link, not direct image
https://drive.google.com/file/d/123     ← Google Drive (requires auth)
https://www.dropbox.com/s/abc           ← Dropbox (requires download)
C:\Users\Desktop\image.jpg              ← Local file path
```

---

## Troubleshooting

### Image Not Showing?
1. **Check the URL:**
   - Must be a direct link ending in .jpg, .png, .gif, or .webp
   - Test by pasting URL directly in browser - image should show

2. **Check Image Host:**
   - Some sites block hotlinking (showing images on other websites)
   - Use recommended services: ImgBB, Cloudinary, Imgur

3. **CORS Issues:**
   - Modern browsers may block some image URLs
   - Solution: Use HTTPS URLs (starting with `https://`)

### Image Too Large/Slow Loading?
1. Compress image before uploading
   - Use https://tinypng.com (free)
   - Or https://compressor.io

2. Resize to appropriate dimensions
   - Use https://www.resizeimage.net
   - Target: 800x800px for products

---

## Quick Reference: Best Free Image Hosts

| Service | Sign Up Required | Max File Size | Best For |
|---------|-----------------|---------------|-----------|
| **ImgBB** | No | 32MB | Quick uploads, temporary use |
| **Cloudinary** | Yes (Free tier) | 10MB | Professional, permanent storage |
| **Imgur** | No | 20MB | Popular, reliable |
| **Unsplash** | No | N/A | High-quality stock photos |
| **Pexels** | No | N/A | Free stock photos |

---

## Sample Product Data with Images

Copy-paste these for testing:

### Product 1: Samsung Galaxy A54
```
Name: Samsung Galaxy A54 5G
Description: 128GB storage, 6GB RAM, 50MP camera, 5000mAh battery
Price: 2499.99
Image URL: https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800
Category: Electronics
Stock: 25
```

### Product 2: African Print Dress
```
Name: Ankara Print Maxi Dress
Description: Beautiful African print fabric, perfect for special occasions
Price: 150.00
Image URL: https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800
Category: Fashion
Stock: 15
```

### Product 3: Laptop
```
Name: HP Pavilion 15 Laptop
Description: Intel Core i5, 8GB RAM, 512GB SSD, Windows 11
Price: 4200.00
Image URL: https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800
Category: Electronics
Stock: 10
```

---

## Advanced: Using Your Own Image Server

If you want to host images on your own server:

1. **Option 1: Next.js Public Folder**
   - Place images in `/gomart/public/products/`
   - Use URL: `/products/image-name.jpg`
   - ⚠️ Not recommended for production

2. **Option 2: AWS S3 / Digital Ocean Spaces**
   - Professional cloud storage
   - Requires setup and billing
   - Best for production deployments

3. **Option 3: Firebase Storage**
   - Free tier available
   - Good for small to medium sites
   - Requires Firebase account

---

## Need Help?

### Common Issues:

**Q: Can I upload images directly in GoMart?**
A: Not yet - we use URL-based images for simplicity. You need to upload to an image host first.

**Q: What if my image link is too long?**
A: Use a URL shortener like Bitly, BUT make sure the shortened URL redirects to the direct image file.

**Q: Can I use multiple images per product?**
A: Currently, the system supports one main image per product. For multiple images, choose the best representative photo.

**Q: Where should I store vendor/shop logos?**
A: Same process - upload to ImgBB or Cloudinary and paste the URL.

---

## 🎨 Design Tips for Product Photos

1. **Good Lighting:** Natural light works best
2. **Clean Background:** White or neutral colors
3. **Multiple Angles:** Take photos from different sides
4. **Include Size Reference:** Show product with common objects
5. **High Resolution:** At least 800x800px
6. **Consistent Style:** Use same background/lighting for all products

---

## 🇬🇭 Ghana-Specific Tips

- For traditional items (Kente, local crafts), show detailed patterns
- Include context photos showing items in use
- For food products, make them look fresh and appetizing
- For electronics, include packaging if new/sealed
- Show brand names clearly for verification

---

**Last Updated:** 2025-11-03
**GoMart Version:** 1.0
**Need Support?** Check the main README.md file







