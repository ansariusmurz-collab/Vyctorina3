/* ========================================================== */
/* ЛОГИКА ВОПРОСОВ И ПРОВЕРКИ ОТВЕТОВ (script.question.js)     */
/* ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const questionTextElement = document.getElementById('question-text');
    const questionPointsBadge = document.getElementById('q-points');
    const btnCloseQuestion = document.getElementById('btn-close-question');

    // Функция загрузки и отображения вопроса
    window.loadQuestion = function(category, points) {
        let qData = null;

        // Получаем базу вопросов из глобального объекта window.quizQuestions
        const categoryArray = window.quizQuestions && window.quizQuestions[category];

        if (categoryArray && Array.isArray(categoryArray)) {
            let indexMap = { 10: 0, 20: 1, 40: 2, 50: 3 };
            let questionIndex = indexMap[points];

            if (questionIndex !== undefined) {
                qData = categoryArray[questionIndex];
            }
        }

        if (!qData && window.gameState && typeof window.gameState.getQuestion === 'function') {
            qData = window.gameState.getQuestion(category, points);
        }

        if (!qData) {
            console.error(`Вопрос для категории ${category} на ${points} очков не найден!`);
            return;
        }

        // Заполняем текст вопроса
        if (questionTextElement) {
            questionTextElement.textContent = qData.question;
        }
        if (questionPointsBadge) {
            questionPointsBadge.textContent = points;
        }

        // Находим все кнопки вариантов ответа в HTML
        const answerButtons = document.querySelectorAll('#screen-question .answer-btn');

        answerButtons.forEach((btn, index) => {
            btn.classList.remove('correct', 'wrong');
            btn.disabled = false;

            if (qData.answers[index] !== undefined) {
                btn.style.display = 'block';
                btn.textContent = String(qData.answers[index]);

                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                newBtn.addEventListener('click', () => {
                    // Блокируем все кнопки на время показа результата
                    const allButtons = document.querySelectorAll('#screen-question .answer-btn');
                    allButtons.forEach(b => b.disabled = true);

                    // ВСЕГДА стираем метеор (помечаем как выполненный), независимо от ответа!
                    if (window.gameState && typeof window.gameState.markMeteorCompleted === 'function') {
                        window.gameState.markMeteorCompleted(category, points);
                    }

                    if (index === qData.correct) {
                        // ПРАВИЛЬНЫЙ ОТВЕТ (добавляем очки)
                        newBtn.classList.add('correct');
                        
                        if (window.gameState && typeof window.gameState.addPointsToCurrent === 'function') {
                            window.gameState.addPointsToCurrent(points);
                        }
                    } else {
                        // НЕПРАВИЛЬНЫЙ ОТВЕТ (очки не добавляем, но метеор всё равно сгорает)
                        newBtn.classList.add('wrong');
                        if (allButtons[qData.correct]) {
                            allButtons[qData.correct].classList.add('correct');
                        }
                    }

                    // Возвращаемся на экран игры через 1.5 секунды, метеор исчезнет
                    setTimeout(() => {
                        window.switchScreen('screen-game');
                        
                        if (typeof window.updateMeteorsVisualState === 'function') {
                            window.updateMeteorsVisualState();
                        }
                    }, 1500);
                });
            } else {
                btn.style.display = 'none';
            }
        });

        window.switchScreen('screen-question');
    };

    if (btnCloseQuestion) {
        btnCloseQuestion.addEventListener('click', () => {
            window.switchScreen('screen-game');
        });
    }
});