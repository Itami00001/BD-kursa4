// News System for Tunning Manual 8080
// Handles displaying, creating news with markdown support and COIN payments

let currentNews = [];

// Current viewing news
let viewingNewsId = null;

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
        <div class="modal-content news-modal" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
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
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #aaa; font-weight: 500;">Название документа:</label>
                    <input type="text" id="newsDocTitle" placeholder="Например: Новости тюнинга 2024" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 5px;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #aaa; font-weight: 500;">Заголовок новости:</label>
                    <input type="text" id="newsTitle" placeholder="Краткий заголовок для отображения в ленте" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 5px;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #aaa; font-weight: 500;">Содержание (Markdown поддерживается):</label>
                    <textarea id="newsContent" placeholder="Полное содержание новости..." rows="8" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 5px; resize: vertical; font-family: monospace;"></textarea>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #aaa;">Загрузить .md файл:</label>
                    <input type="file" id="mdFileInput" accept=".md,.markdown,.txt" onchange="handleMDFileUpload(event)" style="color: white;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #aaa; font-weight: 500;">Оформление:</label>
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
            
            <div id="fullNewsView" style="display: none; margin-bottom: 1.5rem;">
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
    document.getElementById('newsList').style.display = 'none';
}

// Hide create news form
function hideCreateNewsForm() {
    document.getElementById('createNewsForm').style.display = 'none';
    document.getElementById('newsList').style.display = 'flex';
}

// Show full news view
async function showFullNews(newsId) {
    viewingNewsId = newsId;
    const newsList = document.getElementById('newsList');
    const fullNews = document.getElementById('fullNewsView');
    
    // Find news in current list or fetch from API
    let news = currentNews.find(n => n.id == newsId);
    
    if (!news) {
        try {
            const response = await fetch(`/api/news/${newsId}`);
            const result = await response.json();
            if (result.success) {
                news = result.news;
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }
    
    if (!news) {
        alert('Новость не найдена');
        return;
    }
    
    const isPremium = news.style === 'premium';
    const date = new Date(news.created_at).toLocaleString('ru-RU');
    const contentHTML = markdownToHTML(news.content);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    fullNews.innerHTML = `
        <div style="${isPremium ? 
            'background: linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,140,0,0.1) 100%); border: 2px solid #FFD700;' : 
            'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);'} 
            border-radius: 15px; padding: 2rem;">
            ${isPremium ? '<div style="display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #333; padding: 0.3rem 0.8rem; border-radius: 10px; font-size: 0.8rem; font-weight: bold; margin-bottom: 1rem;">⭐ PREMIUM</div>' : ''}
            
            <h2 style="color: var(--accent-color); margin-bottom: 1rem; ${isPremium ? 'font-size: 1.8rem;' : ''}">${escapeHtml(news.title)}</h2>
            
            <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; color: #888; font-size: 0.9rem;">
                <span>👤 ${escapeHtml(news.author)}</span>
                <span>📅 ${date}</span>
                <span>👁️ ${news.views} просмотров</span>
            </div>
            
            <div class="news-content" style="line-height: 1.8; color: #ddd; font-size: 1.1rem;">
                ${contentHTML}
            </div>
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button onclick="backToNewsList()" style="padding: 0.8rem 1.5rem; background: #636e72; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    ← Назад к списку
                </button>
                ${news.author_id === currentUser.id ? 
                    `<button onclick="deleteNews(${news.id})" style="padding: 0.8rem 1.5rem; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        🗑️ Удалить
                    </button>` : ''
                }
            </div>
        </div>
    `;
    
    newsList.style.display = 'none';
    fullNews.style.display = 'block';
    document.getElementById('createNewsForm').style.display = 'none';
}

// Back to news list
function backToNewsList() {
    viewingNewsId = null;
    document.getElementById('newsList').style.display = 'flex';
    document.getElementById('fullNewsView').style.display = 'none';
    document.getElementById('createNewsForm').style.display = 'none';
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
    
    const docTitle = document.getElementById('newsDocTitle').value.trim();
    const title = document.getElementById('newsTitle').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    const style = document.getElementById('newsStyle').value;
    
    if (!title || !content) {
        alert('Пожалуйста, заполните заголовок и содержание');
        return;
    }
    
    // Use docTitle in content if provided
    let finalContent = content;
    if (docTitle) {
        finalContent = `# ${docTitle}\n\n${content}`;
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
                content: finalContent,
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
            const date = new Date(news.created_at).toLocaleDateString('ru-RU');
            
            // Get preview text (first 150 chars of plain content)
            const plainContent = news.content.replace(/[#*`]/g, '').substring(0, 150);
            const previewText = plainContent.length >= 150 ? plainContent + '...' : plainContent;
            
            return `
                <div class="news-tile ${isPremium ? 'premium' : 'classic'}" 
                     style="${isPremium ? 
                        'background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,140,0,0.15) 100%); border: 2px solid #FFD700; border-radius: 15px; padding: 1.2rem; position: relative;' : 
                        'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.2rem; position: relative;'}">
                    ${isPremium ? '<div style="position: absolute; top: -2px; right: -2px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #333; padding: 0.3rem 0.8rem; border-radius: 0 15px 0 10px; font-size: 0.75rem; font-weight: bold;">⭐ PREMIUM</div>' : ''}
                    
                    <h3 style="color: var(--accent-color); margin-bottom: 0.5rem; font-size: 1.1rem; ${isPremium ? 'padding-right: 80px;' : ''}">${escapeHtml(news.title)}</h3>
                    
                    <div style="display: flex; gap: 0.8rem; margin-bottom: 0.8rem; color: #888; font-size: 0.8rem;">
                        <span>👤 ${escapeHtml(news.author)}</span>
                        <span>•</span>
                        <span>${date}</span>
                        <span>•</span>
                        <span>👁️ ${news.views}</span>
                    </div>
                    
                    <p style="color: #bbb; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem;">
                        ${escapeHtml(previewText)}
                    </p>
                    
                    <button onclick="showFullNews(${news.id})" 
                            style="${isPremium ? 
                                'background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #333;' : 
                                'background: var(--primary-color); color: white;'}
                            border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.3s; width: 100%;">
                        � Читать далее
                    </button>
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
    
    // Demo transactions for all users
    const demoTransactions = [
        { date: new Date(), type: '💰 Начисление', amount: '+1000', desc: 'Стартовый бонус', color: '#00b894' },
        { date: new Date(Date.now() - 86400000), type: '📰 Новости', amount: '-1500', desc: 'Создание premium новости', color: '#e74c3c' },
        { date: new Date(Date.now() - 172800000), type: '📰 Новости', amount: '-500', desc: 'Classic оформление новости', color: '#e74c3c' }
    ];
    
    let rows = demoTransactions.map(t => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 0.8rem;">${t.date.toLocaleDateString('ru-RU')}</td>
            <td style="padding: 0.8rem;">${t.type}</td>
            <td style="padding: 0.8rem; text-align: right; color: ${t.color};">${t.amount} COIN</td>
            <td style="padding: 0.8rem;">${t.desc}</td>
        </tr>
    `).join('');
    
    if (currentUser.id) {
        rows += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(255,215,0,0.1);">
                <td style="padding: 0.8rem;" colspan="4" style="text-align: center; color: #FFD700;">
                    👤 Ваши персональные транзакции будут отображаться здесь
                </td>
            </tr>
        `;
    }
    
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
                ${rows}
            </tbody>
        </table>
    `;
}
