/* ========================================================== */
/* ГЛАВНЫЙ СКРИПТ И ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ (script.main.js)      */
/* ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.game-screen');
    const playersInputsContainer = document.getElementById('players-inputs-container');
    const btnAddPlayer = document.getElementById('btn-add-player');
    const btnStartGame = document.getElementById('btn-start-game');
    const btnRestart = document.getElementById('btn-restart');
    
    const activePlayerNameEl = document.getElementById('active-player-name');
    const activePlayerPointsEl = document.getElementById('active-player-points');

    // Глобальная функция переключения экранов
    window.switchScreen = function(screenId) {
        // 1. Убираем класс active у всех экранов с классом .game-screen
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 2. Находим нужный экран по ID и добавляем ему класс active
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        } else {
            console.error('Ошибка: экран не найден:', screenId);
        }

        // 3. Если переключились на экран категорий — обновляем инфо о ходящем игроке
        if (screenId === 'screen-categories') {
            updateTurnInfo();
        }

        // 4. Если переключились на экран победы — рендерим таблицу лидеров
        if (screenId === 'screen-victory') {
            if (typeof window.renderLeaderboard === 'function') {
                window.renderLeaderboard();
            }
        }
    };

    // Обновление информации о текущем игроке в шапке
    function updateTurnInfo() {
        if (window.gameState && typeof window.gameState.getCurrentPlayer === 'function') {
            const currentPlayer = window.gameState.getCurrentPlayer();
            if (currentPlayer) {
                if (activePlayerNameEl) activePlayerNameEl.textContent = currentPlayer.name;
                if (activePlayerPointsEl) activePlayerPointsEl.textContent = currentPlayer.score;
            }
        }
    }

    // Динамическое добавление поля для нового игрока
    if (btnAddPlayer) {
        btnAddPlayer.addEventListener('click', () => {
            const count = playersInputsContainer.querySelectorAll('.player-input').length + 1;
            if (count > 6) {
                alert('Максимум 6 игроков для комфортной игры!');
                return;
            }
            const row = document.createElement('div');
            row.className = 'player-input-row';
            row.innerHTML = `<input type="text" class="player-input" placeholder="Имя игрока ${count}" value="Игрок ${count}">`;
            playersInputsContainer.appendChild(row);
        });
    }

    // Старт игры из главного меню
    if (btnStartGame) {
        btnStartGame.addEventListener('click', () => {
            const inputElements = playersInputsContainer.querySelectorAll('.player-input');
            
            // Очищаем старых игроков в состоянии
            window.gameState.players = [];

            inputElements.forEach(input => {
                const name = input.value.trim();
                if (name) {
                    window.gameState.addPlayer(name);
                }
            });

            if (window.gameState.players.length === 0) {
                alert('Пожалуйста, введите хотя бы одно имя игрока!');
                return;
            }

            // Инициализируем трекер использованных вопросов
            if (typeof window.initQuestionTracker === 'function') {
                window.initQuestionTracker();
            }

            // Переходим к выбору планет (категорий)
            window.switchScreen('screen-categories');
        });
    }

    // Кнопка перезапуска игры с экрана победы
    if (btnRestart) {
        btnRestart.addEventListener('click', () => {
            window.gameState.reset();
            window.switchScreen('screen-welcome');
        });
    }
});