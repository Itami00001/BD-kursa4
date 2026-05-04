// News System for Tunning Manual 8080
// Handles displaying, creating news with markdown support and COIN payments

let currentNews = [];

// Load and display news modal
async function loadNewsModal() {
    const modal = document.getElementById('newsModal');
    if (!modal) {
        createNewsModal();
    }
    
    document.getElementById('newsModal').style.display = 'block';
    await loadNewsList();
}

// Create news modal HTML
function createNewsModal() {
    const modal = document.createElement('div');
    modal.id = 'newsModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content news-modal" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closeNewsModal()">&times;</span>
            <h2 style="color: var(--accent-color); margin-bottom: 1.5rem;">📰 Новости</h2>
            
            <div class="news-actions" style="margin-bottom: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="btn-primary" onclick="showCreateNewsForm()" style="padding: 0.8rem 1.5rem; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    ➕ Создать новость
                </button>
                <span style="color: #888; font-size: 0.9rem; align-self: center;">
                    💰 Стоимость: 1000 + оформление (Classic 500 / Premium 1500)
                </span>
            </div>
            
            <div id="createNewsForm" style="display: none; background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 1rem;">Создание новости</h3>
                <input type="text" id="newsTitle" placeholder="Заголовок новости" style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 5px;">
                <textarea id="newsContent" placeholder="Содержание (Markdown поддерживается)..." rows="6" style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 5px; resize: vertical;"></textarea>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #aaa;">Загрузить .md файл:</label>
                    <input type="file" id="mdFileInput" accept=".md,.markdown,.txt" onchange="handleMDFileUpload(event)" style="color: white;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #aaa;">Оформление:</label>
                    <select id="newsStyle" style="padding: 0.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 5px;">
                        <option value="classic">Classic (+500 COIN) - Простое оформление</option>
                        <option value="premium">Premium (+1500 COIN) - Золотая рамка, приоритет</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 1rem;">
                    <button onclick="createNews()" class="btn-primary" style="padding: 0.8rem 2rem; background: #00b894; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        ✅ Опубликовать
                    </button>
                    <button onclick="hideCreateNewsForm()" style="padding: 0.8rem 2rem; background: #636e72; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Отмена
                    </button>
                </div>
            </div>
            
            <div id="newsList" style="display: flex; flex-direction: column; gap: 1rem;">
                <p style="text-align: center; color: #888;">Загрузка новостей...</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal on outside click
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeNewsModal();
        }
    });
}

// Close news modal
function closeNewsModal() {
    const modal = document.getElementById('newsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show create news form
function showCreateNewsForm() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.id) {
        alert('Пожалуйста, войдите в систему для создания новостей');
        return;
    }
    document.getElementById('createNewsForm').style.display = 'block';
}

// Hide create news form
function hideCreateNewsForm() {
    document.getElementById('createNewsForm').style.display = 'none';
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
}

// Handle MD file upload
function handleMDFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        // Try to extract title from first line (if starts with #)
        const lines = content.split('\n');
        let title = '';
        let bodyContent = content;
        
        if (lines[0].startsWith('#')) {
            title = lines[0].replace(/^#+\s*/, '').trim();
            bodyContent = lines.slice(1).join('\n').trim();
        }
        
        if (title && !document.getElementById('newsTitle').value) {
            document.getElementById('newsTitle').value = title;
        }
        document.getElementById('newsContent').value = bodyContent;
    };
    reader.readAsText(file);
}

// Simple markdown to HTML converter
function markdownToHTML(markdown) {
    if (!markdown) return '';
    
    return markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/\n/gim, '<br>');
}

