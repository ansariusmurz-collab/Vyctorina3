/* ========================================================== */
/* ЛОГИКА ИНТЕРАКТИВНОЙ ЗАСТАВКИ (script.splash.js)           */
/* ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const splashPrompt = document.getElementById('splash-prompt');
    const splashSchool = document.getElementById('splash-school');
    const splashAuthor = document.getElementById('splash-author');

    let isSplashStarted = false;

    function startSplashSequence() {
        if (isSplashStarted) return;
        isSplashStarted = true;

        if (splashPrompt) {
            splashPrompt.classList.add('hidden-step');
        }

        setTimeout(() => {
            if (splashSchool) {
                splashSchool.classList.remove('hidden-step');
            }

            setTimeout(() => {
                if (splashSchool) {
                    splashSchool.classList.add('hidden-step');
                }

                setTimeout(() => {
                    if (splashAuthor) {
                        splashAuthor.classList.remove('hidden-step');
                    }

                    setTimeout(() => {
                        if (splashAuthor) {
                            splashAuthor.classList.add('hidden-step');
                        }

                        // ВАЖНО: После заставки переходим сразу к планетам!
                        setTimeout(() => {
                            if (typeof window.switchScreen === 'function') {
                                window.switchScreen('screen-categories');
                            } else {
                                console.error('Функция switchScreen не найдена!');
                            }
                        }, 1200);

                    }, 2500);

                }, 1200);

            }, 2500);

        }, 1000);
    }

    window.addEventListener('keydown', startSplashSequence, { once: true });
    window.addEventListener('click', startSplashSequence, { once: true });
});