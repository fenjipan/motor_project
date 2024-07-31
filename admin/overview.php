<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "table_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$sql = "SELECT 
    
    selected_cells.row,
    selected_cells.col,
    cell_details.plugged,
    cell_details.id_tube,
    cell_details.color,
    cell_details.note
FROM 
    selected_cells
LEFT JOIN 
    cell_details
ON 
    selected_cells.row = cell_details.row AND selected_cells.col = cell_details.col;"; 


$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $cells = [];
    while($row = $result->fetch_assoc()) {
        $cells[] = $row;
    }
    echo json_encode(['success' => true, 'cells' => $cells]);
} else {
    echo json_encode(['success' => false, 'message' => 'No selected cells found']);
}

$conn->close();
?>
