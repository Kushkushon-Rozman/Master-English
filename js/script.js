// ============================================
// English Speaking Mastery - Dynamic YouTube Integration
// Fetches videos from Accent's Way English with Hadar (@hadar.shemesh)
// ============================================

// Configuration is loaded from js/config.js
// See js/config.example.js for template

// Topic search keywords for finding relevant videos from Hadar's channel
const topicSearchQueries = {
    pronunciation: [
        'pronunciation',
        'pronounce',
        'sounds',
        'accent'
    ],
    phrases: [
        'phrases',
        'expressions',
        'idioms',
        'common phrases'
    ],
    conversation: [
        'conversation',
        'speaking',
        'talk',
        'dialogue'
    ],
    vocabulary: [
        'vocabulary',
        'words',
        'vocabulary building',
        'learn words'
    ],
    fluency: [
        'fluency',
        'fluent',
        'speak fluently',
        'speaking practice'
    ],
    accent: [
        'accent',
        'accent reduction',
        'american accent',
        'clear speech'
    ]
};

// Topic content data structure
const topicData = {
    pronunciation: {
        title: "Basic Pronunciation",
        description: "Master the fundamental sounds of English. Good pronunciation is the foundation of clear communication. Focus on individual sounds, word stress, and intonation patterns to make yourself understood by native speakers.",
        practice: {
            type: "fill-blank",
            question: "Pronunciation Practice",
            prompt: "The 'th' sound in 'think' is pronounced with your tongue between your ____.",
            answer: "teeth",
            tip: "Place your tongue between your teeth and blow air out. This creates the 'th' sound."
        }
    },
    phrases: {
        title: "Common Phrases",
        description: "Learn everyday expressions that native speakers use. These phrases will help you sound more natural and confident in daily conversations. Understanding context and usage is key to effective communication.",
        practice: {
            type: "fill-blank",
            question: "Phrase Practice",
            prompt: "When greeting someone in the morning, we say 'Good ____'.",
            answer: "morning",
            tip: "Common greetings include 'Good morning', 'Good afternoon', and 'Good evening'."
        }
    },
    conversation: {
        title: "Conversation Skills",
        description: "Develop the ability to maintain engaging conversations. Learn how to start conversations, ask questions, show interest, and respond naturally. Practice turn-taking and active listening to become a better conversationalist.",
        practice: {
            type: "fill-blank",
            question: "Conversation Practice",
            prompt: "To show interest in someone's story, you can say '____ me more!'",
            answer: "tell",
            tip: "Phrases like 'Tell me more!', 'Really?', and 'That's interesting!' show you're engaged."
        }
    },
    vocabulary: {
        title: "Vocabulary Building",
        description: "Expand your word bank systematically. A rich vocabulary allows you to express yourself precisely and understand others better. Focus on high-frequency words first, then gradually add specialized vocabulary for your interests.",
        practice: {
            type: "fill-blank",
            question: "Vocabulary Practice",
            prompt: "A person who writes books is called an ____.",
            answer: "author",
            tip: "Common professions: author (writer), doctor, teacher, engineer, chef."
        }
    },
    fluency: {
        title: "Fluency Techniques",
        description: "Speak smoothly and confidently without hesitation. Fluency comes from practice and reducing mental translation. Learn techniques to think in English, use filler words naturally, and maintain your speaking rhythm even when you don't know a word.",
        practice: {
            type: "fill-blank",
            question: "Fluency Practice",
            prompt: "When you need time to think, you can say 'Well, ____ me see...'",
            answer: "let",
            tip: "Filler phrases: 'Let me see...', 'You know...', 'I mean...', 'Actually...' help maintain fluency."
        }
    },
    accent: {
        title: "Accent Reduction",
        description: "Work on specific pronunciation challenges from your native language. While accents are natural and beautiful, reducing a heavy accent can improve clarity. Focus on the sounds that are most different from your native language.",
        practice: {
            type: "fill-blank",
            question: "Accent Practice",
            prompt: "In English, we stress important words. In 'I LOVE pizza', the stressed word is ____.",
            answer: "love",
            tip: "Content words (nouns, verbs, adjectives) are usually stressed. Function words (a, the, is) are usually unstressed."
        }
    }
};

