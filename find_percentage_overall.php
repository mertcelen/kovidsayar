<?php

function loadJson($fileName){
    if(!is_file($fileName)){
        return [];
    }
    return json_decode(file_get_contents($fileName),true);
}

$weekNames = array_keys(loadJson("input/translations.json"));

$all = [];
foreach($weekNames as $currentWeak) {

    $total = 0;
    $totalPercentage = 0.0;

    $percentages = loadJson("generated/total/weekly/" . $currentWeak . ".json");
    
    arsort($percentages);
    
    foreach($percentages as $city=>$value){
        $total += $value;
    }
    
    $arr = [];
    
    foreach(array_slice($percentages,0,9) as $city=>$value){
        $foo = number_format(($value / $total * 100),2);
        $totalPercentage += $foo;
        $arr[$city] = $foo;
    }
    $arr["Diğer"] = number_format(100 - $totalPercentage,2);
    
    $all[$currentWeak] = $arr;
}

file_put_contents("generated/top10percentage.json",json_encode($all,JSON_PRETTY_PRINT));
