# English Speaking Mastery Website

A professional, organized website for learning English speaking skills with **dynamically fetched** YouTube videos from **Accent's Way English with Hadar** (@hadar.shemesh).

## Project Structure

```
my-first-website/
├── index.html                  # Main HTML file
├── css/
│   └── style.css              # Notion-style design
├── js/
│   └── script.js              # Dynamic video fetching + functionality
├── assets/                     # For images, icons, etc.
├── README.md                   # This file
├── YOUTUBE-API-SETUP.md       # API key setup guide
└── HOW-TO-UPDATE-VIDEOS.md    # Legacy manual video guide (not needed with API)
```

## Features

- **Dynamic Video Fetching**: Automatically fetches relevant videos from Hadar's channel
- **Notion-inspired Design**: Clean, minimal interface with soft colors
- **6 Learning Topics**: Pronunciation, Phrases, Conversation, Vocabulary, Fluency, Accent
- **Smart Search**: Videos are filtered by topic using intelligent keywords
- **Embedded Video Players**: Watch videos directly on the site
- **Interactive Practice**: Fill-in-the-blank exercises with instant feedback
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Caching System**: Reduces API calls and improves performance

## Quick Start

### Option 1: With Dynamic Videos (Recommended)

1. **Get a YouTube API Key** (free, takes 5 minutes)
   - Follow the guide: [YOUTUBE-API-SETUP.md](YOUTUBE-API-SETUP.md)

2. **Add Your API Key**
   - Open `js/script.js`
   - Line 12: Replace `'YOUR_YOUTUBE_API_KEY_HERE'` with your key
   - Save the file

3. **Open the Website**
   - Double-click `index.html`
   - Videos will automatically load from Hadar's channel!

### Option 2: Without API (Manual)

If you don't want to use the API:
- Videos won't load dynamically
- You'll see a link to visit Hadar's channel directly
- You can manually add video IDs (see HOW-TO-UPDATE-VIDEOS.md)

## How It Works

### Dynamic Video Fetching

The site automatically:
1. Searches Hadar's YouTube channel (@hadar.shemesh)
2. Finds videos matching each topic (pronunciation, fluency, etc.)
3. Displays the 3 most relevant videos per topic
4. Caches results for 1 hour to save API quota
5. Updates content when you switch topics

### Search Keywords by Topic

```javascript
Pronunciation: pronunciation, pronounce, sounds, accent
Phrases: phrases, expressions, idioms, common phrases
Conversation: conversation, speaking, talk, dialogue
Vocabulary: vocabulary, words, vocabulary building
Fluency: fluency, fluent, speak fluently
Accent: accent, accent reduction, american accent
```

## Notion-Style Design

The site uses Notion's exact color palette and design principles:

