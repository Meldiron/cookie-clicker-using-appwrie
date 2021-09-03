<?php

include './vendor/autoload.php';
use Appwrite\Client;
use Appwrite\Services\Database;

echo "Starting calculation";


$client = new Client();
$client
    ->setEndpoint($_ENV['APPWRITE_ENDPOINT'])
    ->setProject($_ENV['APPWRITE_FUNCTION_PROJECT_ID'])
    ->setKey($_ENV['APPWRITE_API_KEY'])
;

$database = new Database($client);


$profilesQuery = $database->listDocuments("6130e787a74d8", [], 1);
$totalProfiles = $profilesQuery['sum'];

$profiles = [];

for($offset = 0; $offset < $totalProfiles; $offset += 100) {
    $profilesChunk = $database->listDocuments("6130e787a74d8", [], 100, $offset);

    array_push($profiles, ...$profilesChunk['documents']);
}

$totalProfiles = count($profiles);
$totalClicks = 0;

foreach($profiles as $profile) {
    $totalClicks += $profile['clicks'];
}

$averageClicks = round($totalClicks / $totalProfiles);

$database->createDocument("6131b30f7b613", [
    'averageClicks' => $averageClicks,
    'timeAt' => microtime(true)
], ['*'], []);

echo "Finished calculation with result of {$totalProfiles} profiles and {$averageClicks} average clicks";

?>