# GitHub Pages Deployment Guide

This guide explains how to deploy the Interactive Zone Manager to GitHub Pages.

## 🚀 Automatic Deployment (Recommended)

The project is configured for automatic deployment using GitHub Actions.

### Setup Steps:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The deployment will start automatically

3. **Access your site:**
   - Your site will be available at: `https://[username].github.io/praktikoffice/`
   - The main zone management interface: `https://[username].github.io/praktikoffice/map/`

### What Happens Automatically:

- ✅ Builds the Next.js app as static files
- ✅ Configures safe production settings (all editing disabled)
- ✅ Deploys to GitHub Pages
- ✅ Updates on every push to main branch

## 🔧 Manual Deployment

If you prefer manual deployment:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `out` folder:**
   - The `out` directory contains all static files
   - Upload this folder to any static hosting service
   - Or use GitHub Pages manual upload

## ⚙️ Configuration

### Production Settings
The app is configured with safe production defaults:
```bash
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=false
NEXT_PUBLIC_ENABLE_ZONE_DELETION=false  
NEXT_PUBLIC_ENABLE_ZONE_CREATION=false
```

### Custom Configuration
To change settings for your deployment:

1. **Edit `.env.production`** with your preferred settings
2. **Commit and push** - GitHub Actions will use these settings
3. **Or modify the workflow** in `.github/workflows/deploy.yml`

## 📁 Project Structure for Deployment

```
praktikoffice/
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── .env.production              # Production environment variables
├── next.config.ts              # Next.js configuration for static export
├── out/                        # Generated static files (after build)
└── public/                     # Static assets (images, zone data)
```

## 🛠️ Troubleshooting

### Build Fails
- **Node.js Version**: Ensure you're using Node.js >=20.9.0 (required for Next.js 16)
- Check that all dependencies are installed: `npm ci`
- Verify TypeScript compilation: `npm run build`
- Check the Actions tab in GitHub for detailed error logs

### Site Not Loading
- Ensure GitHub Pages is enabled in repository settings
- Check that the workflow completed successfully
- Verify the site URL format: `https://[username].github.io/praktikoffice/`

### Assets Not Loading
- The app is configured with the correct base path for GitHub Pages
- Images and zone data are automatically copied to the `out` directory

## 🔄 Updates

To update your deployed site:
1. Make changes to your code
2. Commit and push to the main branch
3. GitHub Actions will automatically rebuild and redeploy

## 🌐 Alternative Hosting

The static files in the `out` directory can be deployed to:
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `out` folder or connect via Git
- **Firebase Hosting**: Use `firebase deploy` with the `out` directory
- **Any static hosting service**: Upload the contents of `out/`

## 📋 Pre-deployment Checklist

- ✅ **Node.js >=20.9.0** installed locally and in CI
- ✅ All features working in development
- ✅ Build completes without errors
- ✅ Environment variables configured
- ✅ GitHub repository is public (for free GitHub Pages)
- ✅ GitHub Actions enabled in repository settings

## 💻 Local Development Requirements

- **Node.js**: Version 20.9.0 or higher
- **npm**: Latest version (comes with Node.js)

Check your version:
```bash
node --version  # Should be >=20.9.0
npm --version   # Should be latest
```

If you need to upgrade Node.js:
- **Using nvm**: `nvm install 20 && nvm use 20`
- **Direct download**: https://nodejs.org/
- **Using package manager**: `brew install node` (macOS) or equivalent