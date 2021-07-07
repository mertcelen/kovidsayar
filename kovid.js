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
    let info = document.querySelector('.il-isimleri');
  
    element.addEventListener(
      'mouseover',
      function (event) {
        if (event.target.tagName === 'path') {
          let current = event.target.parentNode.getAttribute('data-iladi');
          toplam = Math.floor((nufus[current] < 100000 ? 100000 : nufus[current]) / 100000 * parseFloat(kovid[sourceKey][current]))
          toplamEski = Math.floor((nufus[current] < 100000 ? 100000 : nufus[current]) / 100000 * parseFloat(kovid[findPreviousKey(sourceKey)][current]))
          gunluk = Math.round(toplam / 7);
          gunlukEski = Math.round(toplamEski / 7);
          yuzbinde = parseFloat(kovid[sourceKey][current]);
          yuzbindeEski = parseFloat(kovid[findPreviousKey(sourceKey)][current]);
          if(mobileCheck()){
            document.getElementById("mobileWrapper").style.display = '';
            info = document.getElementById("mobileDetails");
          }
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
        if(mobileCheck()){
            return;
        }
        info.style.top = event.pageY + 25 + 'px';
        info.style.left = event.pageX + 'px';
      }
    );
  
    element.addEventListener(
      'mouseout',
      function (event) {
          if(mobileCheck()){
              return;
          }
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

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};