// Current topic tracker
let currentTopic = 'pronunciation';
let channelId = null;
let videoCache = {};

// ==========================================
// YOUTUBE API FUNCTIONS
// ==========================================

/**
 * Get the channel ID from the channel handle
 */
async function getChannelId() {
    if (channelId) return channelId;

    // Check cache first
    const cached = localStorage.getItem('hadar_channel_id');
    if (cached) {
        channelId = cached;
        return channelId;
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(CONFIG.CHANNEL_NAME)}&type=channel&key=${CONFIG.YOUTUBE_API_KEY}`
        );

        if (!response.ok) throw new Error('Failed to fetch channel');

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            channelId = data.items[0].snippet.channelId;
            localStorage.setItem('hadar_channel_id', channelId);
            return channelId;
        }
    } catch (error) {
        console.error('Error fetching channel ID:', error);
        return null;
    }
}

/**
 * Fetch videos from Hadar's channel for a specific topic
 */
async function fetchVideosForTopic(topic) {
    // Check if API key is set
    if (CONFIG.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
        return {
            error: true,
            message: 'API Key not configured. Please see YOUTUBE-API-SETUP.md'
        };
    }

    // Check cache
    const cacheKey = `videos_${topic}`;
    const cached = videoCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp) < CONFIG.CACHE_DURATION) {
        return cached.data;
    }

    // Get channel ID
    const chId = await getChannelId();
    if (!chId) {
        return {
            error: true,
            message: 'Could not find channel'
        };
    }

    try {
        // Search for videos with topic keywords
        const searchQuery = topicSearchQueries[topic].join(' OR ');
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?` +
            `part=snippet&channelId=${chId}&` +
            `q=${encodeURIComponent(searchQuery)}&` +
            `type=video&maxResults=${CONFIG.VIDEOS_PER_TOPIC}&` +
            `order=relevance&key=${CONFIG.YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Transform data into our format
        const videos = data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description.substring(0, 100) + '...',
            thumbnail: item.snippet.thumbnails.medium.url
        }));

        // Cache the results
        videoCache[cacheKey] = {
            data: videos,
            timestamp: Date.now()
        };

        return videos;
    } catch (error) {
        console.error('Error fetching videos:', error);
        return {
            error: true,
            message: error.message
        };
    }
}

// ==========================================
// UI FUNCTIONS
// ==========================================

/**
 * Create YouTube embed iframe
 */
function createYouTubeEmbed(videoId) {
    return `
        <div class="video-embed">
            <iframe
                src="https://www.youtube.com/embed/${videoId}"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
            </iframe>
        </div>
    `;
}

/**
 * Create loading state HTML
 */
function createLoadingState() {
    return `
        <div style="text-align: center; padding: 40px; color: #787774;">
            <div class="loading-spinner" style="
                border: 3px solid #e9e9e7;
                border-top: 3px solid #2383e2;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            "></div>
            <p>Loading videos from ${CONFIG.CHANNEL_NAME}...</p>
        </div>
    `;
}

/**
 * Create error state HTML
 */
function createErrorState(message) {
    return `
        <div style="
            padding: 20px;
            background-color: rgba(235, 87, 87, 0.1);
            border: 1px solid rgba(235, 87, 87, 0.2);
            border-radius: 6px;
            color: #37352f;
        ">
            <h4 style="margin-bottom: 8px; color: #c93636;">Unable to Load Videos</h4>
            <p style="font-size: 14px; color: #787774; margin-bottom: 12px;">${message}</p>
            <p style="font-size: 13px; color: #787774;">
                Please check the <a href="YOUTUBE-API-SETUP.md" style="color: #2383e2;">setup guide</a>
                or use the fallback links below.
            </p>
        </div>
        <div style="margin-top: 16px;">
            <a href="https://www.youtube.com/${CONFIG.CHANNEL_HANDLE}"
               target="_blank"
               style="
                   display: inline-block;
                   padding: 8px 16px;
                   background-color: #2383e2;
                   color: white;
                   text-decoration: none;
                   border-radius: 4px;
                   font-size: 13px;
               ">
                Visit ${CONFIG.CHANNEL_NAME} on YouTube
            </a>
        </div>
    `;
}

/**
 * Load content for selected topic
 */
async function loadContent(topic) {
    const data = topicData[topic];
    const learningSection = document.getElementById('learning-content');
    const practiceSection = document.getElementById('practice-content');

    // Show loading state
    learningSection.innerHTML = `
        <h2>${data.title}</h2>
        <p class="description">${data.description}</p>
        <div class="videos-section">
            <h3>Video Lessons from ${CONFIG.CHANNEL_NAME}</h3>
            ${createLoadingState()}
        </div>
    `;

    // Fetch videos
    const videos = await fetchVideosForTopic(topic);

    // Build video HTML
    let videosHTML = '';
    if (videos.error) {
        videosHTML = createErrorState(videos.message);
    } else {
        videosHTML = `<div class="video-list">`;
        videos.forEach(video => {
            videosHTML += `
                <div class="video-card">
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                    ${createYouTubeEmbed(video.videoId)}
                </div>
            `;
        });
        videosHTML += `</div>`;
    }

    // Update content
    learningSection.innerHTML = `
        <h2>${data.title}</h2>
        <p class="description">${data.description}</p>
        <div class="videos-section">
            <h3>Video Lessons from ${CONFIG.CHANNEL_NAME}</h3>
            ${videosHTML}
        </div>
        <div class="channel-credit">
            All videos from <a href="https://www.youtube.com/${CONFIG.CHANNEL_HANDLE}" target="_blank">${CONFIG.CHANNEL_NAME}</a> YouTube channel
        </div>
    `;
    learningSection.classList.add('fade-in');

    // Load practice content
    const practiceId = `practice-${topic}`;
    practiceSection.innerHTML = `
        <h2>Practice</h2>
        <div class="practice-card">
            <h4>${data.practice.question}</h4>
            <p>${data.practice.prompt}</p>
            <input type="text" id="${practiceId}" placeholder="Type your answer here...">
            <button class="btn btn-small" onclick="checkAnswer('${topic}')">Check Answer</button>
            <div id="feedback-${topic}" class="answer-feedback"></div>
        </div>
        <div class="tip-card">
            <strong>💡 Tip:</strong> ${data.practice.tip}
        </div>
    `;
    practiceSection.classList.add('fade-in');

    // Remove animation class after animation completes
    setTimeout(() => {
        learningSection.classList.remove('fade-in');
        practiceSection.classList.remove('fade-in');
    }, 200);
}

/**
 * Check practice answers
 */
function checkAnswer(topic) {
    const data = topicData[topic];
    const input = document.getElementById(`practice-${topic}`);
    const feedback = document.getElementById(`feedback-${topic}`);
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = data.practice.answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        feedback.className = 'answer-feedback correct';
        feedback.textContent = '✓ Correct! Great job!';
    } else {
        feedback.className = 'answer-feedback incorrect';
        feedback.textContent = `✗ Not quite. The answer is: ${data.practice.answer}`;
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for loading spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Load initial content
    loadContent(currentTopic);

    // Add click event listeners to all topic items
    document.querySelectorAll('.topic-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            document.querySelectorAll('.topic-item').forEach(t => t.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Load content for this topic
            const topic = this.getAttribute('data-topic');
            currentTopic = topic;
            loadContent(topic);
        });
    });

    // Allow Enter key to submit answers
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.type === 'text') {
            checkAnswer(currentTopic);
        }
    });
});

// Export functions for inline onclick handlers
window.checkAnswer = checkAnswer;