// Create news
async function createNews() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.id) {
        alert('Пожалуйста, войдите в систему');
        return;
    }
    
    const title = document.getElementById('newsTitle').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    const style = document.getElementById('newsStyle').value;
    
    if (!title || !content) {
        alert('Пожалуйста, заполните заголовок и содержание');
        return;
    }
    
    const baseCost = 1000;
    const styleCost = style === 'premium' ? 1500 : 500;
    const totalCost = baseCost + styleCost;
    
    if (!confirm(`Создать новость за ${totalCost} COIN?\n\nБазовая стоимость: ${baseCost}\nОформление (${style}): ${styleCost}\n\nИтого: ${totalCost} COIN`)) {
        return;
    }
    
    try {
        const response = await fetch('/api/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                author: currentUser.fullname || currentUser.name || currentUser.email,
                userId: currentUser.id,
                style
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Новость успешно создана!\nСписано: ${result.cost} COIN\nОстаток: ${result.remainingBalance} COIN`);
            hideCreateNewsForm();
            await loadNewsList();
            // Обновить баланс в навбаре
            if (typeof loadUserBalance === 'function') {
                loadUserBalance();
            }
        } else {
            alert('Ошибка: ' + result.error);
        }
    } catch (error) {
        console.error('Error creating news:', error);
        alert('Ошибка при создании новости: ' + error.message);
    }
}

// Load and display news list
async function loadNewsList() {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = '<p style="text-align: center; color: #888;">Загрузка новостей...</p>';
    
    try {
        const response = await fetch('/api/news');
        const result = await response.json();
        
        if (!result.success || !result.news || result.news.length === 0) {
            newsList.innerHTML = '<p style="text-align: center; color: #888;">Нет новостей</p>';
            return;
        }
        
        currentNews = result.news;
        
        newsList.innerHTML = result.news.map(news => {
            const isPremium = news.style === 'premium';
            const date = new Date(news.created_at).toLocaleString('ru-RU');
            const contentHTML = markdownToHTML(news.content);
            
            return `
                <div class="news-item ${isPremium ? 'premium' : 'classic'}" 
                     style="${isPremium ? 
                        'background: linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,140,0,0.1) 100%); border: 2px solid #FFD700; border-radius: 15px; padding: 1.5rem; position: relative; order: -1;' : 
                        'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1.5rem;'}"
                     data-id="${news.id}">
                    ${isPremium ? '<div style="position: absolute; top: -1px; right: -1px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #333; padding: 0.3rem 0.8rem; border-radius: 0 15px 0 10px; font-size: 0.8rem; font-weight: bold;">⭐ PREMIUM</div>' : ''}
                    
                    <h3 style="color: var(--accent-color); margin-bottom: 0.5rem; ${isPremium ? 'font-size: 1.4rem;' : ''}">${escapeHtml(news.title)}</h3>
                    
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem; color: #888; font-size: 0.85rem;">
                        <span>👤 ${escapeHtml(news.author)}</span>
                        <span>📅 ${date}</span>
                        <span>👁️ ${news.views} просмотров</span>
                    </div>
                    
                    <div class="news-content" style="line-height: 1.6; color: #ddd; ${isPremium ? 'font-size: 1.05rem;' : ''}">
                        ${contentHTML}
                    </div>
                    
                    ${news.author_id === (JSON.parse(localStorage.getItem('currentUser') || '{}').id) ? 
                        `<button onclick="deleteNews(${news.id})" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.85rem;">🗑️ Удалить</button>` : ''
                    }
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading news:', error);
        newsList.innerHTML = '<p style="text-align: center; color: #e74c3c;">Ошибка загрузки новостей</p>';
    }
}

// Delete news
async function deleteNews(newsId) {
    if (!confirm('Удалить эту новость?')) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    try {
        const response = await fetch(`/api/news/${newsId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Новость удалена');
            await loadNewsList();
        } else {
            alert('Ошибка: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting news:', error);
        alert('Ошибка при удалении');
    }
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load transactions modal
function loadTransactionsModal() {
    // Create modal if not exists
    let modal = document.getElementById('transactionsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'transactionsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
                <span class="close" onclick="closeTransactionsModal()">&times;</span>
                <h2 style="color: var(--accent-color); margin-bottom: 1.5rem;">💳 История транзакций</h2>
                <div id="transactionsList">
                    <p style="text-align: center; color: #888;">Загрузка...</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeTransactionsModal();
            }
        });
    }
    
    modal.style.display = 'block';
    loadTransactionsList();
}

// Close transactions modal
function closeTransactionsModal() {
    const modal = document.getElementById('transactionsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Load transactions list (demo implementation)
async function loadTransactionsList() {
    const list = document.getElementById('transactionsList');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.id) {
        list.innerHTML = '<p style="text-align: center; color: #888;">Войдите для просмотра транзакций</p>';
        return;
    }
    
    // Demo transactions - in real app would fetch from API
    list.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: rgba(255,255,255,0.1);">
                    <th style="padding: 0.8rem; text-align: left;">Дата</th>
                    <th style="padding: 0.8rem; text-align: left;">Тип</th>
                    <th style="padding: 0.8rem; text-align: right;">Сумма</th>
                    <th style="padding: 0.8rem; text-align: left;">Описание</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 0.8rem;">${new Date().toLocaleDateString('ru-RU')}</td>
                    <td style="padding: 0.8rem;">💰 Начисление</td>
                    <td style="padding: 0.8rem; text-align: right; color: #00b894;">+1000 COIN</td>
                    <td style="padding: 0.8rem;">Стартовый бонус</td>
                </tr>
            </tbody>
        </table>
    `;
}
