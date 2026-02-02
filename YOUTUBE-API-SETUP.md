# YouTube API Setup Guide

This guide will walk you through getting a YouTube Data API key so your website can automatically fetch videos from Hadar's channel (Accent's Way English with Hadar).

## Why Do I Need an API Key?

An API key allows your website to:
- Automatically search for videos from Hadar's channel
- Filter videos by topic (pronunciation, fluency, etc.)
- Display the most relevant videos for each learning section
- Update content dynamically without manual work

## Step-by-Step Instructions

### Step 1: Create a Google Cloud Account

1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account (or create one)
3. Accept the terms of service if prompted

### Step 2: Create a New Project

1. Click the project dropdown at the top of the page
2. Click "New Project"
3. Name it: **"English Learning Website"** (or anything you like)
4. Click "Create"
5. Wait a few seconds for the project to be created
6. Make sure your new project is selected (check the top bar)

### Step 3: Enable YouTube Data API v3

1. In the search bar at the top, type: **"YouTube Data API v3"**
2. Click on the result "YouTube Data API v3"
3. Click the blue **"Enable"** button
4. Wait for it to enable (takes a few seconds)

### Step 4: Create API Credentials

1. After enabling, you'll see a page about the API
2. Click **"Create Credentials"** button (top right)
3. You'll be asked "Which API are you using?"
   - Select: **YouTube Data API v3**
4. "What data will you be accessing?"
   - Select: **Public data**
5. Click **"Next"** or **"What credentials do I need?"**
6. Your API key will be generated!

### Step 5: Copy Your API Key

1. You'll see a screen showing your API key
2. It looks like: `AIzaSyB1234567890abcdefGHIJKLMNOP`
3. Click the **Copy** icon or manually select and copy it
4. **IMPORTANT**: Keep this key safe!

### Step 6: (Optional but Recommended) Restrict Your API Key

For security, you should restrict where your API key can be used:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key in the list and click on it
3. Under "Application restrictions":
   - If testing locally: Choose "None"
   - If deployed online: Choose "HTTP referrers (web sites)" and add your domain
4. Under "API restrictions":
   - Select "Restrict key"
   - Check only "YouTube Data API v3"
5. Click **"Save"**

### Step 7: Add API Key to Your Website

1. Open the file: **`js/script.js`**
2. Find line 12 where it says:
   ```javascript
   YOUTUBE_API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
   ```
3. Replace `YOUR_YOUTUBE_API_KEY_HERE` with your actual API key:
   ```javascript
   YOUTUBE_API_KEY: 'AIzaSyB1234567890abcdefGHIJKLMNOP',
   ```
4. Save the file

### Step 8: Test Your Website

1. Open `index.html` in your browser
2. You should see a loading spinner
3. After a few seconds, videos from Hadar's channel should appear!
4. Click different topics to see different videos load

## Quota Information

YouTube Data API has a free daily quota:
- **10,000 units per day** (free tier)
- Each search costs about **100 units**
- Your site caches results for **1 hour** to save quota
- You can easily support **100+ page loads per day** with the free tier

If you need more quota later, you can request an increase or upgrade to a paid plan.

## Troubleshooting

### "API Key not configured" Error
- Make sure you replaced `YOUR_YOUTUBE_API_KEY_HERE` with your actual key
- Check that there are no extra spaces or quotes
- Make sure you saved the `js/script.js` file

### "API Error: 403" or "API Error: 400"
- Your API key might not be activated yet (wait 5 minutes)
- Make sure YouTube Data API v3 is enabled in your project
- Check that your API key restrictions aren't blocking requests

### No Videos Loading
- Open browser console (F12 → Console tab)
- Check for error messages
- Make sure you have an internet connection
- Try refreshing the page (Cmd+Shift+R / Ctrl+Shift+F5)

### "Could not find channel" Error
- The API might not have found Hadar's channel
- Check your internet connection
- Clear browser cache and try again

### Videos from Wrong Channel
- The code is configured to search specifically for: "Accent's Way English with Hadar"
- It uses channel handle: @hadar.shemesh
- Videos are filtered to only come from her channel

## Privacy & Security Notes

**Is my API key secure?**
- Your API key will be visible in your website's code
- This is normal for public websites
- Google provides free quota that's sufficient for small sites
- You can restrict the key to only work on your domain
- Monitor usage at: https://console.cloud.google.com/apis/dashboard

**Best Practices:**
- Don't share your API key publicly on social media
- Set up application restrictions (HTTP referrers)
- Monitor your quota usage regularly
- If key is compromised, you can delete it and create a new one

## Need Help?

**Google Cloud Console:**
https://console.cloud.google.com/

**YouTube Data API Documentation:**
https://developers.google.com/youtube/v3

**Check API Quota Usage:**
https://console.cloud.google.com/apis/dashboard

**Hadar's YouTube Channel:**
https://www.youtube.com/@hadar.shemesh

---

## Summary Checklist

- [ ] Created Google Cloud account
- [ ] Created new project
- [ ] Enabled YouTube Data API v3
- [ ] Created API credentials
- [ ] Copied API key
- [ ] (Optional) Set up API key restrictions
- [ ] Added API key to `js/script.js` line 12
- [ ] Saved the file
- [ ] Tested website in browser
- [ ] Verified videos are loading from Hadar's channel

Once you've completed these steps, your website will automatically fetch and display relevant videos from Hadar's channel for each topic!
