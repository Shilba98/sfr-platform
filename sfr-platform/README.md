# SFR Commercial Intelligence Platform

A B2B SME Commercial Decision & Value Realisation Layer built with Next.js 14.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Recharts** for data visualisation
- **Lucide React** for icons
- **Mock data** — seeded synthetic SFR SME accounts

## Views
| Route | Description |
|-------|-------------|
| `/dashboard` | Portfolio overview — KPIs, posture distribution, live feed |
| `/intelligence` | Account scoring table — risk, opportunity, complexity |
| `/decisions` | Posture cards, conflict resolution log, NBA queue |
| `/roi` | Revenue attribution, cohort comparison, ROI charts |
| `/governance` | Adoption metrics, override log, activity feed |
| `/pipeline` | Salesforce schema, data flow, gap analysis |

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
```bash
# Create a new repo on github.com first, then:
git init
git add .
git commit -m "Initial commit — SFR platform"
git remote add origin https://github.com/YOUR_USERNAME/sfr-platform.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your `sfr-platform` repository
4. Leave all settings as default (Vercel auto-detects Next.js)
5. Click **"Deploy"**

That's it. Your platform will be live at `https://sfr-platform.vercel.app` in ~90 seconds.

---

## Run locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Build for production

```bash
npm run build
npm start
```

---

## Replacing mock data with real Salesforce

When ready to connect a real Salesforce sandbox:

1. Add your SF credentials to `.env.local`:
```
SF_CLIENT_ID=your_connected_app_client_id
SF_CLIENT_SECRET=your_connected_app_secret
SF_USERNAME=your_sf_username
SF_PASSWORD=your_sf_password
SF_INSTANCE_URL=https://your-instance.salesforce.com
```

2. Replace the `generateAccounts()` call in `lib/data.ts` with a fetch to `/api/accounts`

3. Create `app/api/accounts/route.ts` using the `jsforce` package to query SF

The frontend will work identically — zero component changes needed.
