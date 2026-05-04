// Tunning Manual 8080 - Configurations JavaScript
// Данные загружаются из PostgreSQL через API

let currentCountry = null;
let currentCar = null;

// Показать автомобили выбранной страны (из БД)
async function showCountryCars(country) {
    currentCountry = country;

    // Показываем загрузку
    const container = document.getElementById('cars-container');
    container.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>⏳ Загрузка данных из базы данных...</p></div>';
    document.getElementById('country-results').style.display = 'block';
    document.getElementById('car-details').style.display = 'none';

    try {
        const response = await fetch(`/api/configurations/cars/${country}`);
        const data = await response.json();

        if (!data.success || !data.cars || data.cars.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>🚫 Нет автомобилей для этой страны в базе данных</p></div>';
            document.getElementById('selected-country-title').textContent = 'Нет данных';
            return;
        }

        // Определяем метаданные страны из первого автомобиля
        const countryFlags = {
            japan: '🇯🇵 Япония',
            germany: '🇩🇪 Германия',
            czech: '🇨🇿 Чехия',
            america: '🇺🇸 Америка',
            russia: '🇷🇺 Россия',
            sweden: '🇸🇪 Швеция'
        };

        document.getElementById('selected-country-title').innerHTML =
            `${countryFlags[country] || country} - Доступные конфигурации`;

        container.innerHTML = '';

        data.cars.forEach(car => {
            const carCard = createCarCard(car);
            container.appendChild(carCard);
        });

        // Плавная прокрутка к результатам
        document.getElementById('country-results').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } catch (error) {
        console.error('Ошибка загрузки автомобилей:', error);
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #ff6b6b;"><p>❌ Ошибка загрузки данных. Проверьте подключение к серверу.</p></div>';
    }
}

// Создать карточку автомобиля (данные из БД)
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.onclick = () => showCarDetails(car);

    const partsCount = parseInt(car.availableParts) || 0;
    const rating = parseFloat(car.compatibilityRating) || 0;

    card.innerHTML = `
        <div style="text-align: center; font-size: 4rem; margin-bottom: 1rem;">
            ${car.image || 'Auto'}
        </div>
        <h3 style="color: var(--accent-color); margin-bottom: 0.5rem;">
            ${car.brand} ${car.model}
        </h3>
        <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 1rem;">
            ${car.year} год
        </p>
        <p style="margin-bottom: 1rem;">
            ${car.description || ''}
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
            <div>
                <span style="color: var(--accent-color); font-weight: bold;">
                    Совместимость: ${rating}/10
                </span>
            </div>
            <div>
                <span style="color: var(--secondary-color); font-size: 0.9rem;">
                    ${partsCount} деталей
                </span>
            </div>
        </div>
        <button class="btn" style="width: 100%; margin-top: 1rem;" onclick="event.stopPropagation(); showCarDetailsFromCard(this)">
            Подробности
        </button>
        <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem; background: #4CAF50; color: white;" onclick="event.stopPropagation(); selectCarForGarageFromCard(this)">
            🚗 Выбрать в гараж
        </button>
        <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;" onclick="event.stopPropagation(); addToFavoritesFromCard(this)">
            Добавить в избранное
        </button>
    `;

    // Сохраняем данные автомобиля в data-атрибуте
    card.dataset.carData = JSON.stringify(car);
    
    return card;
}

function showCarDetailsFromCard(button) {
    const car = JSON.parse(button.closest('.card').dataset.carData);
    showCarDetails(car);
}

function addToFavoritesFromCard(button) {
    const car = JSON.parse(button.closest('.card').dataset.carData);
    addToFavorites(car);
}

