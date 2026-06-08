# 🚀 GitHub Deployment Walkthrough: ShadowChat v1111

This guide provides step-by-step instructions for hosting the ShadowChat v1111 Sovereign OS on GitHub.

---

## 🏗️ 1. Hosting the Frontend (GitHub Pages)

The frontend is a high-performance Vite application that can be hosted for free on GitHub Pages.

### **Step-by-Step Instructions:**
1. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
2. **Automated Deployment**:
   - I have already pre-configured the `.github/workflows/deploy.yml` file in your repository.
   - Every time you push to the `main` branch, GitHub will automatically build and deploy the latest version of the Sovereign OS to GitHub Pages.
3. **Access Your Site**:
   - Once the Action finishes, your site will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 🖥️ 2. Hosting the Backend (API & Database)

GitHub Pages only hosts static files. For the full-stack features (Auth, Database, Live Sync), you need a backend host.

### **Recommended Options:**
- **Vercel (Easiest)**: Connect your GitHub repo to Vercel. It will automatically detect the Vite + Express setup and deploy it as a full-stack app.
- **Railway / Render**: High-performance alternatives that support the `pnpm start` command out-of-the-box.
- **Google Cloud Run**: Use the provided `deploy.sh` script to deploy the containerized backend to GCP.

---

## 🛠️ 3. Environment Configuration

To ensure a "no-stress" build, make sure the following secrets are set in your GitHub Repository (**Settings** > **Secrets and variables** > **Actions**):

| Secret Name | Description |
|-------------|-------------|
| `OAUTH_SERVER_URL` | Set to `https://auth.manus.im` |
| `DATABASE_URL` | Your MySQL/TiDB connection string (if using a DB) |
| `VERCEL_TOKEN` | (Optional) For automated Vercel deployment |

---

## 💎 Summary of Automated Scripts
- **`.github/workflows/deploy.yml`**: Handles the heavy lifting of building and deploying.
- **`deploy.sh`**: Your local 1-click tool for manual cloud pushes.
- **`start-prod.sh`**: Your local 1-click tool for testing the production build before pushing.

**ShadowChat v1111 is now engineered for 1-click global dominance.** 🚀🌑💻💎🌍
