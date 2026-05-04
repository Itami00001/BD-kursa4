// GARAGE MODULE - Вариант 1 (JSONB)
// Управление гаражом пользователя: выбор машины, добавление деталей, радар-чарт

const API_BASE = 'http://localhost:8080/api';
const LS_GARAGE_KEY = 'tunningManual_garage';

// ==================== STATE ====================
let garageState = {
    car: null,
    parts: [],
    stats: {},
    isAuthenticated: false // TODO: проверять реальную авторизацию
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    loadGarageFromLocalStorage();
    updateGarageButton();
});

// ==================== LOCAL STORAGE ====================
function loadGarageFromLocalStorage() {
    try {
        const saved = localStorage.getItem(LS_GARAGE_KEY);
        if (saved) {
            garageState = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Garage load error:', e);
    }
}

function saveGarageToLocalStorage() {
    try {
        localStorage.setItem(LS_GARAGE_KEY, JSON.stringify(garageState));
    } catch (e) {
        console.warn('Garage save error:', e);
    }
}

function updateGarageButton() {
    const btn = document.querySelector('.btn-garage');
    if (btn) {
        const count = garageState.parts?.length || 0;
        btn.innerHTML = count > 0 ? `Гараж (${count})` : 'Гараж';
    }
}

// ==================== API ====================
async function fetchGarage() {
    try {
        const response = await fetch(`${API_BASE}/garage`);
        const data = await response.json();
        if (data.success && data.garage) {
            garageState.car = {
                id: data.garage.car_id,
                brand: data.garage.brand,
                model: data.garage.model,
                year: data.garage.year,
                power: data.garage.power,
                torque: data.garage.torque,
                compatibilityRating: data.garage.compatibilityRating
            };
            garageState.parts = data.garage.parts || [];
            garageState.stats = data.garage.stats || {};
            saveGarageToLocalStorage();
            updateGarageButton();
        }
        return data;
    } catch (error) {
        console.error('Fetch garage error:', error);
        return { success: false, error: error.message };
    }
}

async function selectCarInGarage(carId, carName) {
    try {
        const response = await fetch(`${API_BASE}/garage/select-car`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ carId, name: carName })
        });
        const data = await response.json();
        if (data.success) {
            // Обновляем локальный state
            garageState.car = { id: carId };
            garageState.parts = [];
            garageState.stats = {};
            saveGarageToLocalStorage();
            updateGarageButton();
            showNotification('Машина выбрана в гараж!', 'success');
        }
        return data;
    } catch (error) {
        console.error('Select car error:', error);
        showNotification('Ошибка выбора машины', 'error');
        return { success: false, error: error.message };
    }
}

async function addPartToGarage(part) {
    if (!garageState.car) {
        showNotification('Сначала выберите машину в конфигурациях!', 'warning');
        openGarageModal();
        return { success: false, error: 'No car selected' };
    }

    // Проверяем, нет ли уже такой детали
    if (garageState.parts.find(p => p.partId === part.id)) {
        showNotification('Эта деталь уже в гараже!', 'warning');
        return { success: false, error: 'Part already in garage' };
    }

    try {
        const response = await fetch(`${API_BASE}/garage/add-part`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                partId: part.id,
                name: part.name,
                category: part.category_name || part.category,
                powerGain: part.powerGain || 0,
                torqueGain: part.torqueGain || 0,
                compatibilityScore: part.compatibilityScore || 5,
                installDifficulty: part.installDifficulty || 5
            })
        });
        const data = await response.json();
        if (data.success) {
            garageState.parts.push({
                partId: part.id,
                name: part.name,
                category: part.category_name || part.category,
                powerGain: part.powerGain || 0,
                torqueGain: part.torqueGain || 0,
                compatibilityScore: part.compatibilityScore || 5,
                installDifficulty: part.installDifficulty || 5,
                addedAt: new Date().toISOString()
            });
            garageState.stats = data.stats;
            saveGarageToLocalStorage();
            updateGarageButton();
            showNotification('Деталь добавлена в гараж!', 'success');
        } else {
            showNotification(data.error || 'Ошибка добавления', 'error');
        }
        return data;
    } catch (error) {
        console.error('Add part error:', error);
        showNotification('Ошибка добавления детали', 'error');
        return { success: false, error: error.message };
    }
}

