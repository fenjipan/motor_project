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

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data)) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

$delete_sql = "DELETE FROM selected_cells";
if ($conn->query($delete_sql) !== TRUE) {
    echo json_encode(['success' => false, 'message' => 'Error deleting previous records: ' . $conn->error]);
    exit;
}

$sql = "INSERT INTO selected_cells (row, col) VALUES ";
$valuesArr = [];

foreach ($data as $cell) {
    $row = (int)$cell['row'];
    $col = (int)$cell['col'];
    $valuesArr[] = "($row, $col)";
}

$sql .= implode(',', $valuesArr);

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Records inserted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $sql . '<br>' . $conn->error]);
}

$conn->close();
?>
