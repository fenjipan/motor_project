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



function viewSelectedCells() {
    fetch('overview.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const selectedCells = data.cells;
            displaySelectedCells(selectedCells);
        } else {
            alert('Failed to retrieve selected cells. ' + data.message);
        }
    });
}

function displaySelectedCells(selectedCells) {
    const maxRow = Math.max(...selectedCells.map(cell => cell.row));
    const maxCol = Math.max(...selectedCells.map(cell => cell.col));

    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear any existing table

    const table = document.createElement('table');

    for (let i = 1; i <= maxRow; i++) {
        const tr = document.createElement('tr');
        for (let j = 1; j <= maxCol; j++) {
            const td = document.createElement('td');
            const cell = selectedCells.find(cell => cell.row == i && cell.col == j);

            if (cell) {
                td.textContent = cell.id_tube || `(${i}, ${j})`;
                td.style.backgroundColor = cell.color || 'grey';
                td.dataset.row = i;
                td.dataset.col = j;
                td.addEventListener('click', function() {
                    openPopup(cell);
                });
            } else {
                td.style.backgroundColor = 'transparent';
            }

            td.style.width = '40px';
            td.style.height = '40px';
            td.style.borderRadius = '50p%';

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    tableContainer.appendChild(table);
}

function openPopup(cell) {
    document.getElementById('id_tube').value = cell.id_tube || `(${cell.id_tube})`;
    document.getElementById('row').value = cell.row;
    document.getElementById('col').value = cell.col;
    document.getElementById('plugged').checked = cell.plugged == 1;
    document.getElementById('color').value = cell.color || '#ffffff';
    document.getElementById('note').value = cell.note || '';
    document.getElementById('popupForm').style.display = 'block';
}

function closePopup() {
    document.getElementById('popupForm').style.display = 'none';
}

function saveCellDetails() {
    const cellDetails = {
        row: document.getElementById('row').value,
        col: document.getElementById('col').value,
        id_tube: document.getElementById('id_tube').value,
        plugged: document.getElementById('plugged').checked ? 1 : 0,
        color: document.getElementById('color').value,
        note: document.getElementById('note').value
    };

    fetch('save_cell.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cellDetails)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cell details saved successfully!');
            closePopup();
            updateCellContent(cellDetails.row, cellDetails.col, cellDetails.id_tube, cellDetails.color);
            viewSelectedCells(); // Refresh data from database
        } else {
            alert('Failed to save cell details. ' + data.message);
        }
    });
}

function updateCellContent(row, col, id_tube, color) {
    const cell = document.querySelector(`td[data-row='${row}'][data-col='${col}']`);
    if (cell) {
        cell.textContent = id_tube || `(${row}, ${col})`;
        cell.style.backgroundColor = color;
    }
}


// Dragging functionality for the popup form
dragElement(document.getElementById('popupForm'));

function dragElement(element) {
    const header = element.querySelector(".popup-header");
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}