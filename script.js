document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const examInitiationArea = document.getElementById('exam-initiation');
    const startExamButton = document.getElementById('start-exam-btn');
    const examArea = document.getElementById('exam-area');
    const examContainer = document.getElementById('exam-container');
    const submitButton = document.getElementById('submit-btn');
    const resultsContainer = document.getElementById('results-container');
    const scoreDisplay = document.getElementById('score');
    const feedbackArea = document.getElementById('feedback-area');
    const timerDisplay = document.getElementById('time');
    const restartButton = document.getElementById('restart-btn');
    const currentDateDisplay = document.getElementById('current-date');

    // --- Exam State ---
    let allQuestions = []; // Will be populated from JSON
    let currentQuestions = [];
    let timerInterval;
    let timeLeft = 0; // seconds

    // --- Set Current Date ---
    const today = new Date();
    if (currentDateDisplay) {
        currentDateDisplay.textContent = today.toLocaleDateString('en-GB', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // --- Helper Function to Escape HTML ---
    function escapeHTML(unsafeText) {
        if (typeof unsafeText !== 'string') {
            return unsafeText === null || typeof unsafeText === 'undefined' ? '' : String(unsafeText);
        }
        return unsafeText
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // --- Function to Load Questions from JSON ---
    async function loadQuestions() {
        if (startExamButton) {
            startExamButton.disabled = true;
            startExamButton.textContent = "Loading Questions...";
        }
        try {
            const response = await fetch('questions.json'); // Assumes questions.json is in the same directory
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - Could not fetch questions.json`);
            }
            allQuestions = await response.json();
            console.log('Successfully loaded questions from JSON. Total questions:', allQuestions.length);

            if (allQuestions.length === 0) {
                throw new Error("No questions found in questions.json or the file is empty.");
            }

            if (startExamButton) {
                startExamButton.disabled = false;
                startExamButton.textContent = "Start Mock Exam";
            }
        } catch (error) {
            console.error("Error loading or parsing questions.json:", error);
            if (examContainer) examContainer.innerHTML = `<p style='color:red;'>Error: Could not load exam questions. Please check the console and ensure 'questions.json' exists, is valid, and is not empty.</p>`;
            if (examInitiationArea && !startExamButton) { // If start button itself was not found, show message in initiation area
                examInitiationArea.innerHTML = `<p style='color:red;'>Error loading questions. Start button not found.</p>`;
            } else if (startExamButton) {
                startExamButton.textContent = "Error Loading Questions";
                startExamButton.disabled = true;
            }
             // Hide exam area if it was prematurely shown
            if (examArea) examArea.style.display = 'none';
            if (examInitiationArea) examInitiationArea.style.display = 'block';
        }
    }

    // --- Helper Functions (shuffle, formatTime, startTimer) ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer(duration) {
        timeLeft = duration;
        if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if (timerDisplay) timerDisplay.textContent = "Time's Up!";
                if (submitButton) submitButton.disabled = true;
                alert("Time's up! Your answers (if any) will be processed.");
                handleSubmit();
            }
        }, 1000);
    }

    // --- renderQuestions function ---
    function renderQuestions() {
        if (!examContainer) {
            console.error("renderQuestions: examContainer is null!");
            return;
        }
        console.log('renderQuestions called. Expected number of questions:', currentQuestions.length);
        examContainer.innerHTML = '';
        let questionHTML = '';
        try {
            currentQuestions.forEach((q, index) => {
                questionHTML += `<div class="question-card" id="question-${index}">`;
                questionHTML += `<p class="question-number">Question ${index + 1} of ${currentQuestions.length}</p>`;
                questionHTML += `<p class="question-text">${escapeHTML(q.text)}</p>`;

                if (q.code) {
                    const escapedCode = q.code ? escapeHTML(q.code) : '';
                    questionHTML += `<pre class="code-block"><code>${escapedCode}</code></pre>`;
                }

                questionHTML += `<div class="options-container">`;
                if (q.options && (q.type === 'multiple-choice' || q.type === 'code-snippet')) {
                    q.options.forEach((opt) => {
                        questionHTML += 
                            `<label>` +
                                `<input type="radio" name="question${q.id}" value="${escapeHTML(opt.text)}"> ` +
                                `${escapeHTML(opt.text)}` +
                            `</label>`;
                    });
                } else if (q.options && q.type === 'multiple-select') {
                    q.options.forEach((opt) => {
                        questionHTML += 
                            `<label>` +
                                `<input type="checkbox" name="question${q.id}" value="${escapeHTML(opt.text)}" data-option-id="${opt.id}">` +
                                ` ${escapeHTML(opt.text)}` +
                            `</label>`;
                    });
                }
                questionHTML += `</div>`; // options-container
                questionHTML += `<div class="explanation" style="display:none;"><p><strong>Explanation:</strong> ${escapeHTML(q.explanation)}</p></div>`;
                questionHTML += `</div>`; // question-card
            });
        } catch (error) {
            console.error("Error during HTML generation in renderQuestions:", error);
            questionHTML += "<p style='color:red;'>An error occurred while rendering some questions.</p>";
        }
        examContainer.innerHTML = questionHTML;
    }

    // --- handleSubmit function ---
    // Replace your entire handleSubmit function with this one:
function handleSubmit() {
    console.log("handleSubmit: Function started.");
    clearInterval(timerInterval);
    let score = 0;
    let detailedFeedbackHTML = '';

    currentQuestions.forEach((q, index) => {
        console.log(`handleSubmit: Processing question ID ${q.id}, type ${q.type}`);
        const questionCard = document.getElementById(`question-${index}`); // For styling original card (optional here)
        
        detailedFeedbackHTML += `<div class="feedback-question-block">`;
        detailedFeedbackHTML += `<h4>Question ${index + 1}: ${escapeHTML(q.text)}</h4>`;

        if (q.code) {
            const escapedCode = q.code ? escapeHTML(q.code) : '';
            detailedFeedbackHTML += `<pre class="code-block feedback-code"><code>${escapedCode}</code></pre>`;
        }

        let answered = false;
        let isQuestionCorrectOverall = false; // For MC and perfect MS
        let ms_correctlySelectedCount = 0;
        let ms_incorrectSelectionsMadeText = [];
        let ms_isPerfectScore = false;
        let ms_totalCorrectOptions = 0;

        // Determine user's selections
        let userSelectedOptionTexts = []; // For MC (will have 0 or 1 item)
        let userSelectedOptionIds = [];   // For MS

        if (q.type === 'multiple-choice' || q.type === 'code-snippet') {
            const selectedInput = document.querySelector(`input[name="question${q.id}"]:checked`);
            if (selectedInput) {
                answered = true;
                userSelectedOptionTexts.push(selectedInput.value); // value is escapeHTML(opt.text)
            }
        } else if (q.type === 'multiple-select') {
            const selectedCheckboxes = document.querySelectorAll(`input[name="question${q.id}"]:checked`);
            if (selectedCheckboxes.length > 0) answered = true;
            selectedCheckboxes.forEach(cb => {
                userSelectedOptionIds.push(cb.dataset.optionId);
                userSelectedOptionTexts.push(cb.value); // value is escapeHTML(opt.text)
            });
        }

        detailedFeedbackHTML += `<div class="feedback-options-summary">`; // Wrapper for options review

        // Display all options with feedback
        if (q.options) {
            q.options.forEach(opt => {
                let optIsCorrect = false;
                let userSelectedThisOption = false;
                let optionClasses = "feedback-option-item";

                if (q.type === 'multiple-choice' || q.type === 'code-snippet') {
                    optIsCorrect = opt.correct === true;
                    if (answered && userSelectedOptionTexts.length > 0) {
                        userSelectedThisOption = (escapeHTML(opt.text) === userSelectedOptionTexts[0]);
                    }
                } else if (q.type === 'multiple-select') {
                    optIsCorrect = (q.correctAnswers || []).includes(opt.id);
                    userSelectedThisOption = userSelectedOptionIds.includes(opt.id);
                }

                if (optIsCorrect && userSelectedThisOption) {
                    optionClasses += " user-selected-correct";
                } else if (!optIsCorrect && userSelectedThisOption) {
                    optionClasses += " user-selected-incorrect";
                } else if (optIsCorrect && !userSelectedThisOption) {
                    optionClasses += " missed-correct-option";
                } else { // Not selected and not correct (or just not selected if MC)
                    optionClasses += " option-neutral";
                }
                
                detailedFeedbackHTML += `<div class="${optionClasses}">`;
                detailedFeedbackHTML += escapeHTML(opt.text);
                if (userSelectedThisOption && optIsCorrect) {
                    detailedFeedbackHTML += ` <span class="feedback-icon correct-icon">✔ (Your pick & Correct)</span>`;
                } else if (userSelectedThisOption && !optIsCorrect) {
                    detailedFeedbackHTML += ` <span class="feedback-icon incorrect-icon">✘ (Your pick & Incorrect)</span>`;
                } else if (optIsCorrect && !userSelectedThisOption) {
                    detailedFeedbackHTML += ` <span class="feedback-icon correct-icon">✔ (Correct)</span>`;
                } else if (!optIsCorrect && !userSelectedThisOption && q.type === 'multiple-select') {
                     detailedFeedbackHTML += ` <span class="feedback-icon neutral-icon"></span>`; // Placeholder for alignment or leave empty
                }
                 else if (!optIsCorrect && !userSelectedThisOption && q.type === 'multiple-choice') {
                     detailedFeedbackHTML += ` <span class="feedback-icon neutral-icon"></span>`;
                }
                detailedFeedbackHTML += `</div>`;
            });
        }
        detailedFeedbackHTML += `</div>`; // End .feedback-options-summary

        // Calculate score and status for overall question
        if (q.type === 'multiple-choice' || q.type === 'code-snippet') {
            const correctOption = q.options.find(opt => opt.correct === true);
            if (answered && correctOption && userSelectedOptionTexts[0] === escapeHTML(correctOption.text)) {
                score++;
                isQuestionCorrectOverall = true;
            }
        } else if (q.type === 'multiple-select') {
            const correctOptionIds = q.correctAnswers || [];
            ms_totalCorrectOptions = correctOptionIds.length;
            ms_correctlySelectedCount = 0;
            let actualIncorrectSelectionsMade = 0;

            correctOptionIds.forEach(correctId => {
                if (userSelectedOptionIds.includes(correctId)) {
                    ms_correctlySelectedCount++;
                }
            });
            userSelectedOptionIds.forEach(selectedId => {
                if (!correctOptionIds.includes(selectedId)) {
                    actualIncorrectSelectionsMade++;
                }
            });

            ms_isPerfectScore = (ms_correctlySelectedCount === ms_totalCorrectOptions && actualIncorrectSelectionsMade === 0 && ms_totalCorrectOptions > 0);

            if (ms_isPerfectScore) {
                score++;
                isQuestionCorrectOverall = true;
                detailedFeedbackHTML += `<p class="feedback-status correct-feedback">Perfect! All your selections were correct.</p>`;
            } else if (ms_correctlySelectedCount > 0) {
                isQuestionCorrectOverall = true; // User got at least one part right
                let feedbackMsg = `<p class="feedback-status partially-correct">You correctly selected ${ms_correctlySelectedCount} of the ${ms_totalCorrectOptions} correct option(s).`;
                if (actualIncorrectSelectionsMade > 0) {
                    feedbackMsg += ` <span class="incorrect-selection-note">You also made ${actualIncorrectSelectionsMade} incorrect selection(s).</span>`;
                }
                feedbackMsg += `</p>`;
                detailedFeedbackHTML += feedbackMsg;
            } else if (answered) { // Answered, but no correct options were part of the selection
                detailedFeedbackHTML += `<p class="feedback-status incorrect-feedback">None of your selected options were correct.</p>`;
            } else { // Not answered
                detailedFeedbackHTML += `<p class="feedback-status unanswered-feedback">You did not answer this question.</p>`;
            }
        }
        
        // Overall status for MC (if not already covered by MS block)
        if ((q.type === 'multiple-choice' || q.type === 'code-snippet')) {
            if (answered) {
                if (isQuestionCorrectOverall) {
                    detailedFeedbackHTML += `<p class="feedback-status correct-feedback">Your answer was correct!</p>`;
                } else {
                    detailedFeedbackHTML += `<p class="feedback-status incorrect-feedback">Your answer was incorrect.</p>`;
                }
            } else {
                detailedFeedbackHTML += `<p class="feedback-status unanswered-feedback">You did not answer this question.</p>`;
            }
        }


        // Apply styling to the original question card (this part is optional as examContainer gets hidden)
        if (questionCard) {
            questionCard.classList.remove('correct', 'incorrect', 'unanswered', 'partially-correct');
            if (q.type === 'multiple-select') {
                if (answered) {
                    if (ms_isPerfectScore) questionCard.classList.add('correct');
                    else if (ms_correctlySelectedCount > 0) questionCard.classList.add('partially-correct');
                    else questionCard.classList.add('incorrect');
                } else questionCard.classList.add('unanswered');
            } else { 
                if (isQuestionCorrectOverall && answered) questionCard.classList.add('correct');
                else if (answered) questionCard.classList.add('incorrect');
                else questionCard.classList.add('unanswered');
            }
            const explanationDiv = questionCard.querySelector('.explanation');
            if (explanationDiv) explanationDiv.style.display = 'block';
        }

        detailedFeedbackHTML += `<div class="explanation-feedback"><p><strong>Explanation:</strong> ${escapeHTML(q.explanation)}</p></div>`;
        detailedFeedbackHTML += `</div>`; // End .feedback-question-block
        if (index < currentQuestions.length - 1) {
            detailedFeedbackHTML += `<hr class="feedback-divider">`;
        }
    }); // End of currentQuestions.forEach

    console.log("handleSubmit: Loop finished. Score calculated:", score);

    if(scoreDisplay) scoreDisplay.textContent = `${score.toFixed(2)} out of ${currentQuestions.length}`;
    if(feedbackArea) feedbackArea.innerHTML = detailedFeedbackHTML;
    if(resultsContainer) {
        resultsContainer.style.display = 'block';
        console.log("handleSubmit: resultsContainer displayed.");
    }
    if(submitButton) {
        submitButton.style.display = 'none';
    }
    if(examContainer) {
        examContainer.style.display = 'none';
        console.log("handleSubmit: examContainer hidden.");
    }
    console.log("handleSubmit: Function finished.");
}

    // --- startExam function (simplified for single main mock) ---
    function startExam() { 
        if (!examInitiationArea || !examArea || !resultsContainer || !examContainer || !submitButton) {
            console.error("One or more critical DOM elements are missing. Check HTML IDs.");
            return;
        }
         if (allQuestions.length === 0) { // Check if questions are loaded before starting
            console.error("startExam called but no questions are loaded. Check questions.json or loadQuestions function.");
            alert("Questions are not loaded. Please try refreshing or check the console for errors.");
            if (startExamButton) { // Re-enable start button if it was disabled by error state from loadQuestions
                startExamButton.disabled = false;
                startExamButton.textContent = "Start Mock Exam"; // Or "Retry Loading"
            }
            return;
        }
        console.log('--- Starting Main Mock Exam ---');
        
        examInitiationArea.style.display = 'none';
        examArea.style.display = 'block';
        resultsContainer.style.display = 'none';
        examContainer.style.display = 'block'; 
        submitButton.style.display = 'block';
        submitButton.disabled = false;

        currentQuestions = [...allQuestions]; 
        console.log('Using allQuestions. currentQuestions length:', currentQuestions.length);
        
        shuffleArray(currentQuestions);
        console.log('After shuffle. currentQuestions length:', currentQuestions.length);
        
        console.log('Final currentQuestions length BEFORE calling renderQuestions:', currentQuestions.length);

        if (currentQuestions.length === 0) { // Should ideally not happen if allQuestions loaded
            if(examContainer) examContainer.innerHTML = "<p>No questions available to display.</p>";
            if(submitButton) submitButton.style.display = 'none';
            clearInterval(timerInterval);
            if (timerDisplay) timerDisplay.textContent = "--:--";
            console.log('No questions to render.');
            return;
        }
        
        renderQuestions();
        let timePerQuestion = 90; 
        startTimer(currentQuestions.length * timePerQuestion);
        console.log('--- Main Mock Exam Started ---');
    }

    // --- Event Listeners ---
    if (startExamButton) startExamButton.addEventListener('click', startExam);
    if (submitButton) submitButton.addEventListener('click', handleSubmit);
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            if (examArea) examArea.style.display = 'none';
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (examInitiationArea) examInitiationArea.style.display = 'block';
            
            clearInterval(timerInterval);
            if (timerDisplay) timerDisplay.textContent = "--:--";
            if(scoreDisplay) scoreDisplay.textContent = '';
            if(feedbackArea) feedbackArea.innerHTML = '';
            
            if(examContainer) {
                examContainer.innerHTML = '';
            }
            // Ensure start button is re-enabled if questions were loaded successfully
            if (startExamButton && allQuestions.length > 0) {
                 startExamButton.disabled = false;
                 startExamButton.textContent = "Start Mock Exam";
            } else if (startExamButton) { // If questions failed to load initially
                 startExamButton.textContent = "Error Loading Questions";
                 startExamButton.disabled = true;
            }
        });
    }

    // --- Load Questions on Page Load ---
    loadQuestions(); // Call the function to load questions from JSON

});