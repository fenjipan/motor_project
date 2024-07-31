/*!
* Start Bootstrap - Simple Sidebar v6.0.6 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

document.getElementById('tableForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;
    const cellColor = document.getElementById('cellColor').value;
    const shape = document.getElementById('shape').value;
    generateTable(rows, cols, cellColor, shape);
});

document.getElementById('saveButton').addEventListener('click', function() {
    saveSelectedCells();
});

document.getElementById('viewButton').addEventListener('click', function() {
    viewSelectedCells();
});



document.getElementById('editCellForm').addEventListener('submit', function(event) {
    event.preventDefault();
    saveCellDetails();
});

function generateTable(rows, cols, cellColor, shape) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear any existing table

    const table = document.createElement('table');
    
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            td.textContent = `(${i + 1}, ${j + 1})`;
           
            td.style.backgroundColor = cellColor;
            td.dataset.row = i + 1;
            td.dataset.col = j + 1;

            if (shape === 'circle') {
                td.style.borderRadius = '50%';
            } else if (shape === 'square') {
                td.style.borderRadius = '0';
            } else if (shape === 'rounded') {
                td.style.borderRadius = '10px';
            }

            td.addEventListener('click', function() {
                td.classList.toggle('selected');
            });

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    tableContainer.appendChild(table);
}

function saveSelectedCells() {
    const selectedCells = document.querySelectorAll('td.selected');
    const cellsData = Array.from(selectedCells).map(cell => ({
        row: cell.dataset.row,
        col: cell.dataset.col
    }));

    fetch('save.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cellsData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Selected cells saved successfully!');
        } else {
            alert('Failed to save selected cells. ' + data.message);
        }
    });
}








