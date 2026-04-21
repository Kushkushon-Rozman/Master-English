// ============================================
// English Speaking Mastery - Dynamic YouTube Integration
// Fetches videos from Accent's Way English with Hadar (@hadar.shemesh)
// ============================================

// Configuration is loaded from js/config.js
// See js/config.example.js for template

// Chapter-specific search queries for finding relevant videos
const chapterSearchQueries = {
    1: ['how to pronounce TH sound', 'TH sound pronunciation', 'voiceless TH voiced TH'],
    2: ['how to pronounce R sound', 'English R sound', 'American R pronunciation'],
    3: ['how to pronounce L sound', 'light L dark L', 'English L pronunciation'],
    4: ['V and W sounds', 'how to pronounce V W', 'difference between V and W'],
    5: ['short i long e vowels', 'ship sheep pronunciation', 'English vowel sounds'],
    6: ['word stress English', 'syllable stress', 'English stress patterns'],
    7: ['intonation English', 'sentence stress', 'English rhythm intonation'],
    8: ['do does grammar', 'present simple do does', 'how to use do and does'],
    9: ['prepositions at on in', 'English prepositions time place', 'at on in usage'],
    10: ['articles a an the', 'English articles', 'when to use the'],
    11: ['make vs do', 'make do difference', 'English collocations make do'],
    12: ['say tell difference', 'speak talk difference', 'say tell speak talk'],
    13: ['present perfect past simple', 'present perfect vs past simple', 'English tenses'],
    14: ['countable uncountable', 'much many few little', 'English quantifiers'],
    15: ['English idioms', 'common expressions', 'everyday idioms phrases'],
    16: ['phrasal verbs', 'English phrasal verbs', 'common phrasal verbs']
};

// Course data - loaded from JSON
let courseData = null;
let allChapters = [];

// Current chapter tracker
let currentChapterId = 1;
let channelId = null;
let videoCache = {};

// Progress tracking - stored in localStorage
let chapterProgress = {};

/**
 * Load course content from JSON file
 */
async function loadCourseData() {
    try {
        const response = await fetch('data/course-content.json');
        if (!response.ok) throw new Error('Failed to load course data');
        courseData = await response.json();
        allChapters = courseData.chapters;
        return courseData;
    } catch (error) {
        console.error('Error loading course data:', error);
        return null;
    }
}

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
 * Fetch videos from Hadar's channel for a specific chapter
 */
