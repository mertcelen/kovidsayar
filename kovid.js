 let calculated = [];
 let dataKeys = Object.keys(kovid);
 let sourceKey = dataKeys[dataKeys.length - 1];
 let lastType = 2;
 let colorType = 2;
 let yellowCount = 0;
 let blueCount = 0;
 let redCount = 0;
 let orangeCount = 0;
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
    // setCounts();
 }

 function riskColor(data){
    if (data < 10){
        blueCount++;
        return '#0d6efd';
    }else if(data < 35){
        yellowCount++;
        return '#f0e513';
    }else if(data < 100){
        orangeCount++;
        return '#f8931f';
    }else{
        redCount++;
        return '#df1a23';
    }
 }

 function setCounts(){
     document.getElementById("redCount").innerHTML = redCount;
     document.getElementById("blueCount").innerHTML = blueCount;
     document.getElementById("orangeCount").innerHTML = orangeCount;
     document.getElementById("yellowCount").innerHTML = yellowCount;
     yellowCount = 0;
     redCount = 0;
     blueCount = 0;
     orangeCount = 0;
 }

 function riskColor2(data){
    if (data < 20){
        blueCount++;
        return '#0d6efd';
    }else if(data < 50){
        yellowCount++;
        return '#f0e513';
    }else if(data < 100){
        orangeCount++;
        return '#f8931f';
    }else{
        redCount++;
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


function svgturkiyeharitasi() {
    const element = document.querySelector('#svg-turkiye-haritasi');
    const info = document.querySelector('.il-isimleri');
  
    element.addEventListener(
      'mouseover',
      function (event) {
        if (event.target.tagName === 'path') {
          let current = event.target.parentNode.getAttribute('data-iladi');
          toplam = Math.floor((nufus[current] < 100000 ? 100000 : nufus[current]) / 100000 * parseFloat(kovid[sourceKey][current]))
          toplamEski = Math.floor((nufus[current] < 100000 ? 100000 : nufus[current]) / 100000 * parseFloat(kovid[findPreviousKey(sourceKey)][current]))
          gunluk = Math.round(toplam / 7);
          gunlukEski = Math.round(toplamEski / 7);
          yuzbinde = parseFloat(kovid[sourceKey][current])
          yuzbindeEski = parseFloat(kovid[findPreviousKey(sourceKey)][current])
          info.innerHTML = [
            '<div><b>',
            event.target.parentNode.getAttribute('data-iladi') + "</b><br><br>" + aciklamalar[sourceKey] + "<br>",
            'Yüzbinde : ' + yuzbinde + '<br>',
            'Toplam : ' + toplam + '<br><br>' + aciklamalar[findPreviousKey(sourceKey)] + '<br>',
            'Yüzbinde : ' + yuzbindeEski + '<br>',
            'Toplam : ' + toplamEski,
            '</div>'
          ].join('');
        }
      }
    );
  
    element.addEventListener(
      'mousemove',
      function (event) {
        info.style.top = event.pageY + 25 + 'px';
        info.style.left = event.pageX + 'px';
      }
    );
  
    element.addEventListener(
      'mouseout',
      function (event) {
        info.innerHTML = '';
      }
    );
  }


function findPreviousKey(currentKey){
    let previous = null;
    for(let element of Object.keys(kovid)) {
        if(element == currentKey){
            return previous;
        }
        previous = element;
    }
    return currentKey;
}