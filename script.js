document.addEventListener('DOMContentLoaded', () => {
    const service1Select = document.getElementById('service1');
    const service2Select = document.getElementById('service2');
    const tableBody = document.getElementById('table-body');
    const updateTime = document.getElementById('update-time');
    const profitHeader = document.getElementById('profit-header');
    let sortDirection = 1; // 1 - по возрастанию, -1 - по убыванию

    // Загрузка данных из JSON
    function loadData() {
        fetch('data.json', { cache: 'no-store' }) // Предполагается, что бэкенд сохраняет данные в data.json
            .then(response => response.json())
            .then(data => {
                updateTime.textContent = new Date(data.lastUpdated).toLocaleString();
                updateTable(data);
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }

    function updateTable(data) {
        const service1 = service1Select.value;
        const service2 = service2Select.value;
        tableBody.innerHTML = '';

        const items = data.items.filter(item => item[service1] && item[service2]);
        items.forEach(item => {
            const price1 = parseFloat(item[service1].price) || 0;
            const price2 = parseFloat(item[service2].price) || 0;
            const profit = price1 > 0 ? ((price2 - price1) / price1 * 100).toFixed(2) : 0;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${price1.toFixed(2)}</td>
                <td>$${price2.toFixed(2)}</td>
                <td>${profit}%</td>
                <td>${item[service1].count}</td>
                <td>${item[service2].count}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Сортировка по проценту прибыли
    profitHeader.addEventListener('click', () => {
        sortDirection *= -1;
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        rows.sort((a, b) => {
            const profitA = parseFloat(a.cells[3].textContent);
            const profitB = parseFloat(b.cells[3].textContent);
            return sortDirection * (profitA - profitB);
        });
        rows.forEach(row => tableBody.appendChild(row));
    });

    // Обновление при смене сервисов
    service1Select.addEventListener('change', loadData);
    service2Select.addEventListener('change', loadData);

    // Первоначальная загрузка
    loadData();
});