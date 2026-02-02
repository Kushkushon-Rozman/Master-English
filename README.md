# Master English

An interactive English learning website featuring dynamic video content from **Accent's Way English with Hadar** (@hadar.shemesh). Built with vanilla HTML, CSS, and JavaScript.

**Live Website:** [https://kushkushon-rozman.github.io/Master-English/](https://kushkushon-rozman.github.io/Master-English/)

## Features

- **Dynamic Video Fetching**: Automatically pulls relevant videos from Hadar's YouTube channel
- **Notion-Inspired Design**: Clean, minimal interface with professional styling
- **6 Learning Topics**: Pronunciation, Phrases, Conversation, Vocabulary, Fluency, and Accent Reduction
- **Interactive Practice**: Fill-in-the-blank exercises for each topic
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smart Caching**: Reduces API calls and improves load times

## Project Structure

```
Master-English/
├── index.html              # Main website structure
├── css/
│   └── style.css          # Notion-style design system
├── js/
│   ├── config.js          # API key configuration
│   ├── config.example.js  # Template for API key
│   └── script.js          # Dynamic video fetching + interactivity
├── assets/                # Images and icons
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## How It Works

1. **Channel Search**: Searches for Hadar's channel using the YouTube Data API v3
2. **Topic-Based Filtering**: Each topic uses specific keywords to find relevant videos
3. **Dynamic Display**: Fetches and displays the 3 most relevant videos per topic
4. **Caching**: Stores results locally for 1 hour to minimize API usage
5. **Instant Updates**: Content updates smoothly when switching between topics

## Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Custom Notion-inspired design with flexbox layout
- **JavaScript ES6+**: Async/await, fetch API, localStorage
- **YouTube Data API v3**: Dynamic video content

## Design Details

Notion-inspired color palette:
- **Background**: Pure white (#ffffff)
- **Text**: Dark gray (#37352f)
- **Sidebar**: Soft beige (#f7f6f3)
- **Accent**: Notion blue (#2383e2)
- **Borders**: Light gray (#e9e9e7)

## Running Locally

Since YouTube blocks video embedding on `file://` URLs, you need to run a local server:

**Python (Mac/Linux):**
```bash
cd ~/Desktop/my-first-website
python3 -m http.server 8000
```

Then open: [http://localhost:8000](http://localhost:8000)

**VS Code:**
- Install "Live Server" extension
- Right-click [index.html](index.html) → "Open with Live Server"

## Configuration

The YouTube API key is stored in [js/config.js](js/config.js):

```javascript
const CONFIG = {
    YOUTUBE_API_KEY: 'your-api-key-here',
    CHANNEL_HANDLE: '@hadar.shemesh',
    CHANNEL_NAME: "Accent's Way English with Hadar",
    VIDEOS_PER_TOPIC: 3,
    CACHE_DURATION: 3600000 // 1 hour
};
```

## Updating Content

### Change the YouTube Channel

Edit [js/config.js](js/config.js):
```javascript
CHANNEL_HANDLE: '@new-channel',
CHANNEL_NAME: "New Channel Name"
```

### Modify Topic Keywords

Edit search queries in [js/script.js](js/script.js):
```javascript
const topicSearchQueries = {
    pronunciation: ['pronunciation', 'sounds', 'accent'],
    // Add or modify keywords for each topic
};
```

### Update Practice Questions

Edit topic data in [js/script.js](js/script.js):
```javascript
const topicData = {
    pronunciation: {
        title: "Your Title",
        description: "Your description",
        practice: {
            question: "Question title",
            prompt: "Your question?",
            answer: "correctanswer"
        }
    }
};
```

## API Usage

**YouTube Data API v3:**
- Free tier: 10,000 units/day
- Each video search: ~100 units
- Caching significantly reduces API calls
- Sufficient for 100+ daily page loads

**Monitor usage:**
[Google Cloud Console](https://console.cloud.google.com/apis/dashboard)

## Browser Compatibility

Works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

**Videos not loading?**
- Check browser console for errors (F12 → Console)
- Verify API key in [js/config.js](js/config.js)
- Ensure you're accessing via `http://` not `file://`
- Try clearing browser cache

**API errors?**
- Check that YouTube Data API v3 is enabled
- Verify API key restrictions in Google Cloud Console
- Check your daily quota usage

## Deployment

The site is deployed on **GitHub Pages** and automatically updates when changes are pushed to the main branch.

**To update the live site:**
1. Make changes to local files
2. Open GitHub Desktop
3. Commit changes with a description
4. Push to GitHub
5. Wait 1-2 minutes for deployment

## Credits

- **Design**: Inspired by [Notion](https://notion.so)
- **Videos**: [Accent's Way English with Hadar](https://www.youtube.com/@hadar.shemesh)
- **API**: YouTube Data API v3

## License

Personal educational project.

---

**Built with vanilla JavaScript. No frameworks, no build tools, no dependencies.**
