# Quick Guide: How to Update YouTube Videos

## Video ID Reference Table

Open `js/script.js` and replace these placeholder IDs with real Accurate English video IDs:

| Placeholder ID | Topic | Suggested Video Type | Your Video ID |
|----------------|-------|---------------------|---------------|
| PLACEHOLDER_ID_1 | Pronunciation | English Pronunciation Training | _____________ |
| PLACEHOLDER_ID_2 | Pronunciation | Difficult English Words | _____________ |
| PLACEHOLDER_ID_3 | Pronunciation | American Pronunciation | _____________ |
| PLACEHOLDER_ID_4 | Phrases | Essential English Phrases | _____________ |
| PLACEHOLDER_ID_5 | Phrases | English Idioms | _____________ |
| PLACEHOLDER_ID_6 | Phrases | Small Talk Essentials | _____________ |
| PLACEHOLDER_ID_7 | Conversation | Natural Conversations | _____________ |
| PLACEHOLDER_ID_8 | Conversation | Asking Questions | _____________ |
| PLACEHOLDER_ID_9 | Conversation | Active Listening | _____________ |
| PLACEHOLDER_ID_10 | Vocabulary | Essential Vocabulary | _____________ |
| PLACEHOLDER_ID_11 | Vocabulary | Vocabulary in Context | _____________ |
| PLACEHOLDER_ID_12 | Vocabulary | Advanced Vocabulary | _____________ |
| PLACEHOLDER_ID_13 | Fluency | Speak English Fluently | _____________ |
| PLACEHOLDER_ID_14 | Fluency | Stop Translating | _____________ |
| PLACEHOLDER_ID_15 | Fluency | Fluency Exercises | _____________ |
| PLACEHOLDER_ID_16 | Accent | Accent Reduction | _____________ |
| PLACEHOLDER_ID_17 | Accent | Connected Speech | _____________ |
| PLACEHOLDER_ID_18 | Accent | Word Stress & Rhythm | _____________ |

## Step-by-Step Process

### 1. Find a Video on Accurate English

Go to: **https://www.youtube.com/@AccurateEnglish/videos**

### 2. Get the Video ID

When you click a video, the URL looks like:
```
https://www.youtube.com/watch?v=ABC123xyz
                                 ^^^^^^^^^^
                                 This is the Video ID
```

### 3. Copy the Video ID

Example:
- Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Video ID to copy: `dQw4w9WgXcQ`

### 4. Open js/script.js

Find the line with the placeholder:
```javascript
videoId: "PLACEHOLDER_ID_1"
```

### 5. Replace with Real ID

```javascript
videoId: "dQw4w9WgXcQ"
```

### 6. Save and Test

1. Save the file
2. Refresh your browser
3. Check if video loads

## Example: Complete Update

### Before:
```javascript
videos: [
    {
        title: "English Pronunciation Training",
        description: "Learn the 44 sounds of English",
        videoId: "PLACEHOLDER_ID_1"
    }
]
```

### After:
```javascript
videos: [
    {
        title: "English Pronunciation Training",
        description: "Learn the 44 sounds of English",
        videoId: "dQw4w9WgXcQ"
    }
]
```

## Tips

- Write down your video IDs in the table above first
- Update all 18 video IDs
- Don't include the `v=` part, just the ID
- Video IDs are case-sensitive
- No spaces before or after the ID
- Keep the quotes: `"videoId"`

## Testing

After updating all IDs:
1. Open [index.html](index.html)
2. Click each of the 6 topics
3. Verify all 3 videos in each topic load correctly
4. Total: 18 videos should be working

## Troubleshooting

**Video shows black screen?**
- Check that video ID is correct
- Make sure video is public (not private/unlisted)
- Try the video ID in this URL: `https://www.youtube.com/watch?v=YOUR_ID`

**Changed file but nothing happens?**
- Save the file (Cmd+S / Ctrl+S)
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
- Close and reopen the browser

## Where to Edit

- **File to edit:** `js/script.js`
- **Lines to find:** Search for `PLACEHOLDER_ID`
- **Number of replacements:** 18 total

---

Need more help? Check [README.md](README.md) for detailed documentation.
