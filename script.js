document.addEventListener('DOMContentLoaded', () => {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            displayCSV(data);
            document.getElementById('searchInput').addEventListener('input', () => filterTable(data));
            document.getElementById('searchType').addEventListener('change', () => filterTable(data));
        });
});

function displayCSV(contents) {
    const rows = contents.split('\n');
    const tableBody = document.querySelector('#csvTable tbody');
    tableBody.innerHTML = '';

    const headers = rows[0].split(',');
    const titleIndex = headers.indexOf('title');
    const singerIndex = headers.indexOf('singer');

    rows.slice(1).forEach(row => {
        const cols = row.split(',');
        const tr = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = cols[titleIndex];
        tr.appendChild(titleCell);

        const singerCell = document.createElement('td');
        singerCell.textContent = cols[singerIndex];
        tr.appendChild(singerCell);

        tableBody.appendChild(tr);
    });
}

function filterTable(contents) {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const searchType = document.getElementById('searchType').value;
    const rows = contents.split('\n');
    const headers = rows[0].split(',');
    const index = headers.indexOf(searchType);

    const filteredRows = rows.slice(1).filter(row => {
        const cols = row.split(',');
        return cols[index].toLowerCase().includes(searchInput);
    });

    const tableBody = document.querySelector('#csvTable tbody');
    tableBody.innerHTML = '';

    filteredRows.forEach(row => {
        const cols = row.split(',');
        const tr = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = cols[headers.indexOf('title')];
        tr.appendChild(titleCell);

        const singerCell = document.createElement('td');
        singerCell.textContent = cols[headers.indexOf('singer')];
        tr.appendChild(singerCell);

        tableBody.appendChild(tr);
    });
}
