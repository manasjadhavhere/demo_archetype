// AI Specialization Assessment - Professional Version
const state = {
    currentScreen: 'landing',
    currentQuestion: 0,
    answers: [],
    managementScore: 0,
    technicalAnswers: [],
    userData: {},
    specialization: null,
    startTime: null,
    endTime: null,
    totalTime: 0,
    questionStartTime: null,
    questionTimes: [],
    animationInterval: null
};

const config = {
    apiBaseUrl: window.location.origin,
    apiTimeout: 10000
};

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    console.log('App initialized');
    console.log('API Base URL:', config.apiBaseUrl);
    
    // Test API connection
    fetch(`${config.apiBaseUrl}/api/health`)
        .then(res => res.json())
        .then(data => console.log('API Health Check:', data))
        .catch(err => console.error('API Health Check Failed:', err));
    
    initializeApp();
});

function initializeApp() {
    // Start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            soundManager.playClick();
            showScreen('form-screen');
            renderForm();
        });
    }
    
    // Music toggle
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            const enabled = soundManager.toggleMusic();
            musicToggle.classList.toggle('active', enabled);
            soundManager.playClick();
        });
        musicToggle.classList.add('active'); // Start as active
    }
    
    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const enabled = soundManager.toggle();
            soundToggle.classList.toggle('active', enabled);
            soundManager.playClick();
        });
        soundToggle.classList.add('active'); // Start as active
    }
}

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.currentScreen = screenId;
    }
}

// Render form
function renderForm() {
    const formScreen = document.getElementById('form-screen');
    formScreen.innerHTML = `
        <div class="form-container">
            <h2 class="form-title">Let's Get Started</h2>
            <p class="form-subtitle">Just a few quick details</p>

            <form id="assessment-form">
                <div class="form-group">
                    <label for="fullName">Full Name *</label>
                    <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        required 
                        placeholder="Enter your full name"
                        autocomplete="name"
                    >
                </div>

                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        placeholder="your.email@example.com"
                        autocomplete="email"
                    >
                </div>

                <div class="form-group">
                    <label for="phone">Phone Number *</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required 
                        placeholder="+91 98765 43210"
                        autocomplete="tel"
                    >
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="company">Company</label>
                        <input 
                            type="text" 
                            id="company" 
                            name="company" 
                            placeholder="Your company"
                            autocomplete="organization"
                        >
                    </div>

                    <div class="form-group">
                        <label for="designation">Role</label>
                        <input 
                            type="text" 
                            id="designation" 
                            name="designation" 
                            placeholder="Your role"
                            autocomplete="organization-title"
                        >
                    </div>
                </div>

                <button type="submit" class="submit-btn">
                    Start Assessment
                </button>
            </form>
        </div>
    `;

    // Add form submission handler
    setTimeout(() => {
        const form = document.getElementById('assessment-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
            
            // Add input sound effects
            form.querySelectorAll('input').forEach(input => {
                input.addEventListener('focus', () => soundManager.playClick());
            });
        }
    }, 100);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    state.userData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company') || '',
        designation: formData.get('designation') || ''
    };

    // Validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.userData.email)) {
        showNotification('Please enter a valid email address', 'error');
        soundManager.playWarning();
        return;
    }

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(state.userData.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        soundManager.playWarning();
        return;
    }

    soundManager.playSuccess();
    soundManager.playWhoosh();
    startAssessment();
}

// Start Assessment
function startAssessment() {
    state.currentScreen = 'quiz';
    state.currentQuestion = 0;
    state.answers = [];
    state.managementScore = 0;
    state.technicalAnswers = [];
    state.startTime = Date.now(); // Milliseconds
    state.questionTimes = [];

    showScreen('quiz');
    renderQuestion();
}