- **Colors**:
  - Background: Pure white (#ffffff)
  - Text: Dark gray (#37352f)
  - Sidebar: Soft beige (#f7f6f3)
  - Accent: Notion blue (#2383e2)

- **Typography**: System fonts, tight spacing
- **Shadows**: Ultra-subtle, Notion-exact values
- **Interactions**: Smooth 0.15s transitions
- **Scrollbar**: Custom minimal design

## Customization

### Change Channel

To fetch from a different YouTube channel:

1. Open `js/script.js`
2. Lines 15-16, update:
   ```javascript
   CHANNEL_HANDLE: '@new-channel-handle',
   CHANNEL_NAME: "New Channel Name",
   ```

### Change Topic Keywords

To adjust which videos appear for each topic:

1. Open `js/script.js`
2. Find `topicSearchQueries` (line 26)
3. Modify the keywords for any topic

### Change Practice Questions

Edit `topicData` in `js/script.js`:

```javascript
pronunciation: {
    title: "Your Title",
    description: "Your description...",
    practice: {
        question: "Question title",
        prompt: "Your question?",
        answer: "correctanswer",
        tip: "Helpful tip"
    }
}
```

### Change Design Colors

Edit `css/style.css`:
- Notion blue: `#2383e2`
- Dark text: `#37352f`
- Gray text: `#787774`
- Sidebar bg: `#f7f6f3`
- Borders: `#e9e9e7`

## API Usage & Quota

**Free Tier:**
- 10,000 units per day
- Each search = ~100 units
- Caching reduces API calls
- Supports 100+ page loads/day easily

**Monitor Usage:**
- https://console.cloud.google.com/apis/dashboard

**Cost:**
- Free for small websites
- Upgrade available if needed

## Browser Compatibility

Tested and working on:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with ES6+ support

## Troubleshooting

### "API Key not configured" Error
→ See [YOUTUBE-API-SETUP.md](YOUTUBE-API-SETUP.md)
→ Make sure you added your key to `js/script.js` line 12

### Videos Not Loading
1. Check browser console (F12 → Console)
2. Verify API key is correct
3. Ensure YouTube Data API v3 is enabled
4. Check internet connection
5. Try hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

### "Could not find channel" Error
→ The channel lookup failed
→ Check internet connection
→ Clear browser cache
→ Verify channel handle: @hadar.shemesh

### Wrong Videos Appearing
→ Adjust search keywords in `topicSearchQueries`
→ Videos are filtered by channel automatically

### Design Looks Different
→ Clear browser cache
→ Check `css/style.css` is loaded correctly
→ Look for console errors (F12)

## File Explanations

### [index.html](index.html)
Clean HTML structure with Notion-style layout. No inline styles or scripts.

### [css/style.css](css/style.css)
Complete Notion-inspired design system. Includes colors, typography, layout, animations.

### [js/script.js](js/script.js)
- YouTube API integration
- Dynamic video fetching
- Topic switching logic
- Practice exercise checking
- Loading and error states
- Caching system

### [YOUTUBE-API-SETUP.md](YOUTUBE-API-SETUP.md)
Step-by-step guide to get your free YouTube API key from Google Cloud Console.

### [HOW-TO-UPDATE-VIDEOS.md](HOW-TO-UPDATE-VIDEOS.md)
Legacy guide for manually adding video IDs. Not needed if using API.

## Adding More Topics

1. **Add to HTML** (`index.html`):
```html
<li class="topic-item" data-topic="grammar">
    <span class="topic-number">7</span>
    Grammar Rules
</li>
```

2. **Add search keywords** (`js/script.js`):
```javascript
topicSearchQueries: {
    grammar: ['grammar', 'grammar rules', 'english grammar']
}
```

3. **Add topic data** (`js/script.js`):
```javascript
topicData: {
    grammar: {
        title: "Grammar Rules",
        description: "...",
        practice: { ... }
    }
}
```

## Security & Privacy

- API key is visible in client-side code (this is normal)
- Restrict key to your domain in Google Cloud Console
- Monitor usage regularly
- Free tier is sufficient for personal/small sites
- No user data is collected or stored (except local cache)

## Credits

- **Design**: Inspired by [Notion](https://notion.so)
- **Videos**: [Accent's Way English with Hadar](https://www.youtube.com/@hadar.shemesh)
- **YouTube Handle**: @hadar.shemesh
- **API**: YouTube Data API v3

## Future Enhancements

- [ ] Add video thumbnails in search results
- [ ] Implement video progress tracking
- [ ] Add quiz mode with scoring
- [ ] Create downloadable worksheets
- [ ] Add audio pronunciation examples
- [ ] Implement user accounts
- [ ] Add dark mode toggle
- [ ] Support multiple channels
- [ ] Add video bookmarking

## Support

**Questions about the code?**
- Check comments in `js/script.js` and `css/style.css`
- Use browser DevTools (F12) to inspect elements

**API Issues?**
- See [YOUTUBE-API-SETUP.md](YOUTUBE-API-SETUP.md)
- Check Google Cloud Console
- Review API quota usage

**Hadar's Channel:**
- Visit: https://www.youtube.com/@hadar.shemesh
- Channel: Accent's Way English with Hadar

---

**Built with HTML, CSS, and vanilla JavaScript. No frameworks required.**
