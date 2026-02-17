// Professional Sound Manager with Background Music
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.4;
        this.backgroundMusic = null;
        this.musicEnabled = true;
        this.init();
    }

    init() {
        // Try immediately
        setTimeout(() => this.tryInitAudio(), 100);
        
        // Try on various events
        const events = ['click', 'touchstart', 'keydown', 'scroll'];
        events.forEach(event => {
            document.addEventListener(event, () => this.tryInitAudio(), { once: true });
        });
        
        // Try on window load
        window.addEventListener('load', () => this.tryInitAudio());
        
        // Try on DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.tryInitAudio());
        } else {
            this.tryInitAudio();
        }
    }

    tryInitAudio() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('Audio context created');
            } catch (e) {
                console.log('Audio context creation failed:', e);
            }
        }
        
        if (!this.backgroundMusic) {
            this.initBackgroundMusic();
        } else if (this.backgroundMusic.paused && this.musicEnabled) {
            this.backgroundMusic.play().catch(() => {});
        }
    }

    initBackgroundMusic() {
        this.backgroundMusic = document.getElementById('background-music');
        if (this.backgroundMusic && this.musicEnabled) {
            this.backgroundMusic.volume = 0.25; // Audible volume
            this.backgroundMusic.loop = true;
            
            // Try to play immediately
            const playPromise = this.backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Music started successfully');
                    })
                    .catch(e => {
                        console.log('Autoplay prevented, will retry on interaction');
                        // Retry on any interaction
                        const retryEvents = ['click', 'touchstart', 'keydown'];
                        retryEvents.forEach(event => {
                            document.addEventListener(event, () => {
                                if (this.backgroundMusic.paused) {
                                    this.backgroundMusic.play()
                                        .then(() => console.log('Music started after interaction'))
                                        .catch(() => {});
                                }
                            }, { once: true });
                        });
                    });
            }
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.backgroundMusic) {
            if (this.musicEnabled) {
                this.backgroundMusic.play();
            } else {
                this.backgroundMusic.pause();
            }
        }
        return this.musicEnabled;
    }

    // Enhanced Click Sound - More satisfying
    playClick() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
        
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        
        gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Enhanced Success Sound - Triumphant chord
    playSuccess() {
        if (!this.enabled || !this.audioContext) return;
        
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (major chord)
        notes.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            filter.type = 'lowpass';
            filter.frequency.value = 3000;
            
            const startTime = this.audioContext.currentTime + (i * 0.08);
            gainNode.gain.setValueAtTime(this.volume * 0.25, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.5);
        });
    }

    // Enhanced Warning Sound - Urgent beep
    playWarning() {
        if (!this.enabled || !this.audioContext) return;
        
        for (let i = 0; i < 2; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.value = 440;
            
            const startTime = this.audioContext.currentTime + (i * 0.15);
            gainNode.gain.setValueAtTime(this.volume * 0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.1);
        }
    }

    // Enhanced Celebration Sound - Victory fanfare
    playCelebration() {
        if (!this.enabled || !this.audioContext) return;
        
        // Ascending scale
        const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
        notes.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            filter.type = 'lowpass';
            filter.frequency.value = 4000;
            
            const startTime = this.audioContext.currentTime + (i * 0.06);
            gainNode.gain.setValueAtTime(this.volume * 0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });

        // Add bass drum hits
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
                
                const startTime = this.audioContext.currentTime + (i * 0.2);
                gainNode.gain.setValueAtTime(this.volume * 0.5, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.1);
            }
        }, 100);
    }

    // Enhanced Tick Sound - Subtle clock tick
    playTick() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 1500;
        
        gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.03);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.03);
    }

    // Enhanced Whoosh Sound - Smooth transition
    playWhoosh() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.4);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(this.volume * 0.25, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    // Power-up sound for correct answers
    playPowerUp() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    // Toggle sound effects on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Set volume (0-1)
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = soundManager;
}