// Render current question
function renderQuestion() {
    const question = questions[state.currentQuestion];
    const quizScreen = document.getElementById('quiz');
    
    state.questionStartTime = Date.now();

    const progressPercent = ((state.currentQuestion + 1) / questions.length) * 100;
    const questionNumber = state.currentQuestion + 1;

    quizScreen.innerHTML = `
        <div class="quiz-container">
            <div class="quiz-header">
                <div class="progress-info">Question ${questionNumber} of ${questions.length}</div>
                <div class="timer-display" id="timer-display">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                    <span id="timer">${question.timeLimit}</span>s
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            
            <div class="question-content">
                <div class="question-card">
                    <span class="question-type ${question.type}">${question.type === 'management' ? 'Leadership' : 'Technical'}</span>
                    <h2 class="question-text">${question.question}</h2>
                    
                    <div class="options-grid">
                        ${question.options.map((option, index) => `
                            <button class="option-btn" onclick="selectAnswer(${index})" data-index="${index}">
                                ${option.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Start countdown timer
    startTimer(question.timeLimit);
}

// Timer functionality
let timerInterval;
function startTimer(seconds) {
    let timeLeft = seconds;
    const timerElement = document.getElementById('timer');
    const timerDisplay = document.getElementById('timer-display');
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerElement) {
            timerElement.textContent = timeLeft;
            
            // Add warning effects
            if (timeLeft <= 5 && timeLeft > 3) {
                timerDisplay.classList.add('warning');
                soundManager.playTick();
            }
            
            if (timeLeft <= 3) {
                timerDisplay.classList.remove('warning');
                timerDisplay.classList.add('critical');
                soundManager.playTick();
            }
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            soundManager.playWarning();
            selectAnswer(0, true);
        }
    }, 1000);
}

// Handle answer selection
function selectAnswer(optionIndex, isTimeout = false) {
    if (timerInterval) clearInterval(timerInterval);
    
    const question = questions[state.currentQuestion];
    const selectedOption = question.options[optionIndex];
    
    // Play sound
    if (!isTimeout) {
        soundManager.playPowerUp();
    }
    
    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - state.questionStartTime) / 1000);
    state.questionTimes.push(timeTaken);
    
    // Add selection animation
    const selectedBtn = document.querySelector(`.option-btn[data-index="${optionIndex}"]`);
    if (selectedBtn && !isTimeout) {
        selectedBtn.classList.add('selected');
    }

    // Store answer
    state.answers.push({
        questionId: question.id,
        questionType: question.type,
        optionIndex: optionIndex,
        timeTaken: timeTaken,
        isTimeout: isTimeout
    });

    // Update scores
    if (question.type === 'management') {
        state.managementScore += selectedOption.points;
    } else {
        state.technicalAnswers.push({
            specialty: selectedOption.specialty,
            points: selectedOption.points
        });
    }

    // Move to next question or finish
    state.currentQuestion++;

    if (state.currentQuestion < questions.length) {
        setTimeout(() => {
            soundManager.playWhoosh();
            renderQuestion();
        }, isTimeout ? 100 : 600);
    } else {
        state.endTime = Date.now();
        state.totalTime = state.endTime - state.startTime; // Total time in milliseconds
        
        setTimeout(() => {
            determineSpecialization();
            showCongratsAnimation();
        }, 600);
    }
}

// Determine AI specialization
function determineSpecialization() {
    const scores = {
        genai: 0,
        agentic: 0,
        applied: 0,
        mixed: 0
    };
    
    state.technicalAnswers.forEach(answer => {
        if (answer.specialty && scores.hasOwnProperty(answer.specialty)) {
            scores[answer.specialty] += answer.points;
        }
    });
    
    let maxScore = 0;
    let topSpecialty = 'mixed';
    
    for (let specialty in scores) {
        if (scores[specialty] > maxScore) {
            maxScore = scores[specialty];
            topSpecialty = specialty;
        }
    }
    
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    if (sortedScores[0] - sortedScores[1] < 5 || maxScore < 15) {
        topSpecialty = 'mixed';
    }
    
    state.specialization = topSpecialty;
    
    // Auto-fill area of interest
    const specializationMap = {
        genai: 'Generative AI',
        agentic: 'Agentic AI',
        applied: 'Applied AI',
        mixed: 'All AI Domains'
    };
    state.userData.areaOfInterest = specializationMap[topSpecialty];
}

