// Tunning Manual 8080 - Data Loader

// Загрузка данных о тюнинг-деталях
class PartsDataLoader {
    constructor() {
        this.jdmParts = null;
        this.europeParts = null;
        this.czechParts = null;
        this.loaded = false;
    }

    // Загрузка данных о деталях
    async loadPartsData() {
        try {
            // Загрузка JDM деталей
            const jdmResponse = await fetch('../data/jdm-parts.json');
            this.jdmParts = await jdmResponse.json();
            
            // Загрузка European деталей
            const europeResponse = await fetch('../data/europe-parts.json');
            this.europeParts = await europeResponse.json();
            
            // Загрузка Czech деталей
            const czechResponse = await fetch('../data/czech-parts.json');
            this.czechParts = await czechResponse.json();
            
            this.loaded = true;
            console.log('🔧 Parts data loaded successfully');
            console.log('🇯🇵 JDM Parts:', this.jdmParts.items.length);
            console.log('🇩🇪 Europe Parts:', this.europeParts.items.length);
            console.log('🇨🇿 Czech Parts:', this.czechParts.items.length);
            
            return true;
        } catch (error) {
            console.error('❌ Error loading parts data:', error);
            return false;
        }
    }

    // Получить детали для страны
    getPartsForCountry(country) {
        if (!this.loaded) {
            console.warn('⚠️ Data not loaded yet');
            return [];
        }
        
        switch(country) {
            case 'japan':
                return this.jdmParts.items;
            case 'germany':
                return this.europeParts.items;
            case 'czech':
                return this.czechParts.items; // Чешские детали
            default:
                return [];
        }
    }

    // Получить детали для конкретного автомобиля
    getPartsForCar(carId, country) {
        const parts = this.getPartsForCountry(country);
        return parts.filter(part => {
            // Фильтрация по ID автомобиля (в реальном приложении будет более сложная логика)
            return part.compatibilityScore >= 7; // Только детали с хорошей совместимостью
        });
    }

    // Получить детали по категории
    getPartsByCategory(category, country) {
        const parts = this.getPartsForCountry(country);
        return parts.filter(part => part.category === category);
    }

    // Получить детали по уровню сложности установки
    getPartsByDifficulty(maxDifficulty, country) {
        const parts = this.getPartsForCountry(country);
        return parts.filter(part => part.specs.installDifficulty <= maxDifficulty);
    }

    // Рассчитать общую стоимость комплекта
    calculateKitCost(partIds, country) {
        const parts = this.getPartsForCountry(country);
        const selectedParts = parts.filter(part => partIds.includes(part.id));
        
        return selectedParts.reduce((total, part) => {
            return total + (part.specs.price || 0);
        }, 0);
    }

    // Получить рекомендуемые детали для автомобиля
    getRecommendedParts(carId, country) {
        const parts = this.getPartsForCountry(country);
        
        // Сортировка по совместимости и цене
        return parts
            .filter(part => part.specs.compatibilityScore >= 8)
            .sort((a, b) => {
                // Сначала по совместимости, затем по цене
                if (b.specs.compatibilityScore !== a.specs.compatibilityScore) {
                    return b.specs.compatibilityScore - a.specs.compatibilityScore;
                }
                return (a.specs.price || 0) - (b.specs.price || 0);
            })
            .slice(0, 10); // Топ-10 рекомендаций
    }

    // Получить категории деталей
    getCategories(country) {
        const parts = this.getPartsForCountry(country);
        const categories = [...new Set(parts.map(part => part.category))];
        
        return categories.map(category => {
            const categoryParts = parts.filter(part => part.category === category);
            return {
                name: category,
                count: categoryParts.length,
                avgPrice: categoryParts.reduce((sum, part) => sum + (part.specs.price || 0), 0) / categoryParts.length,
                avgCompatibility: categoryParts.reduce((sum, part) => sum + part.specs.compatibilityScore, 0) / categoryParts.length
            };
        });
    }
}

