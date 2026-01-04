const fs = require('fs');
const path = require('path');

// Vercel provides this environment variable with the branch name
const branch = process.env.VERCEL_GIT_COMMIT_REF || 'develop';
const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || 'local';
const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || 'local-build';

// Map branch names to environment names
const branchToEnv = {
  'main': 'PRODUCTION',
  'pre-production': 'PRE-PRODUCTION',
  'staging': 'STAGING',
  'develop': 'DEVELOPMENT'
};

const environment = branchToEnv[branch] || 'DEVELOPMENT';

// Log what we're building (shows in Vercel build logs)
console.log('=================================');
console.log('Building DevOps Learning Dashboard');
console.log('=================================');
console.log('Branch:', branch);
console.log('Environment:', environment);
console.log('Commit:', commitSha.substring(0, 7));
console.log('Deployment ID:', deploymentId);
console.log('=================================');

// Read the template
const templatePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
html = html.replace(/\{\{ENVIRONMENT\}\}/g, environment);
html = html.replace(/\{\{VERSION\}\}/g, '1.0.0');
html = html.replace(/\{\{COMMIT\}\}/g, commitSha.substring(0, 7));
html = html.replace(/\{\{BUILD_NUMBER\}\}/g, deploymentId.substring(0, 8));
html = html.replace(/\{\{DEPLOYED\}\}/g, new Date().toLocaleString());
html = html.replace(/\{\{BRANCH\}\}/g, branch);

// Create dist folder and write output
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

fs.writeFileSync(path.join(distPath, 'index.html'), html);

console.log('Build complete! Output in dist/index.html');
console.log('Environment set to:', environment);