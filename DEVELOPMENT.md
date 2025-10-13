# GoMart Development Guide

## 🌳 Branch Structure

### Main Branches
- **`main`** - Production-ready code. Always deployable.
- **`develop`** - Integration branch for features. Latest development state.

### Feature Branches
Create feature branches from `develop`:
```bash
git checkout develop
git checkout -b feature/mobile-money-integration
git checkout -b feature/product-recommendations
git checkout -b feature/voice-search
```

### Hotfix Branches
For urgent fixes to production:
```bash
git checkout main
git checkout -b hotfix/payment-bug-fix
```

## 🔄 Development Workflow

### 1. Starting a New Feature
```bash
# Switch to develop and pull latest changes
git checkout develop
git pull origin develop

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Work on your feature...
# Make commits with descriptive messages
git add .
git commit -m "feat: implement mobile money payment integration"
```

### 2. Completing a Feature
```bash
# Push feature branch
git push -u origin feature/your-feature-name

# Create Pull Request on GitHub
# Target: develop ← feature/your-feature-name
```

### 3. Release Process
```bash
# When develop is ready for release
git checkout main
git merge develop
git tag v1.0.0
git push origin main --tags
```

## 🚀 Quick Start Commands

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
# In root directory
npm install
npm run dev
```

### Database Operations
```bash
cd backend
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to MongoDB
npm run db:studio      # Open Prisma Studio
```

## 📝 Commit Message Convention

Use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or fixing tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: add mobile money payment processing"
git commit -m "fix: resolve cart item quantity update issue"
git commit -m "docs: update API documentation for orders endpoint"
```

## 🔒 Environment Variables

### Backend (.env)
```env
DATABASE_URL="your-mongodb-connection-string"
JWT_SECRET="your-jwt-secret"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend
Environment variables automatically loaded from backend through Next.js config.

## 🧪 Testing Strategy

### API Testing
```bash
# Health check
curl http://localhost:5000/health

# Register customer
curl -X POST http://localhost:5000/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","phoneNumber":"0241234567","password":"password123"}'
```

### Frontend Testing
- Manual testing through http://localhost:3000
- Check backend connectivity status
- Verify responsive design

## 📦 Deployment Checklist

### Backend Deployment
- [ ] Set production environment variables
- [ ] Update CORS origins
- [ ] Configure MongoDB Atlas IP restrictions
- [ ] Set strong JWT secret
- [ ] Enable rate limiting
- [ ] Configure logging

### Frontend Deployment
- [ ] Update API endpoints
- [ ] Build production bundle
- [ ] Configure domain/subdomain
- [ ] Set up environment variables

## 🚫 What NOT to Commit

The `.gitignore` files are configured to exclude:
- `node_modules/`
- `.env` files
- `generated/` (Prisma client)
- Build outputs
- IDE files
- OS generated files
- Logs and temporary files

## 🔧 Troubleshooting

### Backend Issues
1. **Database Connection**: Check `.env` file and MongoDB Atlas settings
2. **Port Conflicts**: Change PORT in `.env` if 5000 is occupied
3. **Prisma Issues**: Run `npm run db:generate` after schema changes

### Frontend Issues
1. **API Connection**: Verify backend is running on correct port
2. **Build Errors**: Check for missing dependencies
3. **Styling Issues**: Ensure TailwindCSS is properly configured

## 📚 Resources

- [GitHub Repository](https://github.com/Latifpro108108/Ecommerce_Cloud_Backend.git)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes
4. Write tests if applicable
5. Create a Pull Request
6. Ensure CI/CD passes
7. Request code review

Remember: Always work on feature branches and never push directly to `main` or `develop`!
