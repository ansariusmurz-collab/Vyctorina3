/* ========================================================== */
/* ЛОГИКА ВЫБОРА ПЛАНЕТ, ПОЛЕТА РАКЕТЫ И МЕТЕОРОВ (script.meteors.js) */
/* ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const planetCards = document.querySelectorAll('.planet-card');
    const meteorElements = document.querySelectorAll('.meteor-wrapper');
    const currentPlanetTitle = document.getElementById('current-planet-title');
    const btnBackToPlanets = document.getElementById('btn-back-to-planets');
    const explosionEffect = document.getElementById('explosion-effect');
    const rocket = document.getElementById('space-rocket');
    const categoriesContainer = document.querySelector('.categories-container');

    let selectedCategoryKey = null;
    let isRocketFlying = false;

    // Названия планет для заголовков
    const planetTitles = {
        saturn: 'Сатурн — Русский язык',
        earth: 'Земля — Окружающий мир',
        venus: 'Венера — Литература',
        jupiter: 'Юпитер — Математика'
    };

    // Словарь фонов для каждой планеты
    const planetBackgrounds = {
        saturn: 'url("assets/images/bg_saturn.jpg")',
        earth: 'url("assets/images/bg_earth.jpg")',
        venus: 'url("assets/images/bg_venus.jpg")',
        jupiter: 'url("assets/images/bg_jupiter.jpg")'
    };

    // Функция обновления визуального состояния: скрывает (стирает) метеоры, на которые уже ответили
    window.updateMeteorsVisualState = function() {
        const currentCategory = window.gameState && window.gameState.currentCategory;
        if (!currentCategory) return;

        meteorElements.forEach(meteor => {
            const points = parseInt(meteor.getAttribute('data-points')) || 10;
            
            // Если метеор уже решен — полностью стираем его через класс .destroyed
            if (window.gameState.isMeteorCompleted && window.gameState.isMeteorCompleted(currentCategory, points)) {
                meteor.classList.add('destroyed');
            } else {
                meteor.classList.remove('destroyed');
            }
        });
    };

    // 1. Клик по планете на экране космоса
    planetCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (isRocketFlying) return;
            isRocketFlying = true;

            selectedCategoryKey = card.getAttribute('data-category');
            window.gameState.currentCategory = selectedCategoryKey;

            const cardRect = card.getBoundingClientRect();
            const containerRect = categoriesContainer.getBoundingClientRect();
            
            const targetX = cardRect.left + cardRect.width / 2 - containerRect.left;
            const targetY = containerRect.bottom - (cardRect.top + cardRect.height / 2);

            if (rocket) {
                rocket.style.setProperty('--target-x', `${targetX}px`);
                rocket.style.setProperty('--target-y', `${targetY}px`);

                rocket.classList.remove('hidden');
                rocket.classList.add('flying');
            }

            setTimeout(() => {
                if (rocket) rocket.classList.remove('flying');
                if (categoriesContainer) categoriesContainer.classList.add('zoom-in');

                setTimeout(() => {
                    if (categoriesContainer) categoriesContainer.classList.remove('zoom-in');
                    if (rocket) rocket.classList.add('hidden');
                    isRocketFlying = false;

                    if (planetBackgrounds[selectedCategoryKey]) {
                        document.body.style.backgroundImage = planetBackgrounds[selectedCategoryKey];
                    }

                    if (currentPlanetTitle) {
                        currentPlanetTitle.textContent = `Приземление на планету: ${planetTitles[selectedCategoryKey] || 'Космос'}`;
                    }

                    // Переходим на экран игры и обновляем метеоры (стирая решенные)
                    window.switchScreen('screen-game');
                    window.updateMeteorsVisualState();

                }, 500);

            }, 1000);
        });
    });

    // Кнопка возврата к выбору планет
    if (btnBackToPlanets) {
        btnBackToPlanets.addEventListener('click', () => {
            document.body.style.backgroundImage = 'url("assets/images/bg_space.jpg")';
            window.switchScreen('screen-categories');
        });
    }

    // 2. Клик по метеору сложности (10-50 очков)
    meteorElements.forEach(meteor => {
        meteor.addEventListener('click', (e) => {
            const points = parseInt(meteor.getAttribute('data-points')) || 10;
            const currentCategory = window.gameState && window.gameState.currentCategory;

            // Защита: если метеор уже уничтожен, повторно на него не кликнуть
            if (window.gameState.isMeteorCompleted && window.gameState.isMeteorCompleted(currentCategory, points)) {
                return;
            }

            // Сохраняем текущие очки в gameState
            if (window.gameState) {
                window.gameState.currentPoints = points;
            }

            const rect = meteor.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            if (explosionEffect) {
                explosionEffect.style.left = `${x}px`;
                explosionEffect.style.top = `${y}px`;
                explosionEffect.classList.remove('hidden');
                explosionEffect.classList.add('active-wave');
            }

            const category = selectedCategoryKey || window.gameState.currentCategory;

            // Через 500мс открываем вопрос, когда волна закрыла экран
            setTimeout(() => {
                if (typeof window.loadQuestion === 'function') {
                    window.loadQuestion(category, points);
                } else {
                    console.error('Ошибка: функция loadQuestion не найдена!');
                }
            }, 500);

            // Через 1500мс убираем класс волны
            setTimeout(() => {
                if (explosionEffect) {
                    explosionEffect.classList.remove('active-wave', 'hidden');
                }
            }, 1500);
        });
    });
});