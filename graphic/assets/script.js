
const tableData = [
    {
        name: 'Выручка, руб',
        current: '500 521',
        yesterday: { value: '480 521', percent: 4 },
        week: '4 805 121'
    },
    {
        name: 'Наличные',
        current: '300 000',
        yesterday: { value: '300 000', percent: 0 },
        week: '300 000'
    },
    {
        name: 'Безналичный расчет',
        current: '100 000',
        yesterday: { value: '100 000', percent: 0 },
        week: '100 000'
    },
    {
        name: 'Кредитные карты',
        current: '100 521',
        yesterday: { value: '100 521', percent: 0 },
        week: '100 521'
    },
    {
        name: 'Средний чек, руб',
        current: '1 300',
        yesterday: { value: '900', percent: 44 },
        week: '900'
    },
    {
        name: 'Средний гость, руб',
        current: '1 200',
        yesterday: { value: '800', percent: 50 },
        week: '800'
    },
    {
        name: 'Удаления из чека (после оплаты), руб',
        current: '1 000',
        yesterday: { value: '1 100', percent: -9 },
        week: '900'
    },
    {
        name: 'Удаления из чека (до оплаты), руб',
        current: '1 300',
        yesterday: { value: '1 300', percent: 0 },
        week: '900'
    },
    {
        name: 'Количество чеков',
        current: '34',
        yesterday: { value: '36', percent: -6 },
        week: '34'
    },
    {
        name: 'Количество гостей',
        current: '34',
        yesterday: { value: '36', percent: -6 },
        week: '32'
    }
];

const chartData = {
    'Выручка, руб': [54.5, 55.2, 54.8, 55.5, 56.1, 55.9, 56.8],
    'Наличные': [30.2, 31.1, 30.8, 31.5, 32.0, 31.7, 32.4],
    'Безналичный расчет': [24.3, 24.1, 24.0, 24.0, 24.1, 24.2, 24.4],
    'Кредитные карты': [24.3, 24.1, 24.0, 24.0, 24.1, 24.2, 24.4],
    'Средний чек, руб': [1.2, 1.3, 1.3, 1.4, 1.4, 1.3, 1.5],
    'Средний гость, руб': [1.1, 1.1, 1.2, 1.2, 1.3, 1.2, 1.3],
    'Удаления из чека (после оплаты), руб': [0.8, 0.9, 1.0, 0.9, 1.1, 1.0, 0.9],
    'Удаления из чека (до оплаты), руб': [1.2, 1.3, 1.2, 1.3, 1.4, 1.3, 1.2],
    'Количество чеков': [34, 35, 34, 36, 35, 34, 36],
    'Количество гостей': [34, 34, 35, 34, 35, 34, 35]
};

let currentChart = null;
let lastSelectedRow = null;
let lastSelectedIndex = -1;

function renderTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    tableData.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.dataset.index = index;
        tr.dataset.name = row.name;
        tr.classList.add('data-row');

        const tdName = document.createElement('td');
        tdName.textContent = row.name;
        tr.appendChild(tdName);

        const tdCurrent = document.createElement('td');
        tdCurrent.textContent = row.current;
        tr.appendChild(tdCurrent);

        const tdYesterday = document.createElement('td');
        const percentValue = row.yesterday.percent;
        const percentClass = percentValue < 0 ? 'negative' : 'positive';
        const percentSign = percentValue > 0 ? '+' : '';

        tdYesterday.className = `yesterday-cell ${percentClass}`;

        tdYesterday.innerHTML = `
    <span class="yesterday-value">${row.yesterday.value}</span>
    <span class="yesterday-percent ${percentClass}">${percentSign}${percentValue}%</span>
`;


        tr.appendChild(tdYesterday);

        const tdWeek = document.createElement('td');
        tdWeek.textContent = row.week;
        tr.appendChild(tdWeek);

        tbody.appendChild(tr);

        const chartRow = document.createElement('tr');
        chartRow.classList.add('chart-row');
        chartRow.dataset.forIndex = index;
        chartRow.style.display = 'none';

        const chartCell = document.createElement('td');
        chartCell.classList.add('chart-cell');
        chartCell.colSpan = 4;
        chartCell.innerHTML = '<div class="chart-wrapper" style="height: 250px;"><canvas class="chart-canvas"></canvas></div>';

        chartRow.appendChild(chartCell);
        tbody.appendChild(chartRow);
    });
}

function renderChart(rowIndex, rowName) {
    const chartRows = document.querySelectorAll('.chart-row');
    const dataRows = document.querySelectorAll('.data-row');
    const data = chartData[rowName] || chartData['Выручка, руб'];

    chartRows.forEach(row => {
        row.style.display = 'none';
    });

    const targetChartRow = document.querySelector(`.chart-row[data-for-index="${rowIndex}"]`);
    if (targetChartRow) {
        targetChartRow.style.display = 'table-row';

        const canvas = targetChartRow.querySelector('.chart-canvas');
        if (canvas) {
            if (currentChart) {
                currentChart.destroy();
            }

            const ctx = canvas.getContext('2d');
            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
                    datasets: [{
                        label: rowName,
                        data: data,
                        borderColor: '#037D50',
                        borderWidth: 3,
                        pointBackgroundColor: '#037D50',
                        pointRadius: 4,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                    },
                    scales: {
                        y: {
                            display: true,
                            grid: {
                                color: '#ffffff',
                                tickColor: '#000000'
                            },
                            ticks: {
                                color: '#000000',
                                stepSize: 1,
                                callback: function (value) {
                                    return '';
                                }
                            },
                            border: {
                                color: '#000000',
                                width: 2
                            }
                        },
                        x: {
                            display: true,
                            grid: {
                                color: '#ffffff',
                                tickColor: '#000000'
                            },
                            ticks: {
                                color: '#000000',
                                callback: function (value, index) {
                                    return '';
                                }
                            },
                            border: {
                                color: '#000000',
                                width: 2
                            }
                        }
                    }
                }
            });
        }
    }
}

function handleRowClick(event) {
    const row = event.currentTarget;
    const rowIndex = row.dataset.index;
    const rowName = row.dataset.name;

    if (lastSelectedIndex === parseInt(rowIndex)) {
        const chartRow = document.querySelector(`.chart-row[data-for-index="${rowIndex}"]`);
        if (chartRow) {
            chartRow.style.display = 'none';
        }
        row.classList.remove('selected');
        lastSelectedIndex = -1;
        lastSelectedRow = null;
        return;
    }

    if (lastSelectedRow) {
        lastSelectedRow.classList.remove('selected');
    }

    row.classList.add('selected');
    lastSelectedRow = row;
    lastSelectedIndex = parseInt(rowIndex);

    renderChart(rowIndex, rowName);
}

document.addEventListener('DOMContentLoaded', () => {
    renderTable();

    const dataRows = document.querySelectorAll('.data-row');
    dataRows.forEach(row => {
        row.addEventListener('click', handleRowClick);
    });
});