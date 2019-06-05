<?PHP

$data = [
    ['id' => 1, 'name' => 'Felix'],
    ['id' => 2, 'name' => 'Pan Pavek'],
];

header('Content-Type: application/json');
echo json_encode($data);