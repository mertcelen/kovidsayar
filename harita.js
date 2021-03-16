/*! SVG Türkiye Haritası | MIT Lisans | dnomak.com */

function svgturkiyeharitasi() {
    const element = document.querySelector('#svg-turkiye-haritasi');
    const info = document.querySelector('.il-isimleri');
  
    element.addEventListener(
      'mouseover',
      function (event) {
        if (event.target.tagName === 'path') {
          let current = event.target.parentNode.getAttribute('data-iladi');
          if (lastType == "1"){
            num = Math.floor((nufus[current] < 100000 ? 100000 : nufus[current]) / 100000 * parseFloat(kovid[sourceKey][current]))
          }else{
            num = parseFloat(kovid[sourceKey][current])
          }
          info.innerHTML = [
            '<div>',
            event.target.parentNode.getAttribute('data-iladi') + "<br>",
            num,
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