async function fetchVideosForTopic(chapterId) {
    // Check if API key is set
    if (CONFIG.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
        return {
            error: true,
            message: 'API Key not configured. Please see YOUTUBE-API-SETUP.md'
        };
    }

    // Check cache
    const cacheKey = `videos_${chapterId}`;
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
        // Get search queries for this specific chapter
        const searchQueries = chapterSearchQueries[chapterId];
        if (!searchQueries) {
            return {
                error: true,
                message: 'No search queries found for this chapter'
            };
        }

        // Search for videos with chapter-specific keywords - fetch 15 to have a good pool
        const searchQuery = searchQueries.join(' OR ');
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?` +
            `part=snippet&channelId=${chId}&` +
            `q=${encodeURIComponent(searchQuery)}&` +
            `type=video&maxResults=15&` +
            `order=relevance&key=${CONFIG.YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Get video IDs
        const videoIds = data.items.map(item => item.id.videoId).join(',');

        // Fetch video statistics to get view counts
        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?` +
            `part=statistics,snippet&id=${videoIds}&` +
            `key=${CONFIG.YOUTUBE_API_KEY}`
        );

        if (!statsResponse.ok) {
            throw new Error(`API Error: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();

        // Transform data with view counts
        const videosWithStats = statsData.items.map(item => ({
            videoId: item.id,
            title: item.snippet.title,
            description: item.snippet.description.substring(0, 100) + '...',
            thumbnail: item.snippet.thumbnails.medium.url,
            viewCount: parseInt(item.statistics.viewCount)
        }));

        // Sort by view count (highest first) and take top 5
        const topVideos = videosWithStats
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, CONFIG.VIDEOS_PER_TOPIC);

        // Cache the results
        videoCache[cacheKey] = {
            data: topVideos,
            timestamp: Date.now()
        };

        return topVideos;
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
 * Load content for selected chapter
 */
async function loadContent(chapterId) {
    if (!courseData) {
        console.error('Course data not loaded');
        return;
    }

    const chapter = allChapters.find(ch => ch.id === chapterId);
    if (!chapter) {
        console.error('Chapter not found:', chapterId);
        return;
    }

    const learningSection = document.getElementById('learning-content');
    const practiceSection = document.getElementById('practice-content');

    // Format learning content with proper line breaks
    const learningHTML = chapter.learning
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('');

    // Format exercises content with proper line breaks
    const exercisesHTML = chapter.exercises
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('');

    // Update learning section with loading state for videos
    learningSection.innerHTML = `
        <div class="chapter-header">
            <h2>${chapter.title}</h2>
        </div>
        <div class="learning-content">
            ${learningHTML}
        </div>
        <div class="videos-section">
            <h3>Video Lessons from ${CONFIG.CHANNEL_NAME}</h3>
            ${createLoadingState()}
        </div>
    `;
    learningSection.classList.add('fade-in');

    // Fetch videos based on specific chapter ID
    const videos = await fetchVideosForTopic(chapter.id);

    // Build Hadar's video HTML
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

    // Update with Hadar's videos first
    learningSection.innerHTML = `
        <div class="chapter-header">
            <h2>${chapter.title}</h2>
        </div>
        <div class="learning-content">
            ${learningHTML}
        </div>
        <div class="videos-section">
            <h3>Video Lessons from ${CONFIG.CHANNEL_NAME}</h3>
            ${videosHTML}
        </div>
        <div class="channel-credit">
            Videos from <a href="https://www.youtube.com/${CONFIG.CHANNEL_HANDLE}" target="_blank">${CONFIG.CHANNEL_NAME}</a> YouTube channel
        </div>
        <div class="videos-section" style="margin-top: 32px;">
            <h3>🌟 Most Viewed Videos on This Topic</h3>
            ${createLoadingState()}
        </div>
    `;

    // Fetch general YouTube videos
    const generalVideos = await fetchGeneralVideos(chapter.id);

    // Build general videos HTML
    let generalVideosHTML = '';
    if (generalVideos.error) {
        generalVideosHTML = createErrorState(generalVideos.message);
    } else {
        generalVideosHTML = `<div class="video-list">`;
        generalVideos.forEach(video => {
            generalVideosHTML += `
                <div class="video-card">
                    <h4>${video.title}</h4>
                    <p style="font-size: 12px; color: #8B7B6C; margin-bottom: 4px;">Channel: ${video.channelTitle}</p>
                    <p>${video.description}</p>
                    ${createYouTubeEmbed(video.videoId)}
                </div>
            `;
        });
        generalVideosHTML += `</div>`;
    }

    // Update learning section with all videos
    learningSection.innerHTML = `
        <div class="chapter-header">
            <h2>${chapter.title}</h2>
        </div>
        <div class="learning-content">
            ${learningHTML}
        </div>
        <div class="videos-section">
            <h3>Video Lessons from ${CONFIG.CHANNEL_NAME}</h3>
            ${videosHTML}
        </div>
        <div class="channel-credit">
            Videos from <a href="https://www.youtube.com/${CONFIG.CHANNEL_HANDLE}" target="_blank">${CONFIG.CHANNEL_NAME}</a> YouTube channel
        </div>
        <div class="videos-section" style="margin-top: 32px;">
            <h3>🌟 Most Viewed Videos on This Topic</h3>
            ${generalVideosHTML}
        </div>
    `;

    // Update practice section (target the content wrapper)
    const practiceWrapper = practiceSection.querySelector('.practice-content-wrapper');
    practiceWrapper.innerHTML = `
        <h2>Practice Exercises</h2>
        <div class="exercises-content">
            ${exercisesHTML}
        </div>
    `;
    practiceWrapper.classList.add('fade-in');

    // Remove animation class after animation completes
    setTimeout(() => {
        learningSection.classList.remove('fade-in');
        practiceWrapper.classList.remove('fade-in');
    }, 200);
}

/**
 * Fetch top videos from all YouTube channels for a specific chapter
 */
async function fetchGeneralVideos(chapterId) {
    // Check if API key is set
    if (CONFIG.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
        return {
            error: true,
            message: 'API Key not configured'
        };
    }

    // Check cache
    const cacheKey = `general_videos_${chapterId}`;
    const cached = videoCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp) < CONFIG.CACHE_DURATION) {
        return cached.data;
    }

    try {
        // Get search queries for this specific chapter
        const searchQueries = chapterSearchQueries[chapterId];
        if (!searchQueries) {
            return { error: true, message: 'No search queries found' };
        }

        // Search for videos across all YouTube - fetch 10 to have a good pool
        const searchQuery = searchQueries.join(' OR ');
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?` +
            `part=snippet&` +
            `q=${encodeURIComponent(searchQuery)}&` +
            `type=video&maxResults=10&` +
            `order=viewCount&key=${CONFIG.YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Get video IDs
        const videoIds = data.items.map(item => item.id.videoId).join(',');

        // Fetch video statistics to get view counts
        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?` +
            `part=statistics,snippet&id=${videoIds}&` +
            `key=${CONFIG.YOUTUBE_API_KEY}`
        );

        if (!statsResponse.ok) {
            throw new Error(`API Error: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();

        // Transform data with view counts
        const videosWithStats = statsData.items.map(item => ({
            videoId: item.id,
            title: item.snippet.title,
            description: item.snippet.description.substring(0, 100) + '...',
            thumbnail: item.snippet.thumbnails.medium.url,
            viewCount: parseInt(item.statistics.viewCount),
            channelTitle: item.snippet.channelTitle
        }));

        // Sort by view count (highest first) and take top 3
        const topVideos = videosWithStats
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 3);

        // Cache the results
        videoCache[cacheKey] = {
            data: topVideos,
            timestamp: Date.now()
        };

        return topVideos;
    } catch (error) {
        console.error('Error fetching general videos:', error);
        return {
            error: true,
            message: error.message
        };
    }
}