async function removePartFromGarage(partId) {
    try {
        const response = await fetch(`${API_BASE}/garage/parts/${partId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            garageState.parts = garageState.parts.filter(p => p.partId !== partId);
            garageState.stats = data.stats || {};
            saveGarageToLocalStorage();
            updateGarageButton();
            showNotification('Деталь удалена', 'success');
            renderGarageParts(); // Обновляем UI
        }
        return data;
    } catch (error) {
        console.error('Remove part error:', error);
        showNotification('Ошибка удаления', 'error');
        return { success: false, error: error.message };
    }
}

async function clearGarageParts() {
    try {
        const response = await fetch(`${API_BASE}/garage/clear-parts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data = await response.json();
        if (data.success) {
            garageState.parts = [];
            garageState.stats = {};
            saveGarageToLocalStorage();
            updateGarageButton();
            showNotification('Все детали удалены', 'success');
            renderGarageParts();
        }
        return data;
    } catch (error) {
        console.error('Clear garage error:', error);
        showNotification('Ошибка очистки', 'error');
        return { success: false, error: error.message };
    }
}

// ==================== UI ====================
function openGarageModal() {
    // Создаём модалку если её нет
    let modal = document.getElementById('garageModal');
    if (!modal) {
        modal = createGarageModal();
        document.body.appendChild(modal);
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Загружаем данные и рендерим
    loadAndRenderGarage();
}

function closeGarageModal() {
    const modal = document.getElementById('garageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function createGarageModal() {
    const modal = document.createElement('div');
    modal.id = 'garageModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content garage-modal-content">
            <div class="modal-header">
                <h2>🚗 Мой Гараж</h2>
                <span class="close" onclick="closeGarageModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div id="garageContent">
                    <div class="garage-loading">Загрузка...</div>
                </div>
            </div>
        </div>
    `;

    // Закрытие по клику вне модалки
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGarageModal();
    });

    // Добавляем стили если нет
    if (!document.getElementById('garageStyles')) {
        addGarageStyles();
    }

    return modal;
}

function addGarageStyles() {
    const style = document.createElement('style');
    style.id = 'garageStyles';
    style.textContent = `
        .garage-modal-content {
            max-width: 900px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        .garage-empty {
            text-align: center;
            padding: 3rem;
            color: #666;
        }
        .garage-empty h3 {
            margin-bottom: 1rem;
        }
        .garage-empty .btn-primary {
            margin-top: 1rem;
        }
        .garage-car {
            background: linear-gradient(135deg, #4c1d3d 0%, #dc586d 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 15px;
            margin-bottom: 1.5rem;
        }
        .garage-car h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.5rem;
        }
        .garage-car-stats {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 1rem;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        .garage-car-stat {
            background: rgba(255,255,255,0.2);
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
        }
        .garage-stats-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        @media (max-width: 600px) {
            .garage-stats-section {
                grid-template-columns: 1fr;
            }
        }
        .garage-chart-container {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1rem;
            min-height: 250px;
        }
        .garage-totals {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.5rem;
        }
        .garage-total-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.8rem;
            padding-bottom: 0.8rem;
            border-bottom: 1px solid #eee;
        }
        .garage-total-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .garage-total-label {
            color: #666;
        }
        .garage-total-value {
            font-weight: bold;
            color: #dc586d;
        }
        .garage-parts-section {
            margin-top: 1.5rem;
        }
        .garage-parts-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .garage-parts-list {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }
        .garage-part-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 10px;
            border-left: 4px solid #4CAF50;
        }
        .garage-part-info h4 {
            margin: 0 0 0.3rem 0;
            font-size: 1rem;
        }
        .garage-part-info .category {
            color: #666;
            font-size: 0.85rem;
        }
        .garage-part-stats {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        .garage-part-stat {
            text-align: center;
            font-size: 0.8rem;
        }
        .garage-part-stat .value {
            font-weight: bold;
            color: #dc586d;
            display: block;
        }
        .garage-part-stat .label {
            color: #666;
            font-size: 0.7rem;
        }
        .btn-remove-part {
            background: #dc3545;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            line-height: 1;
            transition: all 0.2s;
        }
        .btn-remove-part:hover {
            background: #c82333;
            transform: scale(1.1);
        }
        .btn-clear-parts {
            background: #ffc107;
            color: #333;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.85rem;
        }
        .btn-clear-parts:hover {
            background: #e0a800;
        }
        .garage-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            justify-content: center;
        }
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }
        .notification.success { background: #4CAF50; }
        .notification.error { background: #dc3545; }
        .notification.warning { background: #ffc107; color: #333; }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

async function loadAndRenderGarage() {
    const content = document.getElementById('garageContent');
    content.innerHTML = '<div class="garage-loading">Загрузка гаража...</div>';

    // Загружаем с сервера
    const data = await fetchGarage();

    if (!data.success || !data.garage) {
        content.innerHTML = `
            <div class="garage-empty">
                <h3>Гараж пуст</h3>
                <p>Выберите машину в разделе Конфигурации</p>
                <button class="btn-primary" onclick="closeGarageModal(); window.location.href='pages/configurations.html'">
                    Перейти к конфигурациям
                </button>
            </div>
        `;
        return;
    }

    renderGarageContent(data.garage);
}

function renderGarageContent(garage) {
    const content = document.getElementById('garageContent');
    const parts = garage.parts || [];
    const stats = garage.stats || {};

    content.innerHTML = `
        <div class="garage-car">
            <h3>${garage.brand} ${garage.model} (${garage.year})</h3>
            <div>${garage.country || ''}</div>
            <div class="garage-car-stats">
                <span class="garage-car-stat">${garage.power || '?'}</span>
                <span class="garage-car-stat">${garage.torque || '?'}</span>
                <span class="garage-car-stat">Рейтинг: ${garage.compatibilityRating || '?'}</span>
            </div>
        </div>

        <div class="garage-stats-section">
            <div class="garage-chart-container">
                <canvas id="garageRadarChart"></canvas>
            </div>
            <div class="garage-totals">
                <h4>📊 Прирост от деталей</h4>
                <div class="garage-total-item">
                    <span class="garage-total-label">Мощность:</span>
                    <span class="garage-total-value">+${stats.totalPowerGain || 0} л.с.</span>
                </div>
                <div class="garage-total-item">
                    <span class="garage-total-label">Крутящий момент:</span>
                    <span class="garage-total-value">+${stats.totalTorqueGain || 0} Нм</span>
                </div>
                <div class="garage-total-item">
                    <span class="garage-total-label">Совместимость:</span>
                    <span class="garage-total-value">${stats.avgCompatibility || '-'}/10</span>
                </div>
                <div class="garage-total-item">
                    <span class="garage-total-label">Сложность установки:</span>
                    <span class="garage-total-value">${stats.totalInstallDifficulty || '-'}/10</span>
                </div>
                <div class="garage-total-item">
                    <span class="garage-total-label">Деталей:</span>
                    <span class="garage-total-value">${stats.partsCount || parts.length}</span>
                </div>
            </div>
        </div>

        <div class="garage-parts-section">
            <div class="garage-parts-header">
                <h4>🔧 Установленные детали (${parts.length})</h4>
                ${parts.length > 0 ? `<button class="btn-clear-parts" onclick="clearGarageParts()">Очистить все</button>` : ''}
            </div>
            <div class="garage-parts-list" id="garagePartsList">
                ${parts.length === 0 ? '<p style="color:#666;text-align:center;padding:2rem;">Нет установленных деталей. Добавьте их из конфигураций.</p>' : ''}
            </div>
        </div>

        <div class="garage-actions">
            <button class="btn-secondary" onclick="closeGarageModal(); window.location.href='pages/configurations.html'">
                Изменить машину / добавить детали
            </button>
        </div>
    `;

    // Рендерим детали
    renderGarageParts();

    // Строим радар-чарт
    setTimeout(() => buildRadarChart(garage, stats), 100);
}

function renderGarageParts() {
    const list = document.getElementById('garagePartsList');
    if (!list) return;

    const parts = garageState.parts || [];

    if (parts.length === 0) {
        list.innerHTML = '<p style="color:#666;text-align:center;padding:2rem;">Нет установленных деталей. Добавьте их из конфигураций.</p>';
        return;
    }

    list.innerHTML = parts.map(part => `
        <div class="garage-part-item">
            <div class="garage-part-info">
                <h4>${part.name}</h4>
                <div class="category">${part.category || 'Без категории'}</div>
            </div>
            <div class="garage-part-stats">
                <div class="garage-part-stat">
                    <span class="value">+${part.powerGain || 0}</span>
                    <span class="label">л.с.</span>
                </div>
                <div class="garage-part-stat">
                    <span class="value">+${part.torqueGain || 0}</span>
                    <span class="label">Нм</span>
                </div>
                <div class="garage-part-stat">
                    <span class="value">${part.compatibilityScore || 5}</span>
                    <span class="label">совмест.</span>
                </div>
                <button class="btn-remove-part" onclick="removePartFromGarage(${part.partId})" title="Удалить">×</button>
            </div>
        </div>
    `).join('');
}

let radarChart = null;

function buildRadarChart(garage, stats) {
    const ctx = document.getElementById('garageRadarChart');
    if (!ctx) return;

    // Уничтожаем старый график
    if (radarChart) {
        radarChart.destroy();
    }

    // Данные для радара (5 параметров)
    const data = {
        labels: ['Мощность', 'Крутящий момент', 'Совместимость', 'Простота установки', 'Количество деталей'],
        datasets: [{
            label: 'Характеристики конфигурации',
            data: [
                Math.min((stats.totalPowerGain || 0) / 3, 10), // Нормализуем до 10
                Math.min((stats.totalTorqueGain || 0) / 4, 10),
                stats.avgCompatibility || 5,
                10 - (stats.totalInstallDifficulty || 5), // Инвертируем: меньше сложность = больше балл
                Math.min((stats.partsCount || garage.parts?.length || 0) * 1.5, 10)
            ],
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(76, 175, 80, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(76, 175, 80, 1)'
        }]
    };

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== EXPORT for inline onclick handlers ====================
window.openGarageModal = openGarageModal;
window.closeGarageModal = closeGarageModal;
window.removePartFromGarage = removePartFromGarage;
window.clearGarageParts = clearGarageParts;
window.addPartToGarage = addPartToGarage;
window.selectCarInGarage = selectCarInGarage;
