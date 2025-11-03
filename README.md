# Interactive Zone Manager

A Next.js application for managing office zones with interactive floor plan editing capabilities.

## Features

- **Interactive Floor Plan**: Visual zone management on a floor plan image
- **Zone Status Management**: Toggle zones between free (green) and occupied (red)
- **Company Assignment**: Assign company names to occupied zones
- **Configurable Editing**: Enable/disable vertex editing and zone deletion via environment variables
- **Predefined Zones**: 44 pre-configured room zones with optimized coordinates

## Configuration

The application behavior can be controlled via environment variables:

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure features in `.env.local`:**
   ```bash
   # Enable/disable vertex editing (reshaping zones)
   NEXT_PUBLIC_ENABLE_VERTEX_EDITING=false
   
   # Enable/disable zone deletion
   NEXT_PUBLIC_ENABLE_ZONE_DELETION=false
   
   # Enable/disable zone creation
   NEXT_PUBLIC_ENABLE_ZONE_CREATION=false
   ```

3. **Available combinations:**
   - All `false`: Production safe - only status management
   - Creation `true`, others `false`: Allow creating zones only
   - Vertex `true`, others `false`: Allow reshaping existing zones only
   - Deletion `true`, others `false`: Allow removing zones only
   - All `true`: Full editing capabilities

See `VERTEX_EDITING_CONFIG.md` for detailed configuration options.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/map](http://localhost:3000/map) with your browser to access the zone management interface.

The application will automatically load 44 predefined room zones on first visit.

## Deployment

This project is configured for easy deployment to GitHub Pages:

1. **Push to GitHub**: `git push origin main`
2. **Enable GitHub Pages**: Go to Settings → Pages → Source: GitHub Actions
3. **Access your site**: `https://[username].github.io/praktikoffice/map/`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