// Показать подробности об автомобиле (данные из БД)
function showCarDetails(car) {
    currentCar = car;

    document.getElementById('car-details').style.display = 'block';

    const partsCount = parseInt(car.availableParts) || 0;
    const rating = parseFloat(car.compatibilityRating) || 0;

    const content = document.getElementById('car-details-content');
    content.innerHTML = `
        <div class="card">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                <div style="text-align: center; font-size: 6rem;">
                    ${car.image || '🚗'}
                </div>
                <div>
                    <h2 style="color: var(--accent-color); margin-bottom: 1rem;">
                        ${car.brand} ${car.model}
                    </h2>
                    <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 1rem;">
                        ${car.year} год
                    </p>
                    <p style="margin-bottom: 2rem;">
                        ${car.description || ''}
                    </p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                        <div style="background: rgba(255, 187, 148, 0.1); padding: 1rem; border-radius: 10px;">
                            <div style="color: var(--accent-color); font-size: 0.9rem;">Мощность</div>
                            <div style="font-size: 1.2rem; font-weight: bold;">${car.power || 'N/A'}</div>
                        </div>
                        <div style="background: rgba(255, 187, 148, 0.1); padding: 1rem; border-radius: 10px;">
                            <div style="color: var(--accent-color); font-size: 0.9rem;">Крутящий момент</div>
                            <div style="font-size: 1.2rem; font-weight: bold;">${car.torque || 'N/A'}</div>
                        </div>
                        <div style="background: rgba(255, 187, 148, 0.1); padding: 1rem; border-radius: 10px;">
                            <div style="color: var(--accent-color); font-size: 0.9rem;">Разгон 0-100 км/ч</div>
                            <div style="font-size: 1.2rem; font-weight: bold;">${car.acceleration || 'N/A'}</div>
                        </div>
                        <div style="background: rgba(255, 187, 148, 0.1); padding: 1rem; border-radius: 10px;">
                            <div style="color: var(--accent-color); font-size: 0.9rem;">Макс. скорость</div>
                            <div style="font-size: 1.2rem; font-weight: bold;">${car.topSpeed || 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <div>
                            <div style="color: var(--accent-color); font-size: 0.9rem;">Совместимость с тюнингом</div>
                            <div style="font-size: 2rem; font-weight: bold; color: var(--secondary-color);">
                                ${rating}/10
                            </div>
                        </div>
                        <div>
                            <div style="color: var(--accent-color); font-size: 0.9rem;">Доступно деталей (из БД)</div>
                            <div style="font-size: 2rem; font-weight: bold; color: var(--secondary-color);">
                                ${partsCount}
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn" onclick="showCompatibleParts(${car.id})">
                            Показать совместимые детали
                        </button>
                        <button class="btn btn-secondary" style="background: #4CAF50; color: white;" onclick="selectCarForGarage(${car.id}, '${car.brand}', '${car.model}')">
                            🚗 Выбрать в гараж
                        </button>
                        <button class="btn btn-secondary" onclick="addToFavorites(${car.id})">
                            Добавить в избранное
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="compatible-parts-container"></div>
    `;

    // Плавная прокрутка к деталям
    document.getElementById('car-details').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Вернуться к списку автомобилей
function backToCars() {
    document.getElementById('car-details').style.display = 'none';
    document.getElementById('country-results').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Показать совместимые детали из БД
async function showCompatibleParts(carId) {
    const container = document.getElementById('compatible-parts-container');
    if (!container) return;

    container.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>⏳ Загрузка деталей из базы данных...</p></div>';

    try {
        const response = await fetch(`/api/configurations/parts/${carId}`);
        const data = await response.json();

        if (!data.success || !data.parts || data.parts.length === 0) {
            container.innerHTML = `
                <div class="card" style="margin-top: 1rem; text-align: center;">
                    <h3 style="color: var(--accent-color);">Совместимые детали</h3>
                    <p>🚫 Нет совместимых деталей в базе данных для этого автомобиля</p>
                </div>
            `;
            return;
        }

        let partsHTML = `
            <div class="card" style="margin-top: 1rem;">
                <h3 style="color: var(--accent-color); margin-bottom: 1rem;">
                    🔧 Совместимые детали (${data.totalParts} шт.) — из PostgreSQL
                </h3>
        `;

        data.parts.forEach(part => {
            const price = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0
            }).format(part.price);

            const difficultyLevels = {
                1: 'Очень легко', 2: 'Легко', 3: 'Средне', 4: 'Средне-сложно',
                5: 'Сложно', 6: 'Очень сложно', 7: 'Профессиональный',
                8: 'Мастерской', 9: 'Экстремально'
            };

            const scoreColor = part.compatibilityScore >= 9 ? '#4CAF50' :
                part.compatibilityScore >= 7 ? '#FF9800' : '#F44336';

            const partData = encodeURIComponent(JSON.stringify(part));
            partsHTML += `
                <div style="border-left: 4px solid ${scoreColor}; background: rgba(255, 187, 148, 0.1); border-radius: 10px; padding: 1.5rem; margin: 1rem 0;" data-part-id="${part.id}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h4 style="margin: 0; color: var(--accent-color);">${part.name}</h4>
                        <span style="color: ${scoreColor}; font-weight: bold; font-size: 1.2rem;">
                            ${part.compatibilityScore}/10
                        </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
                        <div><span style="color: var(--secondary-color); font-size: 0.9rem;">Категория:</span> ${part.category_name || '-'}</div>
                        <div><span style="color: var(--secondary-color); font-size: 0.9rem;">Производитель:</span> ${part.manufacturer_name || '-'}</div>
                        <div><span style="color: var(--secondary-color); font-size: 0.9rem;">Прирост мощности:</span> +${part.powerGain || 0} л.с.</div>
                        <div><span style="color: var(--secondary-color); font-size: 0.9rem;">Прирост момента:</span> +${part.torqueGain || 0} Нм</div>
                        <div><span style="color: var(--secondary-color); font-size: 0.9rem;">Сложность:</span> ${difficultyLevels[part.installDifficulty] || 'Неизвестно'}</div>
                        <div><span style="color: var(--secondary-color); font-size: 0.9rem;">Цена:</span> <strong style="color: var(--accent-color);">${price}</strong></div>
                    </div>
                    ${part.instruction ? `<div style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 0.9rem;"><strong>Инструкция:</strong> ${part.instruction}</div>` : ''}
                    ${part.compatibility_note ? `<div style="margin-top: 0.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.6);"><em>📋 ${part.compatibility_note}</em></div>` : ''}
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" style="flex: 1; background: #4CAF50; color: white; font-size: 0.9rem;" onclick="addPartToGarageFromConfig('${partData}')">
                            🔧 Добавить в гараж
                        </button>
                    </div>
                </div>
            `;
        });

        partsHTML += '</div>';
        container.innerHTML = partsHTML;

        // Прокрутка к деталям
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Ошибка загрузки деталей:', error);
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #ff6b6b;"><p>❌ Ошибка загрузки деталей. Проверьте подключение к серверу.</p></div>';
    }
}

// Добавить в избранное (заглушка)
function addToFavorites(carId) {
    alert(`Автомобиль ID: ${carId} добавлен в избранное!\n\nВ реальном приложении здесь будет сохранение в профиль пользователя.`);
}

// ==================== ГАРАЖ ====================

// Выбрать машину в гараж из карточки
async function selectCarForGarageFromCard(button) {
    const car = JSON.parse(button.closest('.card').dataset.carData);
    await selectCarForGarage(car.id, car.brand, car.model);
}

// Выбрать машину в гараж
async function selectCarForGarage(carId, brand, model) {
    const result = await selectCarInGarage(carId, `${brand} ${model}`);
    if (result.success) {
        // Показываем уведомление и обновляем кнопку гаража
        updateGarageButton();
    }
}

// Добавить деталь в гараж из конфигураций
async function addPartToGarageFromConfig(partDataEncoded) {
    const part = JSON.parse(decodeURIComponent(partDataEncoded));
    await addPartToGarage(part);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    // Добавляем анимации для карточек стран
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) translateY(-5px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });

    console.log('🔧 Configurations page: данные загружаются из PostgreSQL API');
});
