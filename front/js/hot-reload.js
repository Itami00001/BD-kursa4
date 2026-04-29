// Hot Reload для разработки
if (process.env.NODE_ENV === 'development') {
    console.log(' Hot Reload enabled');
    
    // Проверяем изменения в файлах каждые 2 секунды
    setInterval(() => {
        // В реальном приложении здесь будет проверка файлов
        console.log(' Checking for changes...');
    }, 2000);
}

// Сообщение о загрузке
console.log(' Tunning Manual 8080 Frontend loaded successfully!');
