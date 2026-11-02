// Загружаем смены из памяти
let shifts = JSON.parse(localStorage.getItem('myShifts')) || [];
let editIndex = -1;

// Функция сохранения
function saveToStorage() {
    localStorage.setItem('myShifts', JSON.stringify(shifts));
}

// Отрисовка списка
function renderShifts() {
    const list = document.getElementById('shifts-list');
    list.innerHTML = '';

    if (shifts.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Смен пока нет</p>';
        return;
    }

    // Сортируем по дате
    shifts.sort((a, b) => new Date(a.date) - new Date(b.date));

    shifts.forEach((shift, index) => {
        const card = document.createElement('div');
        
        // 🎨 Сопоставляем названия с CSS-классами (цветами)
        const colorMap = {
            'Колоно 1': 'room-colono1',
            'Колоно 2': 'room-colono2',
            'ЭГДС': 'room-egds',
            'Отпуск': 'room-vacation',
            'Выходной': 'room-weekend',
            'Курсы': 'room-courses'
        };
        
        const roomClass = colorMap[shift.room] || '';
        card.className = `shift-card ${roomClass}`;
        
        // Красиво форматируем дату
        const dateObj = new Date(shift.date);
        const dateStr = dateObj.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });

        card.innerHTML = `
            <div class="shift-info">
                <div class="date">${dateStr}</div>
                <div class="room-name">${shift.room}</div>
                ${shift.note ? `<div class="note">📌 ${shift.note}</div>` : ''}
            </div>
            <div class="shift-actions">
                <button class="icon-btn edit-btn" onclick="openEdit(${index})">✏️</button>
                <button class="icon-btn delete-btn" onclick="deleteShift(${index})">🗑</button>
            </div>
        `;
        list.appendChild(card);
    });
}

// Добавление
function addShift() {
    const date = document.getElementById('shift-date').value;
    const room = document.getElementById('shift-room').value;
    const note = document.getElementById('shift-note').value;

    if (!date || !room) {
        alert('Пожалуйста, выберите дату и тип смены!');
        return;
    }

    shifts.push({ date, room, note });
    saveToStorage();
    renderShifts();

    // Очищаем поля
    document.getElementById('shift-date').value = '';
    document.getElementById('shift-room').value = '';
    document.getElementById('shift-note').value = '';
}

// Удаление
function deleteShift(index) {
    if (confirm('Удалить эту запись?')) {
        shifts.splice(index, 1);
        saveToStorage();
        renderShifts();
    }
}

// Открытие редактирования
function openEdit(index) {
    editIndex = index;
    const shift = shifts[index];
    
    document.getElementById('edit-date').value = shift.date;
    document.getElementById('edit-room').value = shift.room;
    document.getElementById('edit-note').value = shift.note || '';

    document.getElementById('edit-modal').classList.remove('hidden');
}

// Закрытие
function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    editIndex = -1;
}

// Сохранение изменений
function saveEdit() {
    if (editIndex === -1) return;

    shifts[editIndex].date = document.getElementById('edit-date').value;
    shifts[editIndex].room = document.getElementById('edit-room').value;
    shifts[editIndex].note = document.getElementById('edit-note').value;

    saveToStorage();
    renderShifts();
    closeModal();
}

// Инициализация (сегодняшняя дата по умолчанию)
window.onload = () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('shift-date').value = today;
    renderShifts();
};
