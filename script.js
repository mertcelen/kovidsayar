let baseURL = "https://mertcelen.github.io/kovidsayar";
let cities = [
    "Tüm Türkiye",
    "Adana",
    "Ad\u0131yaman",
    "Afyon",
    "A\u011fr\u0131",
    "Aksaray",
    "Amasya",
    "Ankara",
    "Antalya",
    "Ardahan",
    "Artvin",
    "Ayd\u0131n",
    "Bal\u0131kesir",
    "Bart\u0131n",
    "Batman",
    "Bayburt",
    "Bilecik",
    "Bing\u00f6l",
    "Bitlis",
    "Bolu",
    "Burdur",
    "Bursa",
    "\u00c7anakkale",
    "\u00c7ank\u0131r\u0131",
    "\u00c7orum",
    "Denizli",
    "Diyarbak\u0131r",
    "D\u00fczce",
    "Edirne",
    "Elaz\u0131\u011f",
    "Erzincan",
    "Erzurum",
    "Eski\u015fehir",
    "Gaziantep",
    "Giresun",
    "G\u00fcm\u00fc\u015fhane",
    "Hakkari",
    "Hatay",
    "I\u011fd\u0131r",
    "Isparta",
    "\u0130stanbul",
    "\u0130zmir",
    "Kahramanmara\u015f",
    "Karab\u00fck",
    "Karaman",
    "Kars",
    "Kastamonu",
    "Kayseri",
    "K\u0131r\u0131kkale",
    "K\u0131rklareli",
    "K\u0131r\u015fehir",
    "Kilis",
    "Kocaeli",
    "Konya",
    "K\u00fctahya",
    "Malatya",
    "Manisa",
    "Mardin",
    "Mersin",
    "Mu\u011fla",
    "Mu\u015f",
    "Nev\u015fehir",
    "Ni\u011fde",
    "Ordu",
    "Osmaniye",
    "Rize",
    "Sakarya",
    "Samsun",
    "Siirt",
    "Sinop",
    "Sivas",
    "\u015eanl\u0131urfa",
    "\u015e\u0131rnak",
    "Tekirda\u011f",
    "Tokat",
    "Trabzon",
    "Tunceli",
    "U\u015fak",
    "Van",
    "Yalova",
    "Yozgat",
    "Zonguldak"
];

let values = {};

let mainChart = null;
let vaccineChart = null;

async function generateCitiesSelect(){
    let element = document.getElementById("citiesSelect");
    vaccinations = await loadJson("/generated/vaccine_percents.json");
    element.innerHTML = "";
    cities.forEach((city) => {
        let option = new Option();
        let text = "";
        if(vaccinations[city]){
            text = " % " + vaccinations[city];
        }
        option.text = city + text;
        option.value = city;
        element.appendChild(option);
    });
}

function generateDatesSelect(){
    let element = document.getElementById("datesSelect");
    element.innerHTML = "";
    for (const [key, value] of Object.entries(values.dates)) {
        let option = new Option();
        option.value = key;
        option.text = value;
        element.appendChild(option);
    }
    
    element.selectedIndex = element.length - 1;
}

async function loadJson(url) {
    const response = await fetch(baseURL+url,{cache: "no-store"});
    const json = await response.json();
    return json;
}

async function loadCityData(){
    values.totals = await loadJson("/generated/total/city.json");
    values.totals['Tüm Türkiye'] = await loadJson("/generated/total/country.json");
    values.percentages = await loadJson("/generated/percentage/city.json");
    values.percentages['Tüm Türkiye'] = await loadJson("/generated/percentage/country.json");
    values.dates = await loadJson("/input/translations.json");
    values.datesPretty = Object.values(await loadJson("/input/translations-short.json"));
    values.diffs = await loadJson("/generated/diffs.json");
    await generateCitiesSelect();
    showCityDetails();
    generateDatesSelect();
    showDateDetails();
}
document.querySelectorAll("input[name='chartRadio']").forEach((input) => {
    input.addEventListener('change', function(event){
        mainChart.getDatasetMeta("0").hidden=true;
        mainChart.getDatasetMeta("1").hidden=true;
        mainChart.getDatasetMeta("2").hidden=true;
        mainChart.getDatasetMeta(event.target.value).hidden=false;
        mainChart.update();
    });
});

function showCityDetails(){
    let element = document.getElementById("citiesSelect");
    if(mainChart == null){
        var ctx = document.getElementById('cityChart').getContext('2d');
        mainChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: values.datesPretty,
                datasets: [{
                    id: "total",
                    data: values.totals[element.value],
                    borderWidth: 1,
                    backgroundColor: 'rgb(223, 26, 35)',
                    hidden: false
                },
                {
                    id: "percentage",
                    data: values.percentages[element.value],
                    borderWidth: 1,
                    backgroundColor: 'rgb(13, 110, 253)',
                    hidden: true
                },
                {
                    id: "diff",
                    data: values.diffs[element.value],
                    borderWidth: 1,
                    backgroundColor: 'rgb(255, 255, 0)',
                    hidden: true
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    mainChart.data.datasets[0].data = values.totals[element.value];
    mainChart.data.datasets[1].data = values.percentages[element.value];
    mainChart.data.datasets[2].data = values.diffs[element.value];
    mainChart.update();
}

async function showDateDetails(){
    let element = document.getElementById("datesSelect");
    let current = await loadJson("/generated/percentage/weekly/" + element.value + ".json");
    for (const [city, value] of Object.entries(current)) {
        document.querySelectorAll("[data-iladi='"+ city + "']").forEach(function(element){
            Array.from(element.children).forEach(path => path.style.fill = getRiskColor(value));
        });
      }
}

function getRiskColor(data){
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

 async function loadVaccineData(){
     let vaccineData = await loadJson('generated/vaccine_percents.json');
     function colorize() {
        return (ctx) => {
          var v = ctx.parsed.y;
          var c = v < -50 ? '#D60000'
            : v < 0 ? '#F46300'
            : v < 50 ? '#0358B6'
            : '#44DE28';
          return c;
        };
      }
      if(vaccineChart == null){
        var ctx = document.getElementById('vaccineChart').getContext('2d');
        vaccineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(vaccineData),
                datasets: [{
                    data: Object.keys(vaccineData),
                    borderWidth: 1,
                    backgroundColor: 'rgb(223, 26, 35)',
                    label: 'Toplam Vaka'
                }]
            },
            options: {
                plugins: {
                  legend: false,
                },
                elements: {
                  bar: {
                    backgroundColor: colorize(),
                    borderColor: colorize(),
                    borderWidth: 2
                  }
                }
              }
        });
    }
    vaccineChart.data.datasets[0].data = Object.values(vaccineData);
    vaccineChart.update();
 }

document.querySelector('#svg-turkiye-haritasi').addEventListener('click',function(event){
    if (event.target.tagName === 'path') {
        let current = event.target.parentNode.getAttribute('data-iladi');
        let cityElement = document.getElementById("citiesSelect");
        cityElement.value = current;
        showCityDetails();
      }
});
loadCityData();
// loadVaccineData();