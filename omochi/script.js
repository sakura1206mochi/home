document.addEventListener('DOMContentLoaded', () => {
    fetch('omochi_list.csv')
        .then(response => response.text())
        .then(data => {
            displayCSV(data);
            document.getElementById('searchInput').addEventListener('input', () => filterTable(data));
            document.getElementById('searchType').addEventListener('change', () => filterTable(data));
            document.getElementById('genreFilter').addEventListener('change', () => filterTable(data)); // ジャンルフィルターの監視
        });
});

function displayCSV(contents) {
    const rows = contents.split('\n');
    const tableBody = document.querySelector('#csvTable tbody');
    tableBody.innerHTML = '';

    const headers = rows[0].split(',');
    const titleIndex = headers.indexOf('title');
    const singerIndex = headers.indexOf('singer');
    const codeIndex = headers.indexOf('code');
    const vocaloidIndex = headers.indexOf('vocaloid');
    const animeIndex = headers.indexOf('anime');

    rows.slice(1).forEach(row => {
        const cols = row.split(',');
        const tr = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = cols[titleIndex];
        tr.appendChild(titleCell);

        const singerCell = document.createElement('td');
        singerCell.textContent = cols[singerIndex];
        tr.appendChild(singerCell);

        const codeCell = document.createElement('td');
        const copyButton = document.createElement('button');
        copyButton.textContent = 'コピー';
        copyButton.addEventListener('click', () => copyToClipboard(cols[codeIndex]));
        codeCell.appendChild(copyButton);
        tr.appendChild(codeCell);

        tableBody.appendChild(tr);
    });
}

function filterTable(contents) {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const searchType = document.getElementById('searchType').value;
    const genre = document.getElementById('genreFilter').value;

    const rows = contents.split('\n');
    const headers = rows[0].split(',');

    const titleIndex = headers.indexOf('title');
    const singerIndex = headers.indexOf('singer');
    const vocaloidIndex = headers.indexOf('vocaloid');
    const animeIndex = headers.indexOf('anime');

    // 空行やカラム数不足をスキップ
    const filteredRows = rows.slice(1).filter(row => {
        const cols = row.split(',');
        if (cols.length !== headers.length) {
            return false; // カラム数が一致しない行をスキップ
        }

        if (searchType && !cols[headers.indexOf(searchType)].toLowerCase().includes(searchInput)) {
            return false; // テキスト検索条件に一致しない場合スキップ
        }

        if (genre === 'vocaloid' && cols[vocaloidIndex].toLowerCase() !== 'true') {
            return false; // ボカロ選択時、vocaloidがTRUEでない場合スキップ
        }

        if (genre === 'anime' && cols[animeIndex].toLowerCase() !== 'true') {
            return false; // アニメ選択時、animeがTRUEでない場合スキップ
        }

        return true; // 条件を満たす行のみ残す
    });

    // テーブルにフィルタ結果を反映
    const tableBody = document.querySelector('#csvTable tbody');
    tableBody.innerHTML = '';

    filteredRows.forEach(row => {
        const cols = row.split(',');
        const tr = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = cols[titleIndex];
        tr.appendChild(titleCell);

        const singerCell = document.createElement('td');
        singerCell.textContent = cols[singerIndex];
        tr.appendChild(singerCell);

        const codeCell = document.createElement('td');
        const copyButton = document.createElement('button');
        copyButton.textContent = 'コピー';
        copyButton.addEventListener('click', () => copyToClipboard(cols[headers.indexOf('code')]));
        codeCell.appendChild(copyButton);
        tr.appendChild(codeCell);

        tableBody.appendChild(tr);
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`コード "${text}" をクリップボードにコピーしました！`);
    }).catch(err => {
        alert('クリップボードへのコピーに失敗しました: ' + err);
    });
}