// Show congratulations animation as popup
function showCongratsAnimation() {
    soundManager.playCelebration();
    
    const spec = specializations[state.specialization];
    
    // Create confetti
    createConfetti();
    
    // Create congratulations popup
    const popup = document.createElement('div');
    popup.className = 'congrats-popup';
    popup.innerHTML = `
        <div class="congrats-content">
            <div class="congrats-icon">${spec.icon}</div>
            <h2 class="congrats-title">Congratulations!</h2>
            <p class="congrats-message">You've completed the assessment</p>
            <div class="congrats-loader">
                <div class="loader-bar"></div>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    
    // Wait a moment then show results
    setTimeout(() => {
        popup.remove();
        showResults();
    }, 2500);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#FF4D00', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
        confettiContainer.remove();
    }, 4000);
}

// Show results
function showResults() {
    soundManager.playWhoosh();
    showScreen('result');
    
    const spec = specializations[state.specialization];
    const resultScreen = document.getElementById('result');
    
    // Calculate technical score (10 marks per technical question)
    const technicalScore = state.technicalAnswers.reduce((sum, ans) => sum + ans.points, 0);
    const overallScore = technicalScore * 2; // Convert to 100 scale (50 max * 2 = 100)
    
    resultScreen.innerHTML = `
        <div class="results-container">
            <div class="result-header">
                <div class="result-icon">${spec.icon}</div>
                <h1 class="result-title">${spec.title}</h1>
                <p class="result-subtitle">Your Perfect AI Specialization</p>
            </div>
            
            <div class="overall-score-card">
                <div class="overall-score-label">Your Score</div>
                <div class="overall-score-value">${overallScore} <span class="score-max">out of 100</span></div>
                <div class="score-time">Completed in ${formatTime(state.totalTime)}</div>
            </div>
            
            <div class="result-description">
                <h3>🎯 Your AI Journey</h3>
                <p>${spec.story}</p>
            </div>
            
            <div class="result-description">
                <h3>💪 Your Strengths</h3>
                <ul class="strengths-list">
                    ${spec.strengths.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-description">
                <h3>🚀 Areas to Develop</h3>
                <ul class="improvements-list">
                    ${spec.improvements.map(i => `<li>${i}</li>`).join('')}
                </ul>
                <div class="counselor-message">
                    <p>💬 Want personalized guidance on your AI learning journey? Consider connecting with our expert counselors who can help you choose the right path and accelerate your career growth.</p>
                </div>
            </div>
            
            <div class="action-buttons">
                <a href="/leaderboard" class="action-btn primary">
                    View Leaderboard
                </a>
                <button class="action-btn secondary" onclick="resetAssessment()">
                    Take Again
                </button>
            </div>
        </div>
    `;

    // Save lead data
    saveLeadData();
}

// Save lead data
async function saveLeadData() {
    const technicalScore = state.technicalAnswers.reduce((sum, ans) => sum + ans.points, 0);
    const overallScore = technicalScore * 2; // Convert to 100 scale
    
    const leadData = {
        ...state.userData,
        specialization: state.specialization,
        managementScore: state.managementScore,
        technicalScore: overallScore, // Save as out of 100
        totalTime: state.totalTime, // Save in milliseconds
        answers: state.answers
    };
    
    console.log('Saving lead data:', leadData); // Debug log
    
    try {
        const response = await fetch(`${config.apiBaseUrl}/api/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData),
            timeout: config.apiTimeout
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            console.log('Lead saved successfully:', data);
            return data;
        } else {
            throw new Error(data.error || 'Failed to save lead data');
        }
    } catch (error) {
        console.error('Error saving lead:', error);
        // Show error notification but don't block user experience
        showNotification('Your results are displayed, but there was an issue saving your data. Please contact support if needed.', 'error');
        return null;
    }
}

// Helper functions
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10); // Get centiseconds (2 digits)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

function resetAssessment() {
    if (confirm('Are you sure you want to take the assessment again?')) {
        soundManager.playClick();
        location.reload();
    }
}
