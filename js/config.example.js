// ============================================
// Configuration File Template
// ============================================
//
// INSTRUCTIONS:
// 1. Copy this file and rename it to: config.js
// 2. Replace 'YOUR_YOUTUBE_API_KEY_HERE' with your actual API key
// 3. See YOUTUBE-API-SETUP.md for instructions on getting an API key
//

const CONFIG = {
    // YouTube Data API v3 Key
    // Get your key from: https://console.cloud.google.com/apis/credentials
    YOUTUBE_API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',

    // Channel information for Accent's Way English with Hadar
    CHANNEL_HANDLE: '@hadar.shemesh',
    CHANNEL_NAME: "Accent's Way English with Hadar",

    // Number of videos to fetch per topic
    VIDEOS_PER_TOPIC: 3,

    // Cache duration in milliseconds (1 hour)
    CACHE_DURATION: 3600000
};
