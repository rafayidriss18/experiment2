// DOM Elements
const watchingScreen = document.getElementById('watchingScreen');
const sherryProfile = document.getElementById('sherryProfile');
const dashboard = document.getElementById('dashboard');
const montageVideo = document.getElementById('montageVideo');
const backgroundMusic = document.getElementById('backgroundMusic');
const playButton = document.getElementById('playButton');

// State
let isAudioPlaying = false;
let isDashboardVisible = false;

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    sherryProfile.addEventListener('click', handleProfileClick);
    playButton.addEventListener('click', handlePlayButtonClick);
    document.addEventListener('keydown', handleKeyPress);
    montageVideo.addEventListener('error', handleVideoError);
    backgroundMusic.addEventListener('error', handleAudioError);
}

/**
 * Handle profile click - transition to dashboard
 */
function handleProfileClick() {
    console.log('Profile clicked');
    
    // Add click animation
    sherryProfile.classList.add('clicked');
    
    // Start music after a short delay
    setTimeout(() => {
        startBackgroundMusic();
    }, 300);
    
    // Show dashboard after screen fade
    setTimeout(() => {
        showDashboard();
    }, 2500);
}

/**
 * Start background music playback
 */
function startBackgroundMusic() {
    console.log('Starting background music');
    
    // Try to play music with error handling
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Background music playing');
                isAudioPlaying = true;
            })
            .catch(error => {
                console.warn('Autoplay prevented for music:', error);
                // Music will start when user clicks play button
            });
    }
}

/**
 * Show the dashboard and play video
 */
function showDashboard() {
    console.log('Showing dashboard');
    
    dashboard.classList.add('visible');
    isDashboardVisible = true;
    
    // Ensure video is ready
    if (montageVideo.readyState >= 2) {
        // Video is ready
        playVideoIfReady();
    } else {
        // Wait for video to be ready
        montageVideo.addEventListener('canplay', playVideoIfReady, { once: true });
    }
}

/**
 * Play video when it's ready
 */
function playVideoIfReady() {
    console.log('Video ready state:', montageVideo.readyState);
    
    const playPromise = montageVideo.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Video playing');
            })
            .catch(error => {
                console.warn('Video playback error:', error);
            });
    }
}

/**
 * Handle play button click - unmute audio/video
 */
function handlePlayButtonClick() {
    console.log('Play button clicked');
    
    // Unmute video
    montageVideo.muted = false;
    
    // Play background music if not already playing
    if (!isAudioPlaying) {
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    isAudioPlaying = true;
                    console.log('Music started from play button');
                })
                .catch(error => {
                    console.warn('Music playback error:', error);
                });
        }
    }
    
    // Update button state
    playButton.classList.add('unmuted');
    playButton.disabled = true;
    playButton.style.opacity = '0.7';
    
    // Re-enable after animation
    setTimeout(() => {
        playButton.disabled = false;
        playButton.style.opacity = '1';
        playButton.textContent = '▶ Playing';
    }, 300);
}

/**
 * Handle keyboard events
 */
function handleKeyPress(event) {
    if (!isDashboardVisible) return;
    
    // Space bar to toggle mute
    if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        
        const currentMuted = montageVideo.muted;
        montageVideo.muted = !currentMuted;
        
        if (!currentMuted) {
            // Was unmuted, now muting
            backgroundMusic.pause();
            isAudioPlaying = false;
            playButton.classList.remove('unmuted');
            playButton.textContent = '▶ Play';
        } else {
            // Was muted, now unmuting
            handlePlayButtonClick();
        }
    }
}

/**
 * Handle video loading errors
 */
function handleVideoError(error) {
    console.error('Video error:', error);
    console.warn('Make sure montage.mp4 is in the same directory as index.html');
}

/**
 * Handle audio loading errors
 */
function handleAudioError(error) {
    console.error('Audio error:', error);
    console.warn('Make sure song.mp3 is in the same directory as index.html');
}

/**
 * Mobile optimization - ensure video plays on tap
 */
function optimizeForMobile() {
    if ('ontouchstart' in window) {
        // Add touch event to ensure video plays on mobile
        document.addEventListener('touchstart', () => {
            if (isDashboardVisible && montageVideo.paused) {
                montageVideo.play().catch(err => {
                    console.warn('Could not play video on touch:', err);
                });
            }
        }, { once: true });
    }
}

/**
 * Initialize page
 */
function init() {
    console.log('Netflix Surprise Website Initialized');
    
    // Set video source to the one from GitHub
    montageVideo.src = 'https://github.com/rafayidriss18/experiment2/raw/main/final_edit.mp4';
    
    // Preload video
    montageVideo.preload = 'metadata';
    
    initializeEventListeners();
    optimizeForMobile();
    
    // Log media file paths for debugging
    console.log('Video source:', montageVideo.src);
    console.log('Audio source:', backgroundMusic.firstElementChild?.src);
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Cleanup and logging
window.addEventListener('beforeunload', () => {
    console.log('Cleaning up...');
    montageVideo.pause();
    backgroundMusic.pause();
});
