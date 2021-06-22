 let calculated = [];
 let dataKeys = Object.keys(kovid);
 let sourceKey = dataKeys[dataKeys.length - 1];
 let lastType = 2;
 let colorType = 2;
 svgturkiyeharitasi();
 calculate(2);
 function calculate(type = null){
    calculated = [];
    if (type == null) {
        type = lastType;
    }else{
        lastType = type;
    }
    
    Object.entries(nufus).forEach(([il, sayi]) => {
        if (type == "1"){
            num = Math.floor((sayi < 100000 ? 100000 : sayi) / 100000 * parseFloat(kovid[sourceKey][il]));
        }else{
            num = Math.floor(parseFloat(kovid[sourceKey][il]));
        }
        calculated.push({
            "il" : il,
            "sayi" : num 
        });
    });
    calculated = calculated.sort(function(a, b){return b.sayi - a.sayi});
    calculated.forEach(function(data,index){
        if (colorType == 1){
            cityColor = riskColor(data.sayi)
        }else if(colorType === 2){
            cityColor = riskColor2(data.sayi)
        }else{
            cityColor = RGBAToHexA(255,56,(100 - index),(100 - index) / 100);
        }
        document.querySelectorAll("[data-iladi='"+ data.il + "']").forEach(function(element){
            Array.from(element.children).forEach(path => path.style.fill = cityColor);
        });
    });
 }

 function riskColor(data){
    if (data < 10){
        return '#0d6efd';
    }else if(data < 35){
        return '#f0e513';
    }else if(data < 100){
        return '#f8931f';
    }else{
        return '#df1a23';
    }
 }

 function riskColor2(data){
    if (data < 20){
        return '#0d6efd';
    }else if(data < 50){
        return '#f0e513';
    }else if(data < 100){
        return '#f8931f';
    }else{
        return '#df1a23';
    }
 }

 function RGBAToHexA(r,g,b,a) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    a = Math.round(a * 255).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a.length == 1)
      a = "0" + a;
  
    return "#" + r + g + b + a;
  }

  function setSourceDate(){
    sourceKey = document.getElementById("dateSelector").value;
    calculate()
  }

  function setDataColor(color){
    colorType = color;
    if (color == 1){
        document.getElementById("btnradio2").click();
    }else{
        calculate()
    }
  }

function findTopCities(){
    let selector = document.getElementById("dateSelector");
    console.log(selector.value);
}

window.onload = function(){
    let selector = document.getElementById("dateSelector");

    for (const [key, value] of Object.entries(aciklamalar)) {
        let option = document.createElement("option");
        option.text = value;
        option.value = key;
        selector.add(option);
    }
    selector.lastChild.selected = 'selected';
}