# DevOps Learning Dashboard

A simple static website for learning DevOps with environment-specific styling and information display.

## Features

- **Large environment banner** showing which environment you're on
- **Environment-specific colors**:
  - Gray for dev
  - Blue for staging
  - Yellow for preprod
  - Green for production
- **Information display**: Version, Commit SHA, Build Number, Deployment Timestamp
- **Modern design** with Tailwind CSS
- **Build script** that injects environment variables

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Build and start local server

```bash
npm start
```

This will:
- Build the site with default values (development environment)
- Start a local web server on http://localhost:8080
- Automatically open in your browser

### Alternative: Build only

```bash
npm run build
```

This will create a `dist/index.html` file without starting a server.

## Building for Different Environments

### Using environment variables:

**Windows (PowerShell):**
```powershell
$env:ENVIRONMENT="production"; $env:VERSION="2.0.0"; $env:BUILD_NUMBER="42"; node build.js
```

**Windows (CMD):**
```cmd
set ENVIRONMENT=production && set VERSION=2.0.0 && set BUILD_NUMBER=42 && node build.js
```

**Linux/Mac:**
```bash
ENVIRONMENT=production VERSION=2.0.0 BUILD_NUMBER=42 node build.js
```

### Using npm scripts:

**Build only:**
```bash
npm run build              # Default (development)
npm run build:dev          # Dev environment
npm run build:staging      # Staging environment
npm run build:preprod      # Pre-production environment
npm run build:production   # Production environment
```

**Build and start local server:**
```bash
npm start                  # Default (development)
npm run start:dev          # Dev environment
npm run start:staging      # Staging environment
npm run start:preprod      # Pre-production environment
npm run start:production   # Production environment
```

**Serve existing build (no rebuild):**
```bash
npm run serve              # Serve dist/ folder on port 8080
```

## Environment Variables

The build script reads the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `ENVIRONMENT` | Environment name (dev, staging, preprod, production) | `development` |
| `VERSION` | Application version | `1.0.0` |
| `BUILD_NUMBER` | CI/CD build number | `1` |

Additionally, the script automatically captures:
- `COMMIT_SHA`: Git commit hash (from `git rev-parse HEAD`)
- `DEPLOY_TIMESTAMP`: Current timestamp in ISO format

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Build dashboard
  env:
    ENVIRONMENT: production
    VERSION: ${{ github.ref_name }}
    BUILD_NUMBER: ${{ github.run_number }}
  run: node build.js
```

### GitLab CI Example

```yaml
build:
  script:
    - export ENVIRONMENT=production
    - export VERSION=$CI_COMMIT_TAG
    - export BUILD_NUMBER=$CI_PIPELINE_ID
    - node build.js
```

## Project Structure

```
devops-learning-dashboard/
├── index.html          # Source template with variables
├── build.js            # Build script
├── package.json        # NPM configuration
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── dist/              # Build output (created by build.js)
    └── index.html     # Final HTML with injected values
```

## License

MIT
