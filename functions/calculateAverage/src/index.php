<?php

include './vendor/autoload.php';

use Appwrite\Client;
use Appwrite\Services\Database;

/*
  '$req' variable has:
    'headers' - object with request headers
    'payload' - object with request body data
    'env' - object with environment variables

  '$res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

return function($req, $res) {
  $client = new Client();
  $client
      ->setEndpoint($req->env['APPWRITE_FUNCTION_ENDPOINT'])
      ->setProject($req->env['APPWRITE_FUNCTION_PROJECT_ID'])
      ->setKey($req->env['APPWRITE_FUNCTION_API_KEY'])
  ;
  
  $database = new Database($client);
  
  
  $profilesQuery = $database->listDocuments("profiles", [], 1);
  $totalProfiles = $profilesQuery['sum'];
  
  $profiles = [];
  
  for($offset = 0; $offset < $totalProfiles; $offset += 100) {
      $profilesChunk = $database->listDocuments("profiles", [], 100, $offset);
  
      array_push($profiles, ...$profilesChunk['documents']);
  }
  
  $totalProfiles = count($profiles);
  $totalClicks = 0;
  
  foreach($profiles as $profile) {
      $totalClicks += $profile['clicks'];
  }
  
  $averageClicks = round($totalClicks / $totalProfiles);

  $existingAverages = $database->listDocuments('averages', [], 100);
  foreach($existingAverages['documents'] as $document) {
    $database->deleteDocument('averages', $document['$id']);
  }
  
  $database->createDocument("averages", [
      'averageClicks' => $averageClicks,
      'timeAt' => microtime(true)
  ]);
  
  echo "Finished calculation with result of {$totalProfiles} profiles and {$averageClicks} average clicks";
}

?>