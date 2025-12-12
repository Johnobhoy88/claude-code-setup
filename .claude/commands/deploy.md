# Deployment Checklist

Prepare for deployment of the specified component.

## Usage
/deploy [component]

Components: cli, backend, frontend, all

## Instructions

### Pre-deployment Checks

1. Run tests for the component
2. Check for uncommitted changes
3. Verify environment variables are set
4. Review recent changes

### CLI Deployment
```bash
cd cli
npm version patch  # or minor/major
npm run build
npm publish
```

### Backend Deployment
```bash
cd backend
sam build
sam deploy
```

### Frontend Deployment
```bash
cd frontend
npm run build
vercel --prod
```

### Post-deployment

1. Verify deployment succeeded
2. Test the deployed service
3. Update CHANGELOG if applicable
4. Notify of any issues found
