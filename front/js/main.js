// Tunning Manual 8080 - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми секциями
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Активная навигация при скролле
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Анимация для карточек при наведении
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Параллакс эффект для hero секции
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Загрузка реальных данных из БД
    loadSystemStats();
});

// Загрузка статистики системы из PostgreSQL
async function loadSystemStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        if (data.success && data.stats) {
            const stats = {
                totalCars: parseInt(data.stats.totalCars) || 0,
                totalParts: parseInt(data.stats.totalParts) || 0,
                totalManufacturers: parseInt(data.stats.totalManufacturers) || 0,
                totalCategories: parseInt(data.stats.totalCategories) || 0
            };
            updateStats(stats);
            console.log('📊 Статистика загружена из PostgreSQL:', JSON.stringify(stats, null, 2));
        }
    } catch (error) {
        console.error('Error loading stats from API:', error);
        // Fallback при отсутствии сервера
        console.log('⚠️ Сервер недоступен, статистика не загружена');
    }
}

function updateStats(stats) {
    // Обновляем статистику на странице (если есть соответствующие элементы)
    const statsContainer = document.getElementById('db-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div style="text-align: center; padding: 1rem; background: rgba(255, 187, 148, 0.1); border-radius: 10px;">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--accent-color);" id="stat-cars">${stats.totalCars}</div>
                    <div style="font-size: 0.9rem; color: var(--secondary-color);">Автомобилей</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255, 187, 148, 0.1); border-radius: 10px;">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--accent-color);" id="stat-parts">${stats.totalParts}</div>
                    <div style="font-size: 0.9rem; color: var(--secondary-color);">Деталей</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255, 187, 148, 0.1); border-radius: 10px;">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--accent-color);" id="stat-mfr">${stats.totalManufacturers}</div>
                    <div style="font-size: 0.9rem; color: var(--secondary-color);">Производителей</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255, 187, 148, 0.1); border-radius: 10px;">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--accent-color);" id="stat-cat">${stats.totalCategories}</div>
                    <div style="font-size: 0.9rem; color: var(--secondary-color);">Категорий</div>
                </div>
            </div>
        `;
    }
    console.log('System stats from DB:', stats);
}

// Утилиты
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Анимация чисел
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Обработка ошибок
window.addEventListener('error', function (e) {
    console.error('Global error:', e.error);
});

// Экспорт функций для использования в других модулях
window.TunningManual = {
    loadSystemStats,
    animateNumber,
    debounce
};
