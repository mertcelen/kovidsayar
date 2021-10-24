<?php


function loadJson($fileName){
    if(!is_file($fileName)){
        return [];
    }
    return json_decode(file_get_contents($fileName),true);
}

$translations = array_keys(loadJson("input/translations.json"));

$cityPercentages = loadJson("generated/percentage/city.json");

$peakTimes = [];

foreach($cityPercentages as $name => $data ) {
    $max = max($data);
    $date = $translations[array_search($max,$data)];
    if(array_key_exists($date,$peakTimes)){
        $foo = &$peakTimes[$date];
        $foo[] = $name;
    }else{
        $peakTimes[$date] = [$name];
    }
}

file_put_contents('generated/peaktimes.json',json_encode($peakTimes,JSON_PRETTY_PRINT));