// Глобальный экземпляр загрузчика данных
window.partsLoader = new PartsDataLoader();

// Утилиты для работы с данными
window.PartsUtils = {
    // Форматирование цены
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    },

    // Получение названия категории
    getCategoryName(category) {
        const categoryNames = {
            'engine.turbo': 'Турбины',
            'engine.turbo_kit': 'Турбо-киты',
            'engine.intake': 'Впускные системы',
            'engine.intercooler': 'Интеркулеры',
            'engine.chip_tuning': 'Чип-тюнинг',
            'exhaust.system': 'Выхлопные системы',
            'suspension.coilovers': 'Подвеска',
            'transmission.swap': 'Коробки передач'
        };
        return categoryNames[category] || category;
    },

    // Получение уровня сложности
    getDifficultyLevel(difficulty) {
        const levels = {
            1: 'Очень легко',
            2: 'Легко',
            3: 'Средне',
            4: 'Сложно',
            5: 'Очень сложно',
            6: 'Экспертный уровень',
            7: 'Профессиональный уровень',
            8: 'Мастерской уровень',
            9: 'Экстремально сложно'
        };
        return levels[difficulty] || 'Неизвестно';
    },

    // Получение цвета для оценки совместимости
    getCompatibilityColor(score) {
        if (score >= 9) return '#4CAF50'; // Зеленый
        if (score >= 7) return '#FF9800'; // Оранжевый
        return '#F44336'; // Красный
    },

    // Генерация HTML для детали
    createPartHTML(part) {
        const price = window.PartsUtils.formatPrice(part.specs.price);
        const difficulty = window.PartsUtils.getDifficultyLevel(part.specs.installDifficulty);
        const category = window.PartsUtils.getCategoryName(part.category);
        const compatibilityColor = window.PartsUtils.getCompatibilityColor(part.specs.compatibilityScore);
        
        return `
            <div class="part-card" style="border-left: 4px solid ${compatibilityColor};">
                <div class="part-header">
                    <h4>${part.name}</h4>
                    <span class="compatibility-score" style="color: ${compatibilityColor};">
                        ${part.specs.compatibilityScore}/10
                    </span>
                </div>
                <div class="part-specs">
                    <div class="spec-item">
                        <span class="spec-label">Категория:</span>
                        <span class="spec-value">${category}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Прирост мощности:</span>
                        <span class="spec-value">+${part.specs.powerGain} л.с.</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Прирост момента:</span>
                        <span class="spec-value">+${part.specs.torqueGain} Нм</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Сложность:</span>
                        <span class="spec-value">${difficulty}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Цена:</span>
                        <span class="spec-value price">${price}</span>
                    </div>
                </div>
                ${part.instruction ? `<div class="part-instruction"><strong>Инструкция:</strong> ${part.instruction}</div>` : ''}
            </div>
        `;
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    // Загружаем данные о деталях
    await window.partsLoader.loadPartsData();
    
    // Добавляем стили для карточек деталей
    const style = document.createElement('style');
    style.textContent = `
        .part-card {
            background: rgba(255, 187, 148, 0.1);
            border: 1px solid var(--accent-color);
            border-radius: 10px;
            padding: 1.5rem;
            margin: 1rem 0;
            transition: all 0.3s ease;
        }
        
        .part-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 187, 148, 0.3);
        }
        
        .part-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .part-header h4 {
            margin: 0;
            color: var(--accent-color);
            font-size: 1.1rem;
        }
        
        .compatibility-score {
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .part-specs {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
        }
        
        .spec-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .spec-label {
            color: var(--secondary-color);
            font-size: 0.9rem;
        }
        
        .spec-value {
            color: var(--text-light);
            font-weight: 500;
        }
        
        .spec-value.price {
            color: var(--accent-color);
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .part-instruction {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 0.9rem;
            line-height: 1.4;
        }
    `;
    document.head.appendChild(style);
});
