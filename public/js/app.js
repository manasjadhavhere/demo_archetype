// Application State
const state = {
    currentScreen: 'landing', // landing, quiz, form, result
    currentQuestion: 0,
    answers: [],
    scores: { architect: 0, commander: 0, pioneer: 0, catalyst: 0 },
    userData: {},
    archetype: null
};

// Configuration
const config = {
    apiBaseUrl: window.location.origin, // Use current origin for API calls
    apiTimeout: 10000 // 10 seconds
};

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    // Show instructions modal on page load
    showInstructions();
});

function initializeApp() {
    // Set up event listeners
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startAssessment);
    }
}

// Show instructions modal
function showInstructions() {
    const overlay = document.getElementById('instructions-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

// Close instructions modal
function closeInstructions() {
    const overlay = document.getElementById('instructions-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

// Start Assessment (Step 1 → Step 2)
function startAssessment() {
    state.currentScreen = 'quiz';
    state.currentQuestion = 0;
    state.answers = [];
    state.scores = { architect: 0, commander: 0, pioneer: 0, catalyst: 0 };

    document.getElementById('landing').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');

    renderQuestion();
}

// Render current question (Step 2)
function renderQuestion() {
    const question = questions[state.currentQuestion];
    const quizContainer = document.getElementById('quiz');

    const progressPercent = ((state.currentQuestion + 1) / questions.length) * 100;

    quizContainer.innerHTML = `
    <div class="quiz-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progressPercent}%"></div>
      </div>
      <div class="progress-text">Question ${state.currentQuestion + 1} of ${questions.length}</div>
      
      <div class="question-emoji">${question.emoji}</div>
      <h2 class="question-text">${question.question}</h2>
      
      <div class="options-container">
        ${question.options.map((option, index) => `
          <button class="option-btn" onclick="selectAnswer(${index})">
            ${option.text}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// Handle answer selection (Step 2)
function selectAnswer(optionIndex) {
    const question = questions[state.currentQuestion];
    const selectedOption = question.options[optionIndex];

    // Add selection animation
    const selectedBtn = event.target.closest('.option-btn');
    if (selectedBtn) {
        selectedBtn.style.background = 'linear-gradient(to right, #10B981 0%, #059669 100%)';
        selectedBtn.style.color = 'white';
        selectedBtn.style.borderColor = '#10B981';
        selectedBtn.innerHTML = '✓ ' + selectedBtn.textContent;
    }

    // Store answer
    state.answers.push({
        questionId: question.id,
        optionIndex: optionIndex
    });

    // Update scores
    for (let archetype in selectedOption.weights) {
        state.scores[archetype] += selectedOption.weights[archetype];
    }

    // Move to next question or show blurred results
    state.currentQuestion++;

    if (state.currentQuestion < questions.length) {
        setTimeout(() => renderQuestion(), 400);
    } else {
        // Quiz complete - determine archetype and show blurred preview
        determineArchetype();
        setTimeout(() => {
            showBlurredResults();
        }, 400);
    }
}

// Determine archetype based on scores (Step 3)
function determineArchetype() {
    let maxScore = 0;
    let resultArchetype = 'architect';

    for (let archetype in state.scores) {
        if (state.scores[archetype] > maxScore) {
            maxScore = state.scores[archetype];
            resultArchetype = archetype;
        }
    }

    state.archetype = resultArchetype;
}

// Show blurred results preview with form below
function showBlurredResults() {
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');

    const archetypeData = archetypes[state.archetype];

    // Render blurred result section with form below
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `
    <div class="result-container blurred">
      <div class="result-header">
        <div class="archetype-icon">${archetypeData.icon}</div>
        <h1 class="archetype-title">Your Archetype: ${archetypeData.title}</h1>
      </div>
      
      <div class="result-content">
        <div class="insight-card">
          <h3>💪 Your Strength</h3>
          <p>${archetypeData.strength}</p>
        </div>
        
        <div class="insight-card">
          <h3>🎯 Growth Gap</h3>
          <p>${archetypeData.gap}</p>
        </div>
        
        <div class="insight-card highlight">
          <h3>🚀 Growth Unlock Path</h3>
          <p>${archetypeData.unlockPath}</p>
        </div>
      </div>
      
      <div class="programs-section">
        <h2 class="section-title">Recommended Programs for You</h2>
        <div class="programs-grid">
          ${archetypeData.programs.map(program => `
            <div class="program-card">
              <h3 class="program-name">${program.name}</h3>
              <p class="program-benefit">${program.benefit}</p>
              <button class="cta-btn" onclick="bookCareerCall('${program.name}')">
                ${program.cta}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Form Section Below Blurred Results -->
    <div class="form-section" id="form-section">
      <div class="form-container">
        <h2 class="form-title">🎉 Almost There!</h2>
        <p class="form-subtitle">Enter your details to unlock your personalized archetype results</p>

        <form id="lead-form-reveal">
          <div class="form-row">
            <div class="form-group">
              <label for="fullName">Full Name *</label>
              <input type="text" id="fullName" name="fullName" required placeholder="Enter your full name" autocomplete="name">
            </div>

            <div class="form-group">
              <label for="designation">Current Designation</label>
              <input type="text" id="designation" name="designation" placeholder="e.g., Senior Manager" autocomplete="organization-title">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="company">Company Name</label>
              <input type="text" id="company" name="company" placeholder="Enter your company name" autocomplete="organization">
            </div>

            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" required 
                     placeholder="+91 98765 43210"
                     autocomplete="tel">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input type="email" id="email" name="email" required 
                     placeholder="your.email@company.com"
                     autocomplete="email">
            </div>

            <div class="form-group">
              <label for="areaOfInterest">Area of Interest *</label>
              <select id="areaOfInterest" name="areaOfInterest" required>
                <option value="">Select your area of interest</option>
                <option value="Executive MBA">Executive MBA</option>
                <option value="DBA">Doctor of Business Administration (DBA)</option>
                <option value="Leadership Programs">Leadership & Management Programs</option>
                <option value="Operations">Operations & Supply Chain</option>
                <option value="Innovation">Innovation & Entrepreneurship</option>
                <option value="HR">HR & Organizational Behavior</option>
                <option value="Technology">Technology Management</option>
                <option value="General">General Inquiry</option>
              </select>
            </div>
          </div>

          <button type="submit" class="submit-btn">
            <span class="btn-text">🔓 Unlock My Results</span>
          </button>
        </form>
      </div>
    </div>
  `;

    // Add form submission handler
    setTimeout(() => {
        const form = document.getElementById('lead-form-reveal');
        if (form) {
            form.addEventListener('submit', handleFormSubmitReveal);
        }
    }, 100);
}

// Handle form submission from reveal form (Step 4)
async function handleFormSubmitReveal(e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.target);
    state.userData = {
        fullName: formData.get('fullName'),
        designation: formData.get('designation') || '',
        company: formData.get('company') || '',
        phone: formData.get('phone'),
        email: formData.get('email'),
        areaOfInterest: formData.get('areaOfInterest')
    };

    // Validate phone number (more flexible)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(state.userData.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }

    // Validate email (simple but effective)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.userData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    btnText.textContent = '⏳ Submitting...';
    submitBtn.disabled = true;

    try {
        // Save lead data to backend
        await saveLeadData();

        // Show success notification
        showNotification('✅ Success! Revealing your results...', 'success');

        // Remove blur and hide form
        setTimeout(() => {
            revealResults();
        }, 800);
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('❌ Error submitting. Please try again.', 'error');
        btnText.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Reveal results by removing blur and hiding form
function revealResults() {
    const resultContainer = document.querySelector('.result-container');
    const formSection = document.getElementById('form-section');
    
    if (resultContainer) {
        resultContainer.classList.remove('blurred');
        resultContainer.classList.add('revealed');
    }
    
    if (formSection) {
        formSection.style.opacity = '0';
        formSection.style.transform = 'translate(-50%, -45%)';
        setTimeout(() => {
            formSection.style.display = 'none';
        }, 300);
    }

    // Scroll to top of results smoothly after form disappears
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);

    // Add reset button at the bottom
    setTimeout(() => {
        const programsSection = document.querySelector('.programs-section');
        if (programsSection && !document.querySelector('.reset-section')) {
            const resetSection = document.createElement('div');
            resetSection.className = 'reset-section';
            resetSection.innerHTML = '<button class="reset-btn" onclick="resetAssessment()">🔄 Take Assessment Again</button>';
            programsSection.after(resetSection);
        }
    }, 800);
}

// Save lead data to backend
async function saveLeadData() {
    try {
        const response = await fetch(`${config.apiBaseUrl}/api/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...state.userData,
                archetype: state.archetype,
                scores: state.scores
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to save lead data');
        }

        console.log('Lead saved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error saving lead:', error);
        throw error; // Re-throw to be caught by handleFormSubmit
    }
}

// Book career call handler
function bookCareerCall(programName) {
    const message = `Thank you for your interest in ${programName}!\n\nOur career counselor will contact you at ${state.userData.phone} within 24 hours.\n\nEmail confirmation sent to: ${state.userData.email}`;
    
    // Show a more professional confirmation
    if (confirm(message + '\n\nWould you like to take the assessment again?')) {
        resetAssessment();
    }
}

// Reset assessment
function resetAssessment() {
    // Reset state
    state.currentScreen = 'landing';
    state.currentQuestion = 0;
    state.answers = [];
    state.scores = { architect: 0, commander: 0, pioneer: 0, catalyst: 0 };
    state.userData = {};
    state.archetype = null;

    // Reset UI
    document.getElementById('result').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
}