/**
 * Get chapter by category for topic mapping
 */
function getChaptersByCategory(category) {
    return allChapters.filter(ch => ch.category === category);
}

/**
 * Load chapter progress from localStorage
 */
function loadProgress() {
    const saved = localStorage.getItem('chapterProgress');
    if (saved) {
        try {
            chapterProgress = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading progress:', e);
            chapterProgress = {};
        }
    }
}

/**
 * Save chapter progress to localStorage
 */
function saveProgress() {
    localStorage.setItem('chapterProgress', JSON.stringify(chapterProgress));
}

/**
 * Update progress for a chapter
 */
function updateProgress(chapterId, step) {
    chapterProgress[chapterId] = step;
    saveProgress();

    // Update UI
    const tracker = document.querySelector(`.progress-tracker[data-chapter="${chapterId}"]`);
    if (tracker) {
        const steps = tracker.querySelectorAll('.progress-step');
        steps.forEach((stepEl, index) => {
            if (index < step) {
                stepEl.classList.add('filled');
            } else {
                stepEl.classList.remove('filled');
            }
        });
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async function() {
    // Add CSS for loading spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .chapter-header {
            margin-bottom: 24px;
        }
        .chapter-number {
            display: inline-block;
            background: #2383e2;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .learning-content, .exercises-content {
            line-height: 1.8;
        }
        .learning-content h3, .exercises-content h3 {
            font-family: 'Poppins', sans-serif;
            color: #7C3AED;
            margin-top: 24px;
            margin-bottom: 12px;
            font-weight: 600;
        }
        .learning-content p, .exercises-content p {
            margin-bottom: 16px;
        }
        .category-group {
            margin-bottom: 24px;
        }
        .category-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #787774;
            padding: 8px 16px;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
        }
    `;
    document.head.appendChild(style);

    // Load course data
    await loadCourseData();

    if (!courseData) {
        document.getElementById('learning-content').innerHTML = `
            <div style="padding: 40px; text-align: center; color: #c93636;">
                <h3>Error Loading Course Content</h3>
                <p>Unable to load the course data. Please refresh the page.</p>
            </div>
        `;
        return;
    }

    // Load saved progress
    loadProgress();

    // Build sidebar with all chapters organized by category
    buildSidebar();

    // Load initial content (first chapter)
    loadContent(currentChapterId);

    // Add click event listeners to all chapter items
    document.querySelectorAll('.topic-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't switch chapters if clicking on progress tracker
            if (e.target.closest('.progress-tracker')) {
                return;
            }

            // Remove active class from all items
            document.querySelectorAll('.topic-item').forEach(t => t.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Load content for this chapter
            const chapterId = parseInt(this.getAttribute('data-chapter'));
            currentChapterId = chapterId;
            loadContent(chapterId);
        });
    });

    // Add click event listeners to progress trackers
    document.querySelectorAll('.progress-tracker').forEach(tracker => {
        tracker.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent chapter selection

            const chapterId = parseInt(this.getAttribute('data-chapter'));

            // Check if reset button was clicked
            if (e.target.closest('.progress-reset')) {
                updateProgress(chapterId, 0);
                return;
            }

            // Check if progress step was clicked
            const step = e.target.closest('.progress-step');
            if (step) {
                const stepNumber = parseInt(step.getAttribute('data-step'));
                updateProgress(chapterId, stepNumber);
            }
        });
    });

    // Add toggle functionality for practice section
    const practiceToggle = document.getElementById('practice-toggle');
    const practiceSection = document.getElementById('practice-content');

    practiceToggle.addEventListener('click', function() {
        practiceSection.classList.toggle('collapsed');

        // Change arrow direction based on collapsed state
        if (practiceSection.classList.contains('collapsed')) {
            practiceToggle.textContent = '▶';
            practiceToggle.setAttribute('title', 'Open Practice Section');
        } else {
            practiceToggle.textContent = '◀';
            practiceToggle.setAttribute('title', 'Close Practice Section');
        }
    });
});

/**
 * Build the sidebar with all chapters organized by category
 */
function buildSidebar() {
    const sidebar = document.querySelector('.topics-sidebar ul');
    sidebar.innerHTML = '';

    const categories = {
        pronunciation: { title: '📢 Pronunciation', chapters: [] },
        grammar: { title: '📝 Grammar', chapters: [] },
        practical: { title: '💬 Practical', chapters: [] }
    };

    // Group chapters by category
    allChapters.forEach(chapter => {
        if (categories[chapter.category]) {
            categories[chapter.category].chapters.push(chapter);
        }
    });

    // Build HTML for each category
    Object.keys(categories).forEach(categoryKey => {
        const category = categories[categoryKey];
        if (category.chapters.length === 0) return;

        // Add category title
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-group';
        categoryDiv.innerHTML = `<div class="category-title">${category.title}</div>`;

        // Add chapters in this category
        category.chapters.forEach(chapter => {
            const li = document.createElement('li');
            li.className = 'topic-item' + (chapter.id === 1 ? ' active' : '');
            li.setAttribute('data-chapter', chapter.id);

            // Get progress for this chapter
            const progress = chapterProgress[chapter.id] || 0;

            li.innerHTML = `
                <div class="topic-item-left">
                    <span class="topic-number">${chapter.id}</span>
                    <span class="topic-title">${chapter.title}</span>
                </div>
                <div class="progress-tracker" data-chapter="${chapter.id}">
                    <div class="progress-reset" data-chapter="${chapter.id}" title="Reset progress">×</div>
                    ${[1, 2, 3, 4, 5].map(step =>
                        `<div class="progress-step${step <= progress ? ' filled' : ''}" data-step="${step}"></div>`
                    ).join('')}
                </div>
            `;
            categoryDiv.appendChild(li);
        });

        sidebar.appendChild(categoryDiv);
    });
}
