<?php

function loadJson($fileName){
    if(!is_file($fileName)){
        return [];
    }
    return json_decode(file_get_contents($fileName),true);
}

$allDifs = [];

$data = loadJson("generated/total/country.json");
$diffs = [0];

for($i = 1; $i < count($data); $i++) {
    $current = $data[$i];
    $previous = $data[$i - 1];
    $diffs[] = round((1 - ($previous / $current)) * 100, 2);
}

$allDifs['Tüm Türkiye'] = $diffs;
$data = loadJson("generated/total/city.json");

foreach($data as $cityName => $values) {
    $diffs = [0];
    for($i = 1; $i < count($values); $i++) {
        $current = $values[$i];
        $previous = $values[$i - 1];
        $diffs[] = round((1 - ($previous / $current)) * 100, 2);
    }
    $allDifs[$cityName] = $diffs;
}

file_put_contents('generated/diffs.json',json_encode($allDifs,JSON_PRETTY_PRINT));
