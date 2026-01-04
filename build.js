const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get branch name from Vercel's environment variable
const branch = process.env.VERCEL_GIT_COMMIT_REF || 'develop';

// Map branch names to environment names
const branchToEnv = {
  'main': 'PRODUCTION',
  'pre-production': 'PRE-PRODUCTION',
  'staging': 'STAGING',
  'develop': 'DEVELOPMENT'
};

// Set environment based on branch
const ENV_NAME = branchToEnv[branch] || 'DEVELOPMENT';
const VERSION = process.env.VERSION || '1.1.0';
const BUILD_NUMBER = process.env.BUILD_NUMBER || '1';

console.log('Detected branch:', branch);
console.log('Mapped to environment:', ENV_NAME);
// Get git commit SHA (if available)
let COMMIT_SHA = 'unknown';
try {
    COMMIT_SHA = execSync('git rev-parse HEAD').toString().trim();
} catch (error) {
    console.warn('Warning: Could not get git commit SHA');
}

// Get current timestamp
const DEPLOY_TIMESTAMP = new Date().toISOString();

console.log('Building with the following configuration:');
console.log('  Environment:', ENV_NAME);
console.log('  Version:', VERSION);
console.log('  Build Number:', BUILD_NUMBER);
console.log('  Commit SHA:', COMMIT_SHA.substring(0, 8));
console.log('  Deploy Timestamp:', DEPLOY_TIMESTAMP);
console.log('');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace template variables
html = html.replace(/\$\{ENV_NAME\}/g, ENV_NAME);
html = html.replace(/\$\{VERSION\}/g, VERSION);
html = html.replace(/\$\{COMMIT_SHA\}/g, COMMIT_SHA);
html = html.replace(/\$\{DEPLOY_TIMESTAMP\}/g, DEPLOY_TIMESTAMP);
html = html.replace(/\$\{BUILD_NUMBER\}/g, BUILD_NUMBER);

// Inject meta tags in the <head> section
const metaTags = `
    <meta name="environment" content="${ENV_NAME}">
    <meta name="version" content="${VERSION}">
    <meta name="build-number" content="${BUILD_NUMBER}">
    <meta name="commit-sha" content="${COMMIT_SHA}">
    <meta name="deploy-timestamp" content="${DEPLOY_TIMESTAMP}">
`;

html = html.replace('</head>', `${metaTags}</head>`);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
    console.log('Created dist/ directory');
}

// Write output to dist/index.html
const outputPath = path.join(distDir, 'index.html');
fs.writeFileSync(outputPath, html, 'utf8');

console.log('Build completed successfully!');
console.log('Output:', outputPath);
console.log('');
console.log('To view the result, open dist/index.html in a browser');
