# How to Run Your Website

## Why You Need a Local Server

YouTube blocks video embedding when you open HTML files directly (`file://`). You need to serve your website through a local web server (`http://localhost`).

## Method 1: Python (Recommended - Built into Mac)

### Start the Server

1. Open **Terminal**
2. Navigate to your project:
   ```bash
   cd ~/Desktop/my-first-website
   ```
3. Start the server:
   ```bash
   python3 -m http.server 8000
   ```
4. You'll see: `Serving HTTP on :: port 8000 (http://[::]:8000/) ...`

### View Your Website

Open your browser and go to:
```
http://localhost:8000
```

### Stop the Server

Press `Ctrl + C` in Terminal when you're done

---

## Method 2: VS Code Live Server Extension

### One-Time Setup

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X)
3. Search for "Live Server"
4. Install "Live Server" by Ritwick Dey

### Running Your Site

1. Open your project folder in VS Code
2. Right-click on `index.html`
3. Select **"Open with Live Server"**
4. Your browser will open automatically!

### Benefits
- Auto-refreshes when you edit files
- Shows in system tray
- Easy to start/stop

---

## Method 3: Node.js http-server (If You Have Node)

### Install http-server (one time)
```bash
npm install -g http-server
```

### Run Server
```bash
cd ~/Desktop/my-first-website
http-server -p 8000
```

### View Website
Open: http://localhost:8000

---

## Quick Commands

### Start Server (Python)
```bash
cd ~/Desktop/my-first-website && python3 -m http.server 8000
```

### Start Server with Auto-Open (Mac)
```bash
cd ~/Desktop/my-first-website && python3 -m http.server 8000 & sleep 2 && open http://localhost:8000
```

---

## Troubleshooting

### "Address already in use"
Port 8000 is busy. Try a different port:
```bash
python3 -m http.server 8001
# Then open: http://localhost:8001
```

### "python3: command not found"
Try `python` instead:
```bash
python -m http.server 8000
```

### Videos Still Not Loading?
1. Check browser console (Cmd+Option+J)
2. Make sure URL is `http://localhost:8000` (NOT `file://`)
3. Verify API key is in `js/config.js`
4. Clear browser cache (Cmd+Shift+R)

### Can't Access from Phone/Tablet?
Find your computer's IP address:
```bash
ipconfig getifaddr en0
```

Then on your phone, visit:
```
http://YOUR-IP-ADDRESS:8000
```

---

## For Deployment (Making it Public)

Once you're ready to share your website with others:

1. **GitHub Pages** (Free)
   - Push to GitHub repository
   - Enable GitHub Pages in settings
   - Your site will be at: `https://username.github.io/repo-name`

2. **Netlify** (Free, Easiest)
   - Drag and drop your folder to netlify.com
   - Get instant URL: `https://your-site.netlify.app`

3. **Vercel** (Free)
   - Connect GitHub repo
   - Auto-deploys on every push

4. **Custom Domain**
   - Buy domain from Namecheap, GoDaddy, etc.
   - Point it to your hosting service

---

## Daily Workflow

### Development
```bash
# Start server
cd ~/Desktop/my-first-website
python3 -m http.server 8000

# In browser: http://localhost:8000
# Edit files in VS Code
# Refresh browser to see changes
```

### Stopping
```bash
# Press Ctrl+C in Terminal
```

---

## Current Status

✅ Python web server is running on port 8000
✅ Website is accessible at http://localhost:8000
✅ Videos will play correctly
✅ API is configured and working

Enjoy your website! 🎉
