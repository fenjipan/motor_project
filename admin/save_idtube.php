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

$row = $data['row'];
$col = $data['col'];
$id_tube = $data['id_tube'];


// Check if the cell already exists in the table
$sql_check = "SELECT * FROM cell_details WHERE row = $row AND col = $col";
$result_check = $conn->query($sql_check);

if ($result_check->num_rows > 0) {
    // Update the existing record
    $sql = "UPDATE cell_details SET id_tube = '$id_tube' WHERE row = $row AND col = $col";
} else {
    // Insert a new record
    $sql = "INSERT INTO cell_details (row, col, id_tube) VALUES ($row, $col, '$id_tube')";
}

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Record saved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $sql . '<br>' . $conn->error]);
}

$conn->close();
?>
