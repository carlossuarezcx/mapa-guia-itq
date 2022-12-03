let map;
var markersArray = [];
var pathArray = [];
let origenSelect = document.getElementById("origen");
let destinoSelect = document.getElementById("destino");

origenSelect.addEventListener("change", function () {
        cambiarDescripcionX();
}); 
destinoSelect.addEventListener("change", function () {
    cambiarDescripcionY();

});

async function cambiarDescripcionX() {
  const response = await fetch(
    "https://mapaguiaitq.000webhostapp.com/api.php?request=getInfoEdificio&lbl="+origenSelect.value,
    {
      method: "GET",
    }
  );
  const json = await response.json();
  //console.log(json);
  let nombre,descripcion,admin
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
        nombre = json[key].nombre_locacion,
        descripcion = json[key].descripcion_locacion
        admin = json[key].admin_locacion
    }
  }
  document.getElementById("").innerHTML = "<br>Nombre: "+nombre;
  document.getElementById("pdescx").innerHTML += "<br>Descripcion: "+descripcion;
  
}
async function cambiarDescripcionY() {
  const response = await fetch(
    "https://mapaguiaitq.000webhostapp.com/api.php?request=getInfoEdificio&lbl="+destinoSelect.value,
    {
      method: "GET",
    }
  );
  //const json = await response.json();
  console.log(json);
  let nombre,descripcion,admin
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
        nombre = json[key].nombre_locacion,
        descripcion = json[key].descripcion_locacion
        admin = json[key].admin_locacion
    }
  }
  document.getElementById("pdescy").innerHTML = "<br>Nombre: "+nombre;
  document.getElementById("pdescy").innerHTML += "<br>Descripcion: "+descripcion;
  
}

function initMap() {
  const marker_itq = { lat: 20.5943, lng: -100.40516 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: marker_itq,
    zoom: 19,
    mapId: "c29e7c0a492f2fcd",
  });
  getMarkers();
  map.setTilt(45);
  /*
//sacar coordenadas al darle click 
  google.maps.event.addListener(map, "click", function (mapsMouseEvent) {
    let jsonClick = mapsMouseEvent.latLng.toJSON();
    let latclick = jsonClick["lat"];
    let lngclick = jsonClick["lng"];
    alert("{lat:" + latclick + ", lng:" + lngclick + "}");
  });
*/

  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Mostrar mi ubicación actual";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);

          var marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: {
              url: "../icons/icon-gps.png",
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(40, 40),
            },
            label: {
              color: "white",
              fontSize: "12px",
            },
          });
          bindInfoWindow(marker, map, infoWindow, details);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  
}
//Localización BTN
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
google.maps.event.addListener(
  marker,
  "click",
  (function (marker, content) {
    return function () {
      infowindow.setContent(marker.title);
      infowindow.open(map, marker);
      map.panTo(this.getPosition());
      map.setZoom(20);
      window.location.href = marker.url;
    };
  })(marker, content)
);

function bindInfoWindow(marker, map, infowindow, strDescription) {
  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(strDescription);
    infowindow.open(map, marker);
  });
}
async function getMarkers() {
  const response = await fetch(
    "https://mapaguiaitq.000webhostapp.com/api.php?request=getLocacionesMarkers",
    {
      method: "GET",
    }
  );
  const json = await response.json();
  //console.log(json);
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
      var latLng = new google.maps.LatLng(
        json[key].latitud_locacion,
        json[key].longitud_locacion
      );

      optionO = document.createElement("option");
      optionD = document.createElement("option");
      optionO.value = json[key].label_locacion;
      optionO.text = json[key].nombre_locacion;
      origenSelect.appendChild(optionO);
      optionD.value = json[key].label_locacion;
      optionD.text = json[key].nombre_locacion;
      destinoSelect.appendChild(optionD);
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: {
          //url: "../icons/red-dot.png",
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          labelOrigin: new google.maps.Point(20, 50),
          size: new google.maps.Size(60, 60),
          anchor: new google.maps.Point(16, 32),
        },
        title:json[key].label_locacion,
        label: {
          text: json[key].nombre_locacion,
          color: "black",
          fontFamily: '"Courier New", Courier,Monospace',
          fontSize: "14px",
          fontWeight: "bold",
        },
      });
      var details = `<h3>${json[key].nombre_locacion}</h3>`;
      //<h3>${json[key].label_locacion}</h3>
      markersArray.push(marker);
      bindInfoWindow(marker, map, infoWindow, details);
    }
  }
    let url_string = window.location.href;
    let url = new URL(url_string);
    let origin = url.searchParams.get("x");
    if (origin != null){
      origenSelect.value = origin;
    }
}

async function getPath() {
  clearPath();
  let x = origenSelect.value;
  let y = destinoSelect.value;
    for (var i = 0; i < markersArray.length; i++) {
        if(markersArray[i].title != x &&  markersArray[i].title != y){
            markersArray[i].setVisible(false);
        }else{
            markersArray[i].setVisible(true);
        }
  }
  if (x === y) {
    alert("El origen es igual al destino!");
  }
  const responseX = await fetch(
    "https://mapaguiaitq.000webhostapp.com/api.php?request=getLocationPath&a=" + x,
    {
      method: "GET",
    }
  );
  const jsonX = await responseX.json();
  for (var key in jsonX) {
    if (jsonX.hasOwnProperty(key)) {
      var latLngX = new google.maps.LatLng(
        jsonX[key].latitud_locacion,
        jsonX[key].longitud_locacion
      );
    }
  }
  //centrar el mapa al tener el origen
    map.setCenter(latLngX);
    map.setZoom(18);
  const responseY = await fetch(
    "https://mapaguiaitq.000webhostapp.com/api.php?request=getLocationPath&a=" + y,
    {
      method: "GET",
    }
  );
  const jsonY = await responseY.json();
  for (var key in jsonY) {
    if (jsonY.hasOwnProperty(key)) {
      var latLngY = new google.maps.LatLng(
        jsonY[key].latitud_locacion,
        jsonY[key].longitud_locacion
      );
    }
  }

  let destino = "" + x + y;
  let destino2 = "" + y + x;
  let sPath = [];
  pca = { lat: 20.593199309853677, lng: -100.4044221722147 };
  pcb = { lat: 20.593130127998514, lng: -100.40459058395543 };
  pcc = { lat: 20.59338796438045, lng: -100.40448796280705 };
  pcd = { lat: 20.59346577915266, lng: -100.40495329253756 };
  pce = { lat: 20.593636320400687, lng: -100.40451026138628 };
  pcde = { lat: 20.593589633270735, lng: -100.40458995040875 };
  pcf = { lat: 20.59380365458032, lng: -100.40465541721532 };
  pcg = { lat: 20.59401734341207, lng: -100.40467784596217 };
  pch = { lat: 20.5942583254529, lng: -100.4047440666155 };
  pci = { lat: 20.59466827655802, lng: -100.40493290641255 };
  pcj = { lat: 20.5945435867528, lng: -100.4056354215479 };
  pcoo = { lat: 20.594551360223665, lng: -100.40532299229037 };
  pcgy = { lat: 20.594642003905722, lng: -100.40508847453542 };
  pcal = { lat: 20.594864215831155, lng: -100.40521284327212 };
  pcel = { lat: 20.594947629692832, lng: -100.40495523662801 };
  pcli = { lat: 20.59482143498419, lng: -100.4046700499291 };
  pck = { lat: 20.59534266317174, lng: -100.40463650525172 };
  pclk1 = { lat: 20.595016511887366, lng: -100.40476641053641 };
  pclk2 = { lat: 20.59529352286429, lng: -100.40486176499431 };
  //estacionamiento profesores
  pcep = { lat: 20.5933424925995, lng: -100.40382964693707 };
  pcsav1 = { lat: 20.593736309947452, lng: -100.40430342944681 };
  pcsav2 = { lat: 20.5943609621546, lng: -100.40454664159776 };
  pccb = { lat: 20.593977232198778, lng: -100.40423082520508 };
  pccan = { lat: 20.594481444509782, lng: -100.40593113509179 };
  // no paint
  pcaud = { lat: 20.593962537492605, lng: -100.40574339595533 };
  pcsav4 = { lat: 20.594160312419913, lng: -100.40520030738088 };
  pccentro = { lat: 20.5934618948265, lng: -100.40546694862195 };
  pclq = { lat: 20.59303258045516, lng: -100.4048339091133 };
  pci2 = { lat: 20.59293005482051, lng: -100.4051527400197 };
  pcisla = { lat: 20.593249807807073, lng: -100.40492247042145 };
  pccentrocafe = { lat: 20.59362753816343, lng: -100.4051665152055 };
  pccampana = { lat: 20.594267129878936, lng: -100.40540744823215 };
  pcentppal = { lat: 20.593382740663532, lng: -100.40567324785728 };
  pccentrocasileros = { lat: 20.593533456387682, lng: -100.40526774669655 };
  switch (destino) {
    //EDIFICIO A > EDIFICIOS [B-K]
    case "AB":
      sPath = [latLngX, pca, pcb, latLngY];
      break;
    case "AC":
      sPath = [latLngX, pca, pcc, latLngY];
      break;
    case "AD":
      sPath = [latLngX, pca, pcc, pcde, pcd, latLngY];
      break;
    case "AE":
      sPath = [latLngX, pca, pcc, pcde, pce, latLngY];
      break;
    case "AF":
      sPath = [latLngX, pca, pcc, pcde, pcf, latLngY];
      break;
    case "AG":
      sPath = [latLngX, pca, pcc, pcde, pcg, latLngY];
      break;
    case "AH":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, latLngY];
      break;
    case "AI":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, latLngY];
      break;
    case "AJ":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcgy, pcoo, latLngY];
      break;
    case "AK":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        pck,
        latLngY,
      ];
      break;

    case "ADID":
      sPath = [latLngX, pca, latLngY];
      break;
    case "ADS":
      sPath = [latLngX, pca, latLngY];
      break;
    case "ALEE":
      sPath = [latLngX, pca, latLngY];
      break;
    case "ALMCA":
      sPath = [latLngX, pca, latLngY];
      break;
    case "AEP":
      sPath = [latLngX, pca, pcep, latLngY];
      break;
    case "ASAV1":
      sPath = [latLngX, pca, pcsav1, latLngY];
      break;
    case "ADCB":
      sPath = [latLngX, pca, pcsav1, pccb, latLngY];
      break;
    case "ALMAT":
      sPath = [latLngX, pca, pcsav1, pccb, latLngY];
      break;
    case "ASAV2":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav2, latLngY];
      break;
    case "ALIND":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, latLngY];
      break;
    case "ADDEPI":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "AEAU":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        latLngY,
      ];
      break;
    case "ALCC":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        latLngY,
      ];
      break;
    case "ALELO":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "AALB":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pcal,
        latLngY,
      ];
      break;
    case "ACM":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        pcj,
        latLngY,
      ];
      break;
    case "ACFUT":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        pccan,
        latLngY,
      ];
      break;
    case "AEAT":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        pccan,
        latLngY,
      ];
      break;
    case "ASAV4":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "AAUDI":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, pcaud, latLngY];
      break;
    case "ACAF":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "ASJD":
      sPath = [latLngX, pca, pcc, pcde, pcf, pccentro, latLngY];
      break;
    case "ABSF":
      sPath = [latLngX, pca, pcc, pcde, pcf, pccentro, latLngY];
      break;
    case "ADGV":
      sPath = [latLngX, pca, pcc, pcde, pcf, pccentro, latLngY];
      break;
    case "ADSC":
      sPath = [latLngX, pca, pcc, pcde, pcd, latLngY];
      break;
    case "ALRED":
      sPath = [latLngX, pca, pcc, pcde, pcd, latLngY];
      break;
    case "ACOPI":
      sPath = [latLngX, pca, pcc, pcde, pcd, latLngY];
      break;
    case "ACI":
      sPath = [latLngX, pca, pcb, pclq, latLngY];
      break;
    case "ASUM":
      sPath = [latLngX, pca, pcb, pclq, pci2, latLngY];
      break;
    case "ALQIM":
      sPath = [latLngX, pca, pcb, pclq, latLngY];
      break;

    //EDIFICIO B > EDIFICIOS [B-K]
    case "BC":
      sPath = [latLngX, pcb, pca, pcc, latLngY];
      break;
    case "BD":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcd, latLngY];
      break;
    case "BE":
      sPath = [latLngX, pcb, pca, pcc, pcde, pce, latLngY];
      break;
    case "BF":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcf, latLngY];
      break;
    case "BG":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcg, latLngY];
      break;
    case "BH":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, latLngY];
      break;
    case "BI":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pci, latLngY];
      break;
    case "BJ":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        latLngY,
      ];
      break;
    case "BK":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        pck,
        latLngY,
      ];
      break;

    //SEGUNDA PARTE
    case "BDID":
      sPath = [latLngX, pcb, pca, latLngY];
      break;
    case "BDS":
      sPath = [latLngX, pcb, pca, latLngY];
      break;
    case "BLEE":
      sPath = [latLngX, pcb, pca, latLngY];
      break;
    case "BLMCA":
      sPath = [latLngX, pcb, pca, latLngY];
      break;
    case "BEP":
      sPath = [latLngX, pcb, pca, pcep, latLngY];
      break;
    case "BSAV1":
      sPath = [latLngX, pcb, pca, pcsav1, latLngY];
      break;
    case "BDCB":
      sPath = [latLngX, pca, pcsav1, pccb, latLngY];
      break;
    case "BLMAT":
      sPath = [latLngX, pcb, pca, pcsav1, pccb, latLngY];
      break;
    case "BSAV2":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pcsav2, latLngY];
      break;
    case "BLIND":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pci, pcli, latLngY];
      break;
    case "BDDEPI":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        latLngY,
      ];
      break;
    case "BEAU":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        latLngY,
      ];
      break;
    case "BLCC":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        latLngY,
      ];
      break;
    case "BLELO":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        latLngY,
      ];
      break;
    case "BALB":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcal,
        latLngY,
      ];
      break;
    case "BCM":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        pcj,
        latLngY,
      ];
      break;
    case "BCFUT":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        pccan,
        latLngY,
      ];
      break;
    case "BEAT":
      sPath = [
        latLngX,
        pcb,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        pccan,
        latLngY,
      ];
      break;
    case "BSAV4":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "BAUDI":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pcsav4, pcaud, latLngY];
      break;
    case "BCAF":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "BSJD":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcf, pccentro, latLngY];
      break;
    case "BBSF":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcf, pccentro, latLngY];
      break;
    case "BDGV":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcf, pccentro, latLngY];
      break;
    case "BDSC":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcd, latLngY];
      break;
    case "BLRED":
      sPath = [latLngX, pcb, pca, pcc, pcde, pcd, latLngY];
      break;
    case "BCOPI":
      sPath = [latLngX, pcb, pcc, pcde, pcd, latLngY];
      break;
    case "BCI":
      sPath = [latLngX, pcb, pcb, pclq, latLngY];
      break;
    case "BSUM":
      sPath = [latLngX, pcb, pclq, pci2, latLngY];
      break;
    case "BLQIM":
      sPath = [latLngX, pcb, pcb, pclq, latLngY];
      break;

    //EDIFICIO C > EDIFICIOS [C-K]
    case "CD":
      sPath = [latLngX, pcc, pcisla, latLngY];
      break;
    case "CE":
      sPath = [latLngX, pcc, pcde, pce, latLngY];
      break;
    case "CF":
      sPath = [latLngX, pcc, pcde, pcf, latLngY];
      break;
    case "CG":
      sPath = [latLngX, pcc, pcde, pcg, latLngY];
      break;
    case "CH":
      sPath = [latLngX, pcc, pcde, pcg, pch, latLngY];
      break;
    case "CI":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, latLngY];
      break;
    case "CJ":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcgy, pcoo, latLngY];
      break;
    case "CK":
      sPath = [
        latLngX,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        pck,
        latLngY,
      ];
      break;
    //SEGUNDA PARTE
    case "CDID":
      sPath = [latLngX, pcc, pca, latLngY];
      break;
    case "CDS":
      sPath = [latLngX, pcc, pca, latLngY];
      break;
    case "CLEE":
      sPath = [latLngX, pcc, pca, latLngY];
      break;
    case "CLMCA":
      sPath = [latLngX, pcc, pca, latLngY];
      break;
    case "CEP":
      sPath = [latLngX, pcc, pca, pcep, latLngY];
      break;
    case "CSAV1":
      sPath = [latLngX, pcc, pce, pcsav1, latLngY];
      break;
    case "CDCB":
      sPath = [latLngX, pcc, pce, pcsav1, pccb, latLngY];
      break;
    case "CLMAT":
      sPath = [latLngX, pcc, pce, pcsav1, pccb, latLngY];
      break;
    case "CSAV2":
      sPath = [latLngX, pcc, pcde, pcg, pch, pcsav2, latLngY];
      break;
    case "CLIND":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcli, latLngY];
      break;
    case "CDDEPI":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "CEAU":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "CLCC":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "CLELO":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "CALB":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcgy, pcal, latLngY];
      break;
    case "CCM":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
      break;
    case "CCFUT":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "CEAT":
      sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "CSAV4":
      sPath = [latLngX, pcc, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "CAUDI":
      sPath = [latLngX, pcc, pcde, pcg, pch, pcsav4, pcaud, latLngY];
      break;
    case "CCAF":
      sPath = [latLngX, pcc, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "CSJD":
      sPath = [latLngX, pcc, pcde, pcf, pccentro, latLngY];
      break;
    case "CBSF":
      sPath = [latLngX, pcc, pcde, pcf, pccentro, latLngY];
      break;
    case "CDGV":
      sPath = [latLngX, pcc, pcde, pcf, pccentro, latLngY];
      break;
    case "CDSC":
      sPath = [latLngX, pcc, pcisla, latLngY];
      break;
    case "CLRED":
      sPath = [latLngX, pcc, pcisla, latLngY];
      break;
    case "CCOPI":
      sPath = [latLngX, pcc, pcisla, latLngY];
      break;
    case "CCI":
      sPath = [latLngX, pcc, pca, pcb, pclq, latLngY];
      break;
    case "CSUM":
      sPath = [latLngX, pcc, pca, pcb, pclq, pci2, latLngY];
      break;
    case "CLQIM":
      sPath = [latLngX, pcc, pca, pcb, pclq, latLngY];
      break;

    //EDIFICIO D > EDIFICIOS [D-K]
    case "DE":
      sPath = [latLngX, pcd, pcde, pce, latLngY];
      break;
    case "DF":
      sPath = [latLngX, pcd, pcde, pcf, latLngY];
      break;
    case "DG":
      sPath = [latLngX, pcd, pcde, pcg, latLngY];
      break;
    case "DH":
      sPath = [latLngX, pcd, pcde, pcg, pch, latLngY];
      break;
    case "DI":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, latLngY];
      break;
    case "DJ":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcgy, pcoo, latLngY];
      break;
    case "DK":
      sPath = [
        latLngX,
        pcd,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        pck,
        latLngY,
      ];
      break;

    //SEGUNDA PARTE
    case "DDID":
      sPath = [latLngX, pcisla, pcc, pca, latLngY];
      break;
    case "DDS":
      sPath = [latLngX, pcisla, pcc, pca, latLngY];
      break;
    case "DLEE":
      sPath = [latLngX, pcisla, pcc, pca, latLngY];
      break;
    case "DLMCA":
      sPath = [latLngX, pcisla, pcc, pca, latLngY];
      break;
    case "DEP":
      sPath = [latLngX, pcc, pca, pcep, latLngY];
      break;
    case "DSAV1":
      sPath = [latLngX, pcd, pce, pcsav1, latLngY];
      break;
    case "DDCB":
      sPath = [latLngX, pcd, pce, pcsav1, pccb, latLngY];
      break;
    case "DLMAT":
      sPath = [latLngX, pcd, pce, pcsav1, pccb, latLngY];
      break;
    case "DSAV2":
      sPath = [latLngX, pcd, pcde, pcg, pch, pcsav2, latLngY];
      break;
    case "DLIND":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcli, latLngY];
      break;
    case "DDDEPI":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "DEAU":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "DLCC":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "DLELO":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "DALB":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcgy, pcal, latLngY];
      break;
    case "DCM":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
      break;
    case "DCFUT":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "DEAT":
      sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "DSAV4":
      sPath = [latLngX, pcd, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "DAUDI":
      sPath = [latLngX, pcd, pcde, pcg, pch, pcsav4, pcaud, latLngY];
      break;
    case "DCAF":
      sPath = [latLngX, pcd, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "DSJD":
      sPath = [latLngX, pcd, pcde, pcf, pccentro, latLngY];
      break;
    case "DBSF":
      sPath = [latLngX, pcd, pcde, pcf, pccentro, latLngY];
      break;
    case "DDGV":
      sPath = [latLngX, pcd, pcde, pcf, pccentro, latLngY];
      break;
    case "DDSC":
      sPath = [latLngX, pcd, latLngY];
      break;
    case "DLRED":
      sPath = [latLngX, pcd, latLngY];
      break;
    case "DCOPI":
      sPath = [latLngX, pcd, pcisla, latLngY];
      break;
    case "DCI":
      sPath = [latLngX, pcd, pcisla, pclq, latLngY];
      break;
    case "DSUM":
      sPath = [latLngX, pcd, pcisla, pclq, pci2, latLngY];
      break;
    case "DLQIM":
      sPath = [latLngX, pcd, pcisla, pclq, latLngY];
      break;

    //EDIFICIO E > EDIFICIOS [E-K]
    case "EF":
      sPath = [latLngX, pcde, pcf, latLngY];
      break;
    case "EG":
      sPath = [latLngX, pcde, pcg, latLngY];
      break;
    case "EH":
      sPath = [latLngX, pcde, pcg, pch, latLngY];
      break;
    case "EI":
      sPath = [latLngX, pcde, pcg, pch, pci, latLngY];
      break;
    case "EJ":
      sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcoo, latLngY];
      break;
    case "EK":
      sPath = [latLngX, pcde, pcg, pch, pci, pcli, pclk1, pclk2, pck, latLngY];
      break;
    //SEGUNDA PARTE
    case "EDID":
      sPath = [latLngX, pce, pca, latLngY];
      break;
    case "EDS":
      sPath = [latLngX, pce, pca, latLngY];
      break;
    case "ELEE":
      sPath = [latLngX, pce, pca, latLngY];
      break;
    case "ELMCA":
      sPath = [latLngX, pce, pca, latLngY];
      break;
    case "EEP":
      sPath = [latLngX, pce, pca, pcep, latLngY];
      break;
    case "ESAV1":
      sPath = [latLngX, pce, pcsav1, latLngY];
      break;
    case "EDCB":
      sPath = [latLngX, pcd, pce, pcsav1, pccb, latLngY];
      break;
    case "ELMAT":
      sPath = [latLngX, pce, pcsav1, pccb, latLngY];
      break;
    case "ESAV2":
      sPath = [latLngX, pcde, pcg, pch, pcsav2, latLngY];
      break;
    case "ELIND":
      sPath = [latLngX, pcde, pcg, pch, pci, pcli, latLngY];
      break;
    case "EDDEPI":
      sPath = [latLngX, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "EEAU":
      sPath = [latLngX, pcde, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "ELCC":
      sPath = [latLngX, pcde, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "ELELO":
      sPath = [latLngX, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "EALB":
      sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcal, latLngY];
      break;
    case "ECM":
      sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
      break;
    case "ECFUT":
      sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "EEAT":
      sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "ESAV4":
      sPath = [latLngX, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "EAUDI":
      sPath = [latLngX, pcde, pcg, pch, pcsav4, pcaud, latLngY];
      break;
    case "ECAF":
      sPath = [latLngX, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "ESJD":
      sPath = [latLngX, pcde, pcf, pccentro, latLngY];
      break;
    case "EBSF":
      sPath = [latLngX, pce, pcde, pcf, pccentro, latLngY];
      break;
    case "EDGV":
      sPath = [latLngX, pcde, pcf, pccentro, latLngY];
      break;
    case "EDSC":
      sPath = [latLngX, pce, pcd, latLngY];
      break;
    case "ELRED":
      sPath = [latLngX, pce, pcd, latLngY];
      break;
    case "ECOPI":
      sPath = [latLngX, pce, pcd, pcisla, latLngY];
      break;
    case "ECI":
      sPath = [latLngX, pce, pcd, pcisla, pclq, latLngY];
      break;
    case "ESUM":
      sPath = [latLngX, pce, pcd, pcisla, pclq, pci2, latLngY];
      break;
    case "ELQIM":
      sPath = [latLngX, pce, pcd, pcisla, pclq, latLngY];
      break;

    //EDIFICIO F > EDIFICIOS [F-K]
    case "FG":
      sPath = [latLngX, pcf, pcg, latLngY];
      break;
    case "FH":
      sPath = [latLngX, pcf, pcg, pch, latLngY];
      break;
    case "FI":
      sPath = [latLngX, pcf, pcg, pch, pci, latLngY];
      break;
    case "FJ":
      sPath = [latLngX, pcf, , pcg, pch, pci, pcgy, pcoo, latLngY];
      break;
    case "FK":
      sPath = [latLngX, pcf, pcg, pch, pci, pcli, pclk1, pclk2, pck, latLngY];
      break;

    //SEGUNDA PARTE
    case "FDID":
      sPath = [latLngX, pcf, pce, pca, latLngY];
      break;
    case "FDS":
      sPath = [latLngX, pcf, pce, pca, latLngY];
      break;
    case "FLEE":
      sPath = [latLngX, pcf, pce, pca, latLngY];
      break;
    case "FLMCA":
      sPath = [latLngX, pcf, pce, pca, latLngY];
      break;
    case "FEP":
      sPath = [latLngX, pcf, pce, pca, pcep, latLngY];
      break;
    case "FSAV1":
      sPath = [latLngX, pcf, pce, pcsav1, latLngY];
      break;
    case "FDCB":
      sPath = [latLngX, pcf,  pccb, latLngY];
      break;
    case "FLMAT":
      sPath = [latLngX, pcf, pce, pcsav1, pccb, latLngY];
      break;
    case "FSAV2":
      sPath = [latLngX, pcf, pcg, pch, pcsav2, latLngY];
      break;
    case "FLIND":
      sPath = [latLngX, pcf, pcg, pch, pci, pcli, latLngY];
      break;
    case "FDDEPI":
      sPath = [latLngX, pcf, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "FEAU":
      sPath = [latLngX, pcf, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "FLCC":
      sPath = [latLngX, pcf, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "FLELO":
      sPath = [latLngX, pcf, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "FALB":
      sPath = [latLngX, pcf, pcg, pch, pci, pcgy, pcal, latLngY];
      break;
    case "FCM":
      sPath = [latLngX, pcf, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
      break;
    case "FCFUT":
      sPath = [latLngX, pcf, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "FEAT":
      sPath = [latLngX, pcf, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "FSAV4":
      sPath = [latLngX, pcf, pcg, pch, pcsav4, latLngY];
      break;
    case "FAUDI":
      sPath = [latLngX, pcf, pcg, pch, pcsav4, pcaud, latLngY];
      break;
    case "FCAF":
      sPath = [latLngX, pcf, pccentrocafe, latLngY];
      break;
    case "FSJD":
      sPath = [latLngX, pcf, pccentro, latLngY];
      break;
    case "FBSF":
      sPath = [latLngX, pcf, pccentro, latLngY];
      break;
    case "FDGV":
      sPath = [latLngX, pcf, pccentro, latLngY];
      break;
    case "FDSC":
      sPath = [latLngX, pccentrocafe, latLngY];
      break;
    case "FLRED":
      sPath = [latLngX, pccentrocafe, latLngY];
      break;
    case "FCOPI":
      sPath = [latLngX, pccentrocafe, latLngY];
      break;
    case "FCI":
      sPath = [latLngX, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;
    case "FSUM":
      sPath = [latLngX, pcf, pce, pcd, pcisla, pclq, pci2, latLngY];
      break;
    case "FLQIM":
      sPath = [latLngX, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;

    //EDIFICIO G > EDIFICIOS [G-K]
    case "GH":
      sPath = [latLngX, pcg, pch, latLngY];
      break;
    case "GI":
      sPath = [latLngX, pcg, pch, pci, latLngY];
      break;
    case "GJ":
      sPath = [latLngX, , pcg, pch, pci, pcgy, pcoo, latLngY];
      break;
    case "GK":
      sPath = [latLngX, pcg, pch, pci, pcli, pclk1, pclk2, pck, latLngY];
      break;

    //SEGUNDA PARTE
    case "GDID":
      sPath = [latLngX, pcg, pcf, pce, pca, latLngY];
      break;
    case "GDS":
      sPath = [latLngX, pcg, pcf, pce, pca, latLngY];
      break;
    case "GLEE":
      sPath = [latLngX, pcg, pcf, pce, pca, latLngY];
      break;
    case "GLMCA":
      sPath = [latLngX, pcf, pce, pca, latLngY];
      break;
    case "GEP":
      sPath = [latLngX, pcg, pcf, pce, pca, pcep, latLngY];
      break;
    case "GSAV1":
      sPath = [latLngX, pcg, pcf, pce, pcsav1, latLngY];
      break;
    case "GDCB":
      sPath = [latLngX, pccb, latLngY];
      break;
    case "GLMAT":
      sPath = [latLngX, pccb, latLngY];
      break;
    case "GSAV2":
      sPath = [latLngX, pcg, pch, pcsav2, latLngY];
      break;
    case "GLIND":
      sPath = [latLngX, pcg, pch, pci, pcli, latLngY];
      break;
    case "GDDEPI":
      sPath = [latLngX, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "GEAU":
      sPath = [latLngX, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "GLCC":
      sPath = [latLngX, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "GLELO":
      sPath = [latLngX, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "GALB":
      sPath = [latLngX, pcg, pch, pci, pcgy, pcal, latLngY];
      break;
    case "GCM":
      sPath = [latLngX, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
      break;
    case "GCFUT":
      sPath = [latLngX, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "GEAT":
      sPath = [latLngX, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "GSAV4":
      sPath = [latLngX, pcg, pch, pcsav4, latLngY];
      break;
    case "GAUDI":
      sPath = [latLngX, pcg, pch, pcsav4, pcaud, latLngY];
      break;
    case "GCAF":
      sPath = [latLngX, pcg, latLngY];
      break;
    case "GSJD":
      sPath = [latLngX, pcf, pccentro, latLngY];
      break;
    case "GBSF":
      sPath = [latLngX, pcf, pccentro, latLngY];
      break;
    case "GDGV":
      sPath = [latLngX, pcg, pcf, pccentro, latLngY];
      break;
    case "GDSC":
      sPath = [latLngX, pcg, pcf, pccentrocafe, latLngY];
      break;
    case "GLRED":
      sPath = [latLngX, pcg, pcf, pccentrocafe, latLngY];
      break;
    case "GCOPI":
      sPath = [latLngX, pcg, pcf, pccentrocafe, latLngY];
      break;
    case "GCI":
      sPath = [latLngX, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;
    case "GSUM":
      sPath = [latLngX, pcg, pcf, pce, pcd, pcisla, pclq, pci2, latLngY];
      break;
    case "GLQIM":
      sPath = [latLngX, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;

    //EDIFICIO H > EDIFICIOS [H-K]
    case "HI":
      sPath = [latLngX, pch, pci, latLngY];
      break;
    case "HJ":
      sPath = [latLngX, pch, pci, pcgy, pcoo, latLngY];
      break;
    case "HK":
      sPath = [latLngX, pch, pci, pcli, pclk1, pclk2, pck, latLngY];
      break;

    //SEGUNDA PARTE
    case "HDID":
      sPath = [latLngX, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "HDS":
      sPath = [latLngX, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "HLEE":
      sPath = [latLngX, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "HLMCA":
      sPath = [latLngX, pch, pcf, pce, pca, latLngY];
      break;
    case "HEP":
      sPath = [latLngX, pch, pcg, pcf, pce, pca, pcep, latLngY];
      break;
    case "HSAV1":
      sPath = [latLngX, pch, pcg, pcf, pce, pcsav1, latLngY];
      break;
    case "HDCB":
      sPath = [latLngX, pch, pcg, pccb, latLngY];
      break;
    case "HLMAT":
      sPath = [latLngX, pch, pcg, pccb, latLngY];
      break;
    case "HSAV2":
      sPath = [latLngX, pcsav2, latLngY];
      break;
    case "HLIND":
      sPath = [latLngX, pch, pci, pcli, latLngY];
      break;
    case "HDDEPI":
      sPath = [latLngX, pch, pci, pcli, pclk1, latLngY];
      break;
    case "HEAU":
      sPath = [latLngX, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "HLCC":
      sPath = [latLngX, pch, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "HLELO":
      sPath = [latLngX, pch, pci, pcli, pclk1, latLngY];
      break;
    case "HALB":
      sPath = [latLngX, pch, pci, pcgy, pcal, latLngY];
      break;
    case "HCM":
      sPath = [latLngX, pch, pci, pcgy, pcoo, pcj, latLngY];
      break;
    case "HCFUT":
      sPath = [latLngX, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "HEAT":
      sPath = [latLngX, pch, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "HSAV4":
      sPath = [latLngX, pch, pcsav4, latLngY];
      break;
    case "HAUDI":
      sPath = [latLngX, pch, pcsav4, pcaud, latLngY];
      break;
    case "HCAF":
      sPath = [latLngX, pch, latLngY];
      break;
    case "HSJD":
      sPath = [latLngX, pch, pcg, pcf, pccentro, latLngY];
      break;
    case "HBSF":
      sPath = [latLngX, pch, pcg, pcf, pccentro, latLngY];
      break;
    case "HDGV":
      sPath = [latLngX, pch, pcg, pcf, pccentro, latLngY];
      break;
    case "HDSC":
      sPath = [latLngX, pch, pcg, pcf, pccentrocafe, latLngY];
      break;
    case "HLRED":
      sPath = [latLngX, pchmpcg, pcf, pccentrocafe, latLngY];
      break;
    case "HCOPI":
      sPath = [latLngX, pch, pcg, pcf, pccentrocafe, latLngY];
      break;
    case "HCI":
      sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;
    case "HSUM":
      sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, pci2, latLngY];
      break;
    case "HLQIM":
      sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;

    //EDIFICIO I > EDIFICIOS [I-K]
    case "IJ":
      sPath = [latLngX, pci, pcgy, pcoo, latLngY];
      break;
    case "IK":
      sPath = [latLngX, pci, pcli, pclk1, pclk2, pck, latLngY];
      break;

    //SEGUNDA PARTE
    case "IDID":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "IDS":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "ILEE":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "ILMCA":
      sPath = [latLngX, pci, pch, pcf, pce, pca, latLngY];
      break;
    case "IEP":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, pcep, latLngY];
      break;
    case "ISAV1":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pcsav1, latLngY];
      break;
    case "IDCB":
      sPath = [latLngX, pci, pch, pcg, pccb, latLngY];
      break;
    case "ILMAT":
      sPath = [latLngX, pci, pch, pcg, pccb, latLngY];
      break;
    case "ISAV2":
      sPath = [latLngX, pch, pcsav2, latLngY];
      break;
    case "ILIND":
      sPath = [latLngX, pci, pcli, latLngY];
      break;
    case "IDDEPI":
      sPath = [latLngX, pci, pcli, pclk1, latLngY];
      break;
    case "IEAU":
      sPath = [latLngX, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "ILCC":
      sPath = [latLngX, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "ILELO":
      sPath = [latLngX, pci, pcli, pclk1, latLngY];
      break;
    case "IALB":
      sPath = [latLngX, pci, pcgy, pcal, latLngY];
      break;
    case "ICM":
      sPath = [latLngX, pci, pcgy, pcoo, pcj, latLngY];
      break;
    case "ICFUT":
      sPath = [latLngX, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "IEAT":
      sPath = [latLngX, pci, pcgy, pcoo, pccan, latLngY];
      break;
    case "ISAV4":
      sPath = [latLngX, pch, pcsav4, latLngY];
      break;
    case "IAUDI":
      sPath = [latLngX, pch, pcsav4, pcaud, latLngY];
      break;
    case "ICAF":
      sPath = [latLngX, pch, latLngY];
      break;
    case "ISJD":
      sPath = [latLngX, pci, pch, pcg, pcf, pccentro, latLngY];
      break;
    case "IBSF":
      sPath = [latLngX, pci, pch, pcg, pcf, pccentro, latLngY];
      break;
    case "IDGV":
      sPath = [latLngX, pci, pch, pcg, pcf, pccentro, latLngY];
      break;
    case "IDSC":
      sPath = [latLngX, pci, pch, pcg, pcf, pccentrocafe, latLngY];
      break;
    case "ILRED":
      sPath = [latLngX, pci, pch, pcg, pcf, pccentrocafe, latLngY];
      break;
    case "ICOPI":
      sPath = [latLngX, pch, pcg, pcf, pccentrocafe, latLngY];
      break;
    case "ICI":
      sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;
    case "ISUM":
      sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, pci2, latLngY];
      break;
    case "ILQIM":
      sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;

    //EDIFICIO J > EDIFICIOS [J-K]
    case "JK":
      sPath = [latLngX, pcoo, pcal, pcel, pclk1, pclk2, latLngY];
      break;

    //SEGUNDA PARTE
    case "JDID":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "JDS":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "JLEE":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "JLMCA":
      sPath = [latLngX, pci, pch, pcf, pce, pca, latLngY];
      break;
    case "JEP":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, pcep, latLngY];
      break;
    case "JSAV1":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pcsav1, latLngY];
      break;
    case "JDCB":
      sPath = [latLngX, pci, pch, pcg, pccb, latLngY];
      break;
    case "JLMAT":
      sPath = [latLngX, pci, pch, pcg, pccb, latLngY];
      break;
    case "JSAV2":
      sPath = [latLngX, pci, pch, pcsav2, latLngY];
      break;
    case "JLIND":
      sPath = [latLngX, pci, pcli, latLngY];
      break;
    case "JDDEPI":
      sPath = [latLngX, pci, pcli, pclk1, latLngY];
      break;
    case "JEAU":
      sPath = [latLngX, pci, pcli, pclk1, pclk2, latLngY];
      break;
    case "JLCC":
      sPath = [latLngX, pcli, pclk1, pclk2, latLngY];
      break;
    case "JLELO":
      sPath = [latLngX, pcli, pclk1, latLngY];
      break;
    case "JALB":
      sPath = [latLngX, pcgy, pcal, latLngY];
      break;
    case "JCM":
      sPath = [latLngX, pcj, latLngY];
      break;
    case "JCFUT":
      sPath = [latLngX, pcj, pccan, latLngY];
      break;
    case "JEAT":
      sPath = [latLngX, pcj, pccan, latLngY];
      break;
    case "JSAV4":
      sPath = [latLngX, pcj, pcsav4, latLngY];
      break;
    case "JAUDI":
      sPath = [latLngX, pcj, pccan, pcaud, latLngY];
      break;
    case "JCAF":
      sPath = [latLngX, pcj, pcsav4, latLngY];
      break;
    case "JSJD":
      sPath = [latLngX, pcj, pcsav4, pccentro, latLngY];
      break;
    case "JBSF":
      sPath = [latLngX, pcj, pcsav4, pccentro, latLngY];
      break;
    case "JDGV":
      sPath = [latLngX, pcj, pcsav4, pccentro, latLngY];
      break;
    case "JDSC":
      sPath = [latLngX, pcj, pcsav4, pccentrocafe, latLngY];
      break;
    case "JLRED":
      sPath = [latLngX, pcj, pcsav4, pccentrocafe, latLngY];
      break;
    case "JCOPI":
      sPath = [latLngX, pcj, pcsav4, pccentrocafe, latLngY];
      break;
    case "JCI":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;
    case "JSUM":
      sPath = [
        latLngX,
        pci,
        pch,
        pcg,
        pcf,
        pce,
        pcd,
        pcisla,
        pclq,
        pci2,
        latLngY,
      ];
      break;
    case "JLQIM":
      sPath = [latLngX, pci, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;

    //K

    //SEGUNDA PARTE
    case "KDID":
      sPath = [latLngX, pclk2, pclk1, pci, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "KDS":
      sPath = [latLngX, pclk2, pclk1, pci, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "KLEE":
      sPath = [latLngX, pclk2, pclk1, pci, pch, pcg, pcf, pce, pca, latLngY];
      break;
    case "KLMCA":
      sPath = [latLngX, pclk2, pclk1, pci, pch, pcf, pce, pca, latLngY];
      break;
    case "KEP":
      sPath = [
        latLngX,
        pclk2,
        pclk1,
        pci,
        pch,
        pcg,
        pcf,
        pce,
        pca,
        pcep,
        latLngY,
      ];
      break;
    case "KSAV1":
      sPath = [latLngX, pclk2, pclk1, pci, pch, pcg, pcf, pce, pcsav1, latLngY];
      break;
    case "KDCB":
      sPath = [latLngX, ppclk2, pclk1, ci, pch, pcg, pccb, latLngY];
      break;
    case "KLMAT":
      sPath = [latLngX, pclk2, pclk1, pci, pch, pcg, pccb, latLngY];
      break;
    case "KSAV2":
      sPath = [latLngX, pclk2, pclk1, pch, pcsav2, latLngY];
      break;
    case "KLIND":
      sPath = [latLngX, pclk2, pclk1, pcli, latLngY];
      break;
    case "KDDEPI":
      sPath = [latLngX, pclk2, pclk1, latLngY];
      break;
    case "KEAU":
      sPath = [latLngX, pclk2, latLngY];
      break;
    case "KLCC":
      sPath = [latLngX, pclk2, latLngY];
      break;
    case "KLELO":
      sPath = [latLngX, pclk2, pclk1, latLngY];
      break;
    case "KALB":
      sPath = [latLngX, pclk2, pclk1, pcgy, pcal, latLngY];
      break;
    case "KCM":
      sPath = [latLngX, pclk2, pclk1, pcgy, pcoo, pcj, latLngY];
      break;
    case "KCFUT":
      sPath = [latLngX, pclk2, pclk1, pcal, pcoo, pccan, latLngY];
      break;
    case "KEAT":
      sPath = [latLngX, pclk2, pclk1, pcal, pcoo, pccan, latLngY];
      break;
    case "KSAV4":
      sPath = [latLngX, pclk2, pclk1, pcal, pccampana, pcsav4, latLngY];
      break;
    case "KAUDI":
      sPath = [latLngX, pclk2, pclk1, pcal, pccampana, pcaud, latLngY];
      break;
    case "KCAF":
      sPath = [latLngX, pclk2, pclk1, pcal, pccampana, pcsav4, latLngY];
      break;
    case "KSJD":
      sPath = [
        latLngX,
        pclk2,
        pclk1,
        pcal,
        pcgy,
        pci,
        pch,
        pcg,
        pcf,
        pccentro,
        latLngY,
      ];
      break;
    case "KBSF":
      sPath = [
        latLngX,
        pclk2,
        pclk1,
        pcal,
        pcgy,
        pcipch,
        pcg,
        pcf,
        pccentro,
        latLngY,
      ];
      break;
    case "KDGV":
      sPath = [
        latLngX,
        pclk2,
        pclk1,
        pcal,
        pcgy,
        pci,
        pch,
        pcg,
        pcf,
        pccentro,
        latLngY,
      ];
      break;
    case "KDSC":
      sPath = [
        latLngX,
        pclk2,
        pclk1,
        pcal,
        pcgy,
        pci,
        pch,
        pcg,
        pcf,
        pccentrocafe,
        latLngY,
      ];
      break;
    case "KLRED":
      sPath = [
        latLngX,
        pclk2,
        pclk1,
        pcal,
        pcgy,
        pci,
        pch,
        pcg,
        pcf,
        pccentrocafe,
        latLngY,
      ];
      break;
    case "KCOPI":
      sPath = [
        latLngX,
        pclk2,
        pclk1,
        pcal,
        pcgy,
        pci,
        pcg,
        pcf,
        pccentrocafe,
        latLngY,
      ];
      break;
    case "KCI":
      sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
      break;
    case "KSUM":
      sPath = [
        latLngX,
        pclk2,
        pclk1,
        pcal,
        pcgy,
        pci,
        pcg,
        pcf,
        pce,
        pcd,
        pcisla,
        pclq,
        pci2,
        latLngY,
      ];
      break;
    case "KLQIM":
      sPath = [
        latLngX,
        pclk2,
        pclk1,
        pcal,
        pcgy,
        pci,
        pcg,
        pcf,
        pce,
        pcd,
        pcisla,
        pclq,
        latLngY,
      ];
      break;
    //departamentos y faltantes

    //SUM
    case "SUMCI":
      sPath = [latLngX, latLngY];
      break;
    case "SUMLQIM":
      sPath = [latLngX, pci2, pclq, latLngY];
      break;
    case "SUMDID":
      sPath = [latLngX, pci2, pclq, latLngY];
      break;
    case "SUMDS":
      sPath = [latLngX, pci2, pclq, pca, latLngY];
      break;
    case "SUMEP":
      sPath = [latLngX, pci2, pclq, pca, pcep, latLngY];
      break;
    case "SUMLEE":
      sPath = [latLngX, pci2, pclq, pca, latLngY];
      break;
    case "SUMLMCA":
      sPath = [latLngX, pci2, pclq, pca, latLngY];
      break;
    case "SUMSAV1":
      sPath = [latLngX, pca, pcsav1, latLngY];
      break;
    case "SUMDCB":
      sPath = [latLngX, pca, pcsav1, pccb, latLngY];
      break;
    case "SUMLMAT":
      sPath = [latLngX, pca, pcsav1, pccb, latLngY];
      break;
    case "SUMSAV2":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav2, latLngY];
      break;
    case "SUMLIND":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, latLngY];
      break;
    case "SUMDDEPI":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "SUMEAU":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pccentrocasileros,
        pcentppal,
        pcaud,
        pcgy,
        pcal,
        pclk1,
        pclk2,
        latLngY,
      ];
      break;
    case "SUMLCC":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pccentrocasileros,
        pcentppal,
        pcaud,
        pcgy,
        pcal,
        latLngY,
      ];
      break;
    case "SUMLELO":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pccentrocasileros,
        pcentppal,
        pcaud,
        latLngY,
      ];
      break;
    case "SUMALB":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pccentrocasileros,
        pcentppal,
        pcaud,
        pcgy,
        pcal,
        latLngY,
      ];
      break;
    case "SUMCM":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pccentrocasileros,
        pcentppal,
        pcaud,

        latLngY,
      ];
      break;
    case "SUMCFUT":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pccentrocasileros,
        pcentppal,
        pcaud,
        pccan,
        latLngY,
      ];
      break;
    case "SUMEAT":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pccentrocasileros,
        pcentppal,
        pcaud,
        pccan,
        latLngY,
      ];
      break;
    case "SUMSAV4":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pccentrocasileros,
        pccentrocafe,
        pcsav4,
        latLngY,
      ];
      break;
    case "SUMAUDI":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pccentrocasileros,
        pcentppal,
        pcaud,
        latLngY,
      ];
      break;
    case "SUMCAF":
      sPath = [
        latLngX,
        pci2,
        pclq,
        pcisla,
        pcc,
        pcde,
        pcg,
        pch,
        pcsav4,
        latLngY,
      ];
      break;
    case "SUMSJD":
      sPath = [latLngX, pci2, pclq, pcisla, latLngY];
      break;
    case "SUMBSF":
      sPath = [latLngX, pci2, pclq, pcisla, latLngY];
      break;
    case "SUMDGV":
      sPath = [latLngX, pci2, pclq, pcisla, latLngY];
      break;
    case "SUMDSC":
      sPath = [latLngX, pci2, pclq, pcisla, latLngY];
      break;
    case "SUMLRED":
      sPath = [latLngX, pci2, pclq, pcisla, latLngY];
      break;
    case "SUMCOPI":
      sPath = [latLngX, pci2, pclq, pcisla, latLngY];
      break;

    /////////////CI
    case "CIDID":
      sPath = [latLngX, pca, latLngY];
      break;
    case "CIDS":
      sPath = [latLngX, pca, latLngY];
      break;
    case "CILEE":
      sPath = [latLngX, pca, latLngY];
      break;
    case "CILMCA":
      sPath = [latLngX, pca, latLngY];
      break;
    case "CIEP":
      sPath = [latLngX, pca, pcep, latLngY];
      break;
    case "CISAV1":
      sPath = [latLngX, pca, pcsav1, latLngY];
      break;
    case "CIDCB":
      sPath = [latLngX, pca, pcsav1, pccb, latLngY];
      break;
    case "CILMAT":
      sPath = [latLngX, pca, pcsav1, pccb, latLngY];
      break;
    case "CISAV2":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav2, latLngY];
      break;
    case "CILIND":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, latLngY];
      break;
    case "CIDDEPI":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "CIEAU":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        latLngY,
      ];
      break;
    case "CILCC":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pclk2,
        latLngY,
      ];
      break;
    case "CILELO":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
      break;
    case "CIALB":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcli,
        pclk1,
        pcal,
        latLngY,
      ];
      break;
    case "CICM":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        pcj,
        latLngY,
      ];
      break;
    case "CICFUT":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        pccan,
        latLngY,
      ];
      break;
    case "CIEAT":
      sPath = [
        latLngX,
        pca,
        pcc,
        pcde,
        pcg,
        pch,
        pci,
        pcgy,
        pcoo,
        pccan,
        latLngY,
      ];
      break;
    case "CISAV4":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
      break;
    case "CIAUDI":
      sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, pcaud, latLngY];
      break;
    case "CICAF":
      sPath = [latLngX, pclq, pcisla, pccentrocasileros, latLngY];
      break;
    case "CISJD":
      sPath = [latLngX, pclq, pcisla, pccentro, latLngY];
      break;
    case "CIBSF":
      sPath = [latLngX, pclq, pcisla, pccentro, latLngY];
      break;
    case "CIDGV":
      sPath = [latLngX, pclq, pcisla, pccentro, latLngY];
      break;
    case "CIDSC":
      sPath = [latLngX, pclq, pcisla, latLngY];
      break;
    case "CILRED":
      sPath = [latLngX, pclq, pcisla, latLngY];
      break;
    case "CICOPI":
      sPath = [latLngX, pclq, pcisla, latLngY];
      break;
    case "CILQIM":
      sPath = [latLngX, pclq, latLngY];
      break;

    default:
      let aux = latLngX;
      latLngX = latLngY;
      latLngY = aux;

      switch (destino2) {
        case "AB":
          sPath = [latLngX, pca, pcb, latLngY];
          break;
        case "AC":
          sPath = [latLngX, pca, pcc, latLngY];
          break;
        case "AD":
          sPath = [latLngX, pca, pcc, pcde, pcd, latLngY];
          break;
        case "AE":
          sPath = [latLngX, pca, pcc, pcde, pce, latLngY];
          break;
        case "AF":
          sPath = [latLngX, pca, pcc, pcde, pcf, latLngY];
          break;
        case "AG":
          sPath = [latLngX, pca, pcc, pcde, pcg, latLngY];
          break;
        case "AH":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, latLngY];
          break;
        case "AI":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, latLngY];
          break;
        case "AJ":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcgy, pcoo, latLngY];
          break;
        case "AK":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            pck,
            latLngY,
          ];
          break;

        case "ADID":
          sPath = [latLngX, pca, latLngY];
          break;
        case "ADS":
          sPath = [latLngX, pca, latLngY];
          break;
        case "ALEE":
          sPath = [latLngX, pca, latLngY];
          break;
        case "ALMCA":
          sPath = [latLngX, pca, latLngY];
          break;
        case "AEP":
          sPath = [latLngX, pca, pcep, latLngY];
          break;
        case "ASAV1":
          sPath = [latLngX, pca, pcsav1, latLngY];
          break;
        case "ADCB":
          sPath = [latLngX, pca, pcsav1, pccb, latLngY];
          break;
        case "ALMAT":
          sPath = [latLngX, pca, pcsav1, pccb, latLngY];
          break;
        case "ASAV2":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav2, latLngY];
          break;
        case "ALIND":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, latLngY];
          break;
        case "ADDEPI":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            latLngY,
          ];
          break;
        case "AEAU":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "ALCC":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "ALELO":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            latLngY,
          ];
          break;
        case "AALB":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pcal,
            latLngY,
          ];
          break;
        case "ACM":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pcj,
            latLngY,
          ];
          break;
        case "ACFUT":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "AEAT":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "ASAV4":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "AAUDI":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, pcaud, latLngY];
          break;
        case "ACAF":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "ASJD":
          sPath = [latLngX, pca, pcc, pcde, pcf, pccentro, latLngY];
          break;
        case "ABSF":
          sPath = [latLngX, pca, pcc, pcde, pcf, pccentro, latLngY];
          break;
        case "ADGV":
          sPath = [latLngX, pca, pcc, pcde, pcf, pccentro, latLngY];
          break;
        case "ADSC":
          sPath = [latLngX, pca, pcc, pcde, pcd, latLngY];
          break;
        case "ALRED":
          sPath = [latLngX, pca, pcc, pcde, pcd, latLngY];
          break;
        case "ACOPI":
          sPath = [latLngX, pca, pcc, pcde, pcd, latLngY];
          break;
        case "ACI":
          sPath = [latLngX, pca, pcb, pclq, latLngY];
          break;
        case "ASUM":
          sPath = [latLngX, pca, pcb, pclq, pci2, latLngY];
          break;
        case "ALQIM":
          sPath = [latLngX, pca, pcb, pclq, latLngY];
          break;

        //EDIFICIO B > EDIFICIOS [B-K]
        case "BC":
          sPath = [latLngX, pcb, pca, pcc, latLngY];
          break;
        case "BD":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcd, latLngY];
          break;
        case "BE":
          sPath = [latLngX, pcb, pca, pcc, pcde, pce, latLngY];
          break;
        case "BF":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcf, latLngY];
          break;
        case "BG":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcg, latLngY];
          break;
        case "BH":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, latLngY];
          break;
        case "BI":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pci, latLngY];
          break;
        case "BJ":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            latLngY,
          ];
          break;
        case "BK":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            pck,
            latLngY,
          ];
          break;

        //SEGUNDA PARTE
        case "BDID":
          sPath = [latLngX, pcb, pca, latLngY];
          break;
        case "BDS":
          sPath = [latLngX, pcb, pca, latLngY];
          break;
        case "BLEE":
          sPath = [latLngX, pcb, pca, latLngY];
          break;
        case "BLMCA":
          sPath = [latLngX, pcb, pca, latLngY];
          break;
        case "BEP":
          sPath = [latLngX, pcb, pca, pcep, latLngY];
          break;
        case "BSAV1":
          sPath = [latLngX, pcb, pca, pcsav1, latLngY];
          break;
        case "BDCB":
          sPath = [latLngX, pca, pcsav1, pccb, latLngY];
          break;
        case "BLMAT":
          sPath = [latLngX, pcb, pca, pcsav1, pccb, latLngY];
          break;
        case "BSAV2":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pcsav2, latLngY];
          break;
        case "BLIND":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pci, pcli, latLngY];
          break;
        case "BDDEPI":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            latLngY,
          ];
          break;
        case "BEAU":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "BLCC":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "BLELO":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            latLngY,
          ];
          break;
        case "BALB":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcal,
            latLngY,
          ];
          break;
        case "BCM":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pcj,
            latLngY,
          ];
          break;
        case "BCFUT":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "BEAT":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "BSAV4":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "BAUDI":
          sPath = [
            latLngX,
            pcb,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pcsav4,
            pcaud,
            latLngY,
          ];
          break;
        case "BCAF":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "BSJD":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcf, pccentro, latLngY];
          break;
        case "BBSF":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcf, pccentro, latLngY];
          break;
        case "BDGV":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcf, pccentro, latLngY];
          break;
        case "BDSC":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcd, latLngY];
          break;
        case "BLRED":
          sPath = [latLngX, pcb, pca, pcc, pcde, pcd, latLngY];
          break;
        case "BCOPI":
          sPath = [latLngX, pcb, pcc, pcde, pcd, latLngY];
          break;
        case "BCI":
          sPath = [latLngX, pcb, pcb, pclq, latLngY];
          break;
        case "BSUM":
          sPath = [latLngX, pcb, pclq, pci2, latLngY];
          break;
        case "BLQIM":
          sPath = [latLngX, pcb, pcb, pclq, latLngY];
          break;

        //EDIFICIO C > EDIFICIOS [C-K]
        case "CD":
          sPath = [latLngX, pcc, pcisla, latLngY];
          break;
        case "CE":
          sPath = [latLngX, pcc, pcde, pce, latLngY];
          break;
        case "CF":
          sPath = [latLngX, pcc, pcde, pcf, latLngY];
          break;
        case "CG":
          sPath = [latLngX, pcc, pcde, pcg, latLngY];
          break;
        case "CH":
          sPath = [latLngX, pcc, pcde, pcg, pch, latLngY];
          break;
        case "CI":
          sPath = [latLngX, pcc, pcde, pcg, pch, pci, latLngY];
          break;
        case "CJ":
          sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcgy, pcoo, latLngY];
          break;
        case "CK":
          sPath = [
            latLngX,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            pck,
            latLngY,
          ];
          break;
        //SEGUNDA PARTE
        case "CDID":
          sPath = [latLngX, pcc, pca, latLngY];
          break;
        case "CDS":
          sPath = [latLngX, pcc, pca, latLngY];
          break;
        case "CLEE":
          sPath = [latLngX, pcc, pca, latLngY];
          break;
        case "CLMCA":
          sPath = [latLngX, pcc, pca, latLngY];
          break;
        case "CEP":
          sPath = [latLngX, pcc, pca, pcep, latLngY];
          break;
        case "CSAV1":
          sPath = [latLngX, pcc, pce, pcsav1, latLngY];
          break;
        case "CDCB":
          sPath = [latLngX, pcc, pce, pcsav1, pccb, latLngY];
          break;
        case "CLMAT":
          sPath = [latLngX, pcc, pce, pcsav1, pccb, latLngY];
          break;
        case "CSAV2":
          sPath = [latLngX, pcc, pcde, pcg, pch, pcsav2, latLngY];
          break;
        case "CLIND":
          sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcli, latLngY];
          break;
        case "CDDEPI":
          sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "CEAU":
          sPath = [
            latLngX,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "CLCC":
          sPath = [
            latLngX,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "CLELO":
          sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "CALB":
          sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcgy, pcal, latLngY];
          break;
        case "CCM":
          sPath = [latLngX, pcc, pcde, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
          break;
        case "CCFUT":
          sPath = [
            latLngX,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "CEAT":
          sPath = [
            latLngX,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "CSAV4":
          sPath = [latLngX, pcc, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "CAUDI":
          sPath = [latLngX, pcc, pcde, pcg, pch, pcsav4, pcaud, latLngY];
          break;
        case "CCAF":
          sPath = [latLngX, pcc, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "CSJD":
          sPath = [latLngX, pcc, pcde, pcf, pccentro, latLngY];
          break;
        case "CBSF":
          sPath = [latLngX, pcc, pcde, pcf, pccentro, latLngY];
          break;
        case "CDGV":
          sPath = [latLngX, pcc, pcde, pcf, pccentro, latLngY];
          break;
        case "CDSC":
          sPath = [latLngX, pcc, pcisla, latLngY];
          break;
        case "CLRED":
          sPath = [latLngX, pcc, pcisla, latLngY];
          break;
        case "CCOPI":
          sPath = [latLngX, pcc, pcisla, latLngY];
          break;
        case "CCI":
          sPath = [latLngX, pcc, pca, pcb, pclq, latLngY];
          break;
        case "CSUM":
          sPath = [latLngX, pcc, pca, pcb, pclq, pci2, latLngY];
          break;
        case "CLQIM":
          sPath = [latLngX, pcc, pca, pcb, pclq, latLngY];
          break;

        //EDIFICIO D > EDIFICIOS [D-K]
        case "DE":
          sPath = [latLngX, pcd, pcde, pce, latLngY];
          break;
        case "DF":
          sPath = [latLngX, pcd, pcde, pcf, latLngY];
          break;
        case "DG":
          sPath = [latLngX, pcd, pcde, pcg, latLngY];
          break;
        case "DH":
          sPath = [latLngX, pcd, pcde, pcg, pch, latLngY];
          break;
        case "DI":
          sPath = [latLngX, pcd, pcde, pcg, pch, pci, latLngY];
          break;
        case "DJ":
          sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcgy, pcoo, latLngY];
          break;
        case "DK":
          sPath = [
            latLngX,
            pcd,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            pck,
            latLngY,
          ];
          break;

        //SEGUNDA PARTE
        case "DDID":
          sPath = [latLngX, pcisla, pcc, pca, latLngY];
          break;
        case "DDS":
          sPath = [latLngX, pcisla, pcc, pca, latLngY];
          break;
        case "DLEE":
          sPath = [latLngX, pcisla, pcc, pca, latLngY];
          break;
        case "DLMCA":
          sPath = [latLngX, pcisla, pcc, pca, latLngY];
          break;
        case "DEP":
          sPath = [latLngX, pcc, pca, pcep, latLngY];
          break;
        case "DSAV1":
          sPath = [latLngX, pcd, pce, pcsav1, latLngY];
          break;
        case "DDCB":
          sPath = [latLngX, pcd, pce, pcsav1, pccb, latLngY];
          break;
        case "DLMAT":
          sPath = [latLngX, pcd, pce, pcsav1, pccb, latLngY];
          break;
        case "DSAV2":
          sPath = [latLngX, pcd, pcde, pcg, pch, pcsav2, latLngY];
          break;
        case "DLIND":
          sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcli, latLngY];
          break;
        case "DDDEPI":
          sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "DEAU":
          sPath = [
            latLngX,
            pcd,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "DLCC":
          sPath = [
            latLngX,
            pcd,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "DLELO":
          sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "DALB":
          sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcgy, pcal, latLngY];
          break;
        case "DCM":
          sPath = [latLngX, pcd, pcde, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
          break;
        case "DCFUT":
          sPath = [
            latLngX,
            pcd,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "DEAT":
          sPath = [
            latLngX,
            pcd,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "DSAV4":
          sPath = [latLngX, pcd, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "DAUDI":
          sPath = [latLngX, pcd, pcde, pcg, pch, pcsav4, pcaud, latLngY];
          break;
        case "DCAF":
          sPath = [latLngX, pcd, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "DSJD":
          sPath = [latLngX, pcd, pcde, pcf, pccentro, latLngY];
          break;
        case "DBSF":
          sPath = [latLngX, pcd, pcde, pcf, pccentro, latLngY];
          break;
        case "DDGV":
          sPath = [latLngX, pcd, pcde, pcf, pccentro, latLngY];
          break;
        case "DDSC":
          sPath = [latLngX, pcd, latLngY];
          break;
        case "DLRED":
          sPath = [latLngX, pcd, latLngY];
          break;
        case "DCOPI":
          sPath = [latLngX, pcd, pcisla, latLngY];
          break;
        case "DCI":
          sPath = [latLngX, pcd, pcisla, pclq, latLngY];
          break;
        case "DSUM":
          sPath = [latLngX, pcd, pcisla, pclq, pci2, latLngY];
          break;
        case "DLQIM":
          sPath = [latLngX, pcd, pcisla, pclq, latLngY];
          break;

        //EDIFICIO E > EDIFICIOS [E-K]
        case "EF":
          sPath = [latLngX, pcde, pcf, latLngY];
          break;
        case "EG":
          sPath = [latLngX, pcde, pcg, latLngY];
          break;
        case "EH":
          sPath = [latLngX, pcde, pcg, pch, latLngY];
          break;
        case "EI":
          sPath = [latLngX, pcde, pcg, pch, pci, latLngY];
          break;
        case "EJ":
          sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcoo, latLngY];
          break;
        case "EK":
          sPath = [
            latLngX,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            pck,
            latLngY,
          ];
          break;
        //SEGUNDA PARTE
        case "EDID":
          sPath = [latLngX, pce, pca, latLngY];
          break;
        case "EDS":
          sPath = [latLngX, pce, pca, latLngY];
          break;
        case "ELEE":
          sPath = [latLngX, pce, pca, latLngY];
          break;
        case "ELMCA":
          sPath = [latLngX, pce, pca, latLngY];
          break;
        case "EEP":
          sPath = [latLngX, pce, pca, pcep, latLngY];
          break;
        case "ESAV1":
          sPath = [latLngX, pce, pcsav1, latLngY];
          break;
        case "EDCB":
          sPath = [latLngX, pcd, pce, pcsav1, pccb, latLngY];
          break;
        case "ELMAT":
          sPath = [latLngX, pce, pcsav1, pccb, latLngY];
          break;
        case "ESAV2":
          sPath = [latLngX, pcde, pcg, pch, pcsav2, latLngY];
          break;
        case "ELIND":
          sPath = [latLngX, pcde, pcg, pch, pci, pcli, latLngY];
          break;
        case "EDDEPI":
          sPath = [latLngX, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "EEAU":
          sPath = [latLngX, pcde, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "ELCC":
          sPath = [latLngX, pcde, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "ELELO":
          sPath = [latLngX, pcde, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "EALB":
          sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcal, latLngY];
          break;
        case "ECM":
          sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
          break;
        case "ECFUT":
          sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "EEAT":
          sPath = [latLngX, pcde, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "ESAV4":
          sPath = [latLngX, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "EAUDI":
          sPath = [latLngX, pcde, pcg, pch, pcsav4, pcaud, latLngY];
          break;
        case "ECAF":
          sPath = [latLngX, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "ESJD":
          sPath = [latLngX, pcde, pcf, pccentro, latLngY];
          break;
        case "EBSF":
          sPath = [latLngX, pce, pcde, pcf, pccentro, latLngY];
          break;
        case "EDGV":
          sPath = [latLngX, pcde, pcf, pccentro, latLngY];
          break;
        case "EDSC":
          sPath = [latLngX, pce, pcd, latLngY];
          break;
        case "ELRED":
          sPath = [latLngX, pce, pcd, latLngY];
          break;
        case "ECOPI":
          sPath = [latLngX, pce, pcd, pcisla, latLngY];
          break;
        case "ECI":
          sPath = [latLngX, pce, pcd, pcisla, pclq, latLngY];
          break;
        case "ESUM":
          sPath = [latLngX, pce, pcd, pcisla, pclq, pci2, latLngY];
          break;
        case "ELQIM":
          sPath = [latLngX, pce, pcd, pcisla, pclq, latLngY];
          break;

        //EDIFICIO F > EDIFICIOS [F-K]
        case "FG":
          sPath = [latLngX, pcf, pcg, latLngY];
          break;
        case "FH":
          sPath = [latLngX, pcf, pcg, pch, latLngY];
          break;
        case "FI":
          sPath = [latLngX, pcf, pcg, pch, pci, latLngY];
          break;
        case "FJ":
          sPath = [latLngX, pcf, , pcg, pch, pci, pcgy, pcoo, latLngY];
          break;
        case "FK":
          sPath = [
            latLngX,
            pcf,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            pck,
            latLngY,
          ];
          break;

        //SEGUNDA PARTE
        case "FDID":
          sPath = [latLngX, pcf, pce, pca, latLngY];
          break;
        case "FDS":
          sPath = [latLngX, pcf, pce, pca, latLngY];
          break;
        case "FLEE":
          sPath = [latLngX, pcf, pce, pca, latLngY];
          break;
        case "FLMCA":
          sPath = [latLngX, pcf, pce, pca, latLngY];
          break;
        case "FEP":
          sPath = [latLngX, pcf, pce, pca, pcep, latLngY];
          break;
        case "FSAV1":
          sPath = [latLngX, pcf, pce, pcsav1, latLngY];
          break;
        case "FDCB":
          sPath = [latLngX, pcf, pcd, pce, pcsav1, pccb, latLngY];
          break;
        case "FLMAT":
          sPath = [latLngX, pcf, pce, pcsav1, pccb, latLngY];
          break;
        case "FSAV2":
          sPath = [latLngX, pcf, pcg, pch, pcsav2, latLngY];
          break;
        case "FLIND":
          sPath = [latLngX, pcf, pcg, pch, pci, pcli, latLngY];
          break;
        case "FDDEPI":
          sPath = [latLngX, pcf, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "FEAU":
          sPath = [latLngX, pcf, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "FLCC":
          sPath = [latLngX, pcf, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "FLELO":
          sPath = [latLngX, pcf, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "FALB":
          sPath = [latLngX, pcf, pcg, pch, pci, pcgy, pcal, latLngY];
          break;
        case "FCM":
          sPath = [latLngX, pcf, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
          break;
        case "FCFUT":
          sPath = [latLngX, pcf, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "FEAT":
          sPath = [latLngX, pcf, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "FSAV4":
          sPath = [latLngX, pcf, pcg, pch, pcsav4, latLngY];
          break;
        case "FAUDI":
          sPath = [latLngX, pcf, pcg, pch, pcsav4, pcaud, latLngY];
          break;
        case "FCAF":
          sPath = [latLngX, pcf, pccentrocafe, latLngY];
          break;
        case "FSJD":
          sPath = [latLngX, pcf, pccentro, latLngY];
          break;
        case "FBSF":
          sPath = [latLngX, pcf, pccentro, latLngY];
          break;
        case "FDGV":
          sPath = [latLngX, pcf, pccentro, latLngY];
          break;
        case "FDSC":
          sPath = [latLngX, pccentrocafe, latLngY];
          break;
        case "FLRED":
          sPath = [latLngX, pccentrocafe, latLngY];
          break;
        case "FCOPI":
          sPath = [latLngX, pccentrocafe, latLngY];
          break;
        case "FCI":
          sPath = [latLngX, pcf, pce, pcd, pcisla, pclq, latLngY];
          break;
        case "FSUM":
          sPath = [latLngX, pcf, pce, pcd, pcisla, pclq, pci2, latLngY];
          break;
        case "FLQIM":
          sPath = [latLngX, pcf, pce, pcd, pcisla, pclq, latLngY];
          break;

        //EDIFICIO G > EDIFICIOS [G-K]
        case "GH":
          sPath = [latLngX, pcg, pch, latLngY];
          break;
        case "GI":
          sPath = [latLngX, pcg, pch, pci, latLngY];
          break;
        case "GJ":
          sPath = [latLngX, , pcg, pch, pci, pcgy, pcoo, latLngY];
          break;
        case "GK":
          sPath = [latLngX, pcg, pch, pci, pcli, pclk1, pclk2, pck, latLngY];
          break;

        //SEGUNDA PARTE
        case "GDID":
          sPath = [latLngX, pcg, pcf, pce, pca, latLngY];
          break;
        case "GDS":
          sPath = [latLngX, pcg, pcf, pce, pca, latLngY];
          break;
        case "GLEE":
          sPath = [latLngX, pcg, pcf, pce, pca, latLngY];
          break;
        case "GLMCA":
          sPath = [latLngX, pcf, pce, pca, latLngY];
          break;
        case "GEP":
          sPath = [latLngX, pcg, pcf, pce, pca, pcep, latLngY];
          break;
        case "GSAV1":
          sPath = [latLngX, pcg, pcf, pce, pcsav1, latLngY];
          break;
        case "GDCB":
          sPath = [latLngX, pccb, latLngY];
          break;
        case "GLMAT":
          sPath = [latLngX, pccb, latLngY];
          break;
        case "GSAV2":
          sPath = [latLngX, pcg, pch, pcsav2, latLngY];
          break;
        case "GLIND":
          sPath = [latLngX, pcg, pch, pci, pcli, latLngY];
          break;
        case "GDDEPI":
          sPath = [latLngX, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "GEAU":
          sPath = [latLngX, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "GLCC":
          sPath = [latLngX, pcg, pch, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "GLELO":
          sPath = [latLngX, pcg, pch, pci, pcli, pclk1, latLngY];
          break;
        case "GALB":
          sPath = [latLngX, pcg, pch, pci, pcgy, pcal, latLngY];
          break;
        case "GCM":
          sPath = [latLngX, pcg, pch, pci, pcgy, pcoo, pcj, latLngY];
          break;
        case "GCFUT":
          sPath = [latLngX, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "GEAT":
          sPath = [latLngX, pcg, pch, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "GSAV4":
          sPath = [latLngX, pcg, pch, pcsav4, latLngY];
          break;
        case "GAUDI":
          sPath = [latLngX, pcg, pch, pcsav4, pcaud, latLngY];
          break;
        case "GCAF":
          sPath = [latLngX, pcg, latLngY];
          break;
        case "GSJD":
          sPath = [latLngX, pcf, pccentro, latLngY];
          break;
        case "GBSF":
          sPath = [latLngX, pcf, pccentro, latLngY];
          break;
        case "GDGV":
          sPath = [latLngX, pcg, pcf, pccentro, latLngY];
          break;
        case "GDSC":
          sPath = [latLngX, pcg, pcf, pccentrocafe, latLngY];
          break;
        case "GLRED":
          sPath = [latLngX, pcg, pcf, pccentrocafe, latLngY];
          break;
        case "GCOPI":
          sPath = [latLngX, pcg, pcf, pccentrocafe, latLngY];
          break;
        case "GCI":
          sPath = [latLngX, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
          break;
        case "GSUM":
          sPath = [latLngX, pcg, pcf, pce, pcd, pcisla, pclq, pci2, latLngY];
          break;
        case "GLQIM":
          sPath = [latLngX, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
          break;

        //EDIFICIO H > EDIFICIOS [H-K]
        case "HI":
          sPath = [latLngX, pch, pci, latLngY];
          break;
        case "HJ":
          sPath = [latLngX, pch, pci, pcgy, pcoo, latLngY];
          break;
        case "HK":
          sPath = [latLngX, pch, pci, pcli, pclk1, pclk2, pck, latLngY];
          break;

        //SEGUNDA PARTE
        case "HDID":
          sPath = [latLngX, pch, pcg, pcf, pce, pca, latLngY];
          break;
        case "HDS":
          sPath = [latLngX, pch, pcg, pcf, pce, pca, latLngY];
          break;
        case "HLEE":
          sPath = [latLngX, pch, pcg, pcf, pce, pca, latLngY];
          break;
        case "HLMCA":
          sPath = [latLngX, pch, pcf, pce, pca, latLngY];
          break;
        case "HEP":
          sPath = [latLngX, pch, pcg, pcf, pce, pca, pcep, latLngY];
          break;
        case "HSAV1":
          sPath = [latLngX, pch, pcg, pcf, pce, pcsav1, latLngY];
          break;
        case "HDCB":
          sPath = [latLngX, pch, pcg, pccb, latLngY];
          break;
        case "HLMAT":
          sPath = [latLngX, pch, pcg, pccb, latLngY];
          break;
        case "HSAV2":
          sPath = [latLngX, pcsav2, latLngY];
          break;
        case "HLIND":
          sPath = [latLngX, pch, pci, pcli, latLngY];
          break;
        case "HDDEPI":
          sPath = [latLngX, pch, pci, pcli, pclk1, latLngY];
          break;
        case "HEAU":
          sPath = [latLngX, pch, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "HLCC":
          sPath = [latLngX, pch, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "HLELO":
          sPath = [latLngX, pch, pci, pcli, pclk1, latLngY];
          break;
        case "HALB":
          sPath = [latLngX, pch, pci, pcgy, pcal, latLngY];
          break;
        case "HCM":
          sPath = [latLngX, pch, pci, pcgy, pcoo, pcj, latLngY];
          break;
        case "HCFUT":
          sPath = [latLngX, pch, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "HEAT":
          sPath = [latLngX, pch, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "HSAV4":
          sPath = [latLngX, pch, pcsav4, latLngY];
          break;
        case "HAUDI":
          sPath = [latLngX, pch, pcsav4, pcaud, latLngY];
          break;
        case "HCAF":
          sPath = [latLngX, pch, latLngY];
          break;
        case "HSJD":
          sPath = [latLngX, pch, pcg, pcf, pccentro, latLngY];
          break;
        case "HBSF":
          sPath = [latLngX, pch, pcg, pcf, pccentro, latLngY];
          break;
        case "HDGV":
          sPath = [latLngX, pch, pcg, pcf, pccentro, latLngY];
          break;
        case "HDSC":
          sPath = [latLngX, pch, pcg, pcf, pccentrocafe, latLngY];
          break;
        case "HLRED":
          sPath = [latLngX, pchmpcg, pcf, pccentrocafe, latLngY];
          break;
        case "HCOPI":
          sPath = [latLngX, pch, pcg, pcf, pccentrocafe, latLngY];
          break;
        case "HCI":
          sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
          break;
        case "HSUM":
          sPath = [
            latLngX,
            pch,
            pcg,
            pcf,
            pce,
            pcd,
            pcisla,
            pclq,
            pci2,
            latLngY,
          ];
          break;
        case "HLQIM":
          sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
          break;

        //EDIFICIO I > EDIFICIOS [I-K]
        case "IJ":
          sPath = [latLngX, pci, pcgy, pcoo, latLngY];
          break;
        case "IK":
          sPath = [latLngX, pci, pcli, pclk1, pclk2, pck, latLngY];
          break;

        //SEGUNDA PARTE
        case "IDID":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
          break;
        case "IDS":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
          break;
        case "ILEE":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
          break;
        case "ILMCA":
          sPath = [latLngX, pci, pch, pcf, pce, pca, latLngY];
          break;
        case "IEP":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, pcep, latLngY];
          break;
        case "ISAV1":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pcsav1, latLngY];
          break;
        case "IDCB":
          sPath = [latLngX, pci, pch, pcg, pccb, latLngY];
          break;
        case "ILMAT":
          sPath = [latLngX, pci, pch, pcg, pccb, latLngY];
          break;
        case "ISAV2":
          sPath = [latLngX, pch, pcsav2, latLngY];
          break;
        case "ILIND":
          sPath = [latLngX, pci, pcli, latLngY];
          break;
        case "IDDEPI":
          sPath = [latLngX, pci, pcli, pclk1, latLngY];
          break;
        case "IEAU":
          sPath = [latLngX, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "ILCC":
          sPath = [latLngX, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "ILELO":
          sPath = [latLngX, pci, pcli, pclk1, latLngY];
          break;
        case "IALB":
          sPath = [latLngX, pci, pcgy, pcal, latLngY];
          break;
        case "ICM":
          sPath = [latLngX, pci, pcgy, pcoo, pcj, latLngY];
          break;
        case "ICFUT":
          sPath = [latLngX, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "IEAT":
          sPath = [latLngX, pci, pcgy, pcoo, pccan, latLngY];
          break;
        case "ISAV4":
          sPath = [latLngX, pch, pcsav4, latLngY];
          break;
        case "IAUDI":
          sPath = [latLngX, pch, pcsav4, pcaud, latLngY];
          break;
        case "ICAF":
          sPath = [latLngX, pch, latLngY];
          break;
        case "ISJD":
          sPath = [latLngX, pci, pch, pcg, pcf, pccentro, latLngY];
          break;
        case "IBSF":
          sPath = [latLngX, pci, pch, pcg, pcf, pccentro, latLngY];
          break;
        case "IDGV":
          sPath = [latLngX, pci, pch, pcg, pcf, pccentro, latLngY];
          break;
        case "IDSC":
          sPath = [latLngX, pci, pch, pcg, pcf, pccentrocafe, latLngY];
          break;
        case "ILRED":
          sPath = [latLngX, pci, pch, pcg, pcf, pccentrocafe, latLngY];
          break;
        case "ICOPI":
          sPath = [latLngX, pch, pcg, pcf, pccentrocafe, latLngY];
          break;
        case "ICI":
          sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
          break;
        case "ISUM":
          sPath = [
            latLngX,
            pch,
            pcg,
            pcf,
            pce,
            pcd,
            pcisla,
            pclq,
            pci2,
            latLngY,
          ];
          break;
        case "ILQIM":
          sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
          break;

        //EDIFICIO J > EDIFICIOS [J-K]
        case "JK":
          sPath = [latLngX, pcoo, pcal, pcel, pclk1, pclk2, latLngY];
          break;

        //SEGUNDA PARTE
        case "JDID":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
          break;
        case "JDS":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
          break;
        case "JLEE":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, latLngY];
          break;
        case "JLMCA":
          sPath = [latLngX, pci, pch, pcf, pce, pca, latLngY];
          break;
        case "JEP":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pca, pcep, latLngY];
          break;
        case "JSAV1":
          sPath = [latLngX, pci, pch, pcg, pcf, pce, pcsav1, latLngY];
          break;
        case "JDCB":
          sPath = [latLngX, pci, pch, pcg, pccb, latLngY];
          break;
        case "JLMAT":
          sPath = [latLngX, pci, pch, pcg, pccb, latLngY];
          break;
        case "JSAV2":
          sPath = [latLngX, pci, pch, pcsav2, latLngY];
          break;
        case "JLIND":
          sPath = [latLngX, pci, pcli, latLngY];
          break;
        case "JDDEPI":
          sPath = [latLngX, pci, pcli, pclk1, latLngY];
          break;
        case "JEAU":
          sPath = [latLngX, pci, pcli, pclk1, pclk2, latLngY];
          break;
        case "JLCC":
          sPath = [latLngX, pcli, pclk1, pclk2, latLngY];
          break;
        case "JLELO":
          sPath = [latLngX, pcli, pclk1, latLngY];
          break;
        case "JALB":
          sPath = [latLngX, pcgy, pcal, latLngY];
          break;
        case "JCM":
          sPath = [latLngX, pcj, latLngY];
          break;
        case "JCFUT":
          sPath = [latLngX, pcj, pccan, latLngY];
          break;
        case "JEAT":
          sPath = [latLngX, pcj, pccan, latLngY];
          break;
        case "JSAV4":
          sPath = [latLngX, pcj, pcsav4, latLngY];
          break;
        case "JAUDI":
          sPath = [latLngX, pcj, pccan, pcaud, latLngY];
          break;
        case "JCAF":
          sPath = [latLngX, pcj, pcsav4, latLngY];
          break;
        case "JSJD":
          sPath = [latLngX, pcj, pcsav4, pccentro, latLngY];
          break;
        case "JBSF":
          sPath = [latLngX, pcj, pcsav4, pccentro, latLngY];
          break;
        case "JDGV":
          sPath = [latLngX, pcj, pcsav4, pccentro, latLngY];
          break;
        case "JDSC":
          sPath = [latLngX, pcj, pcsav4, pccentrocafe, latLngY];
          break;
        case "JLRED":
          sPath = [latLngX, pcj, pcsav4, pccentrocafe, latLngY];
          break;
        case "JCOPI":
          sPath = [latLngX, pcj, pcsav4, pccentrocafe, latLngY];
          break;
        case "JCI":
          sPath = [
            latLngX,
            pci,
            pch,
            pcg,
            pcf,
            pce,
            pcd,
            pcisla,
            pclq,
            latLngY,
          ];
          break;
        case "JSUM":
          sPath = [
            latLngX,
            pci,
            pch,
            pcg,
            pcf,
            pce,
            pcd,
            pcisla,
            pclq,
            pci2,
            latLngY,
          ];
          break;
        case "JLQIM":
          sPath = [
            latLngX,
            pci,
            pch,
            pcg,
            pcf,
            pce,
            pcd,
            pcisla,
            pclq,
            latLngY,
          ];
          break;

        //K

        //SEGUNDA PARTE
        case "KDID":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pci,
            pch,
            pcg,
            pcf,
            pce,
            pca,
            latLngY,
          ];
          break;
        case "KDS":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pci,
            pch,
            pcg,
            pcf,
            pce,
            pca,
            latLngY,
          ];
          break;
        case "KLEE":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pci,
            pch,
            pcg,
            pcf,
            pce,
            pca,
            latLngY,
          ];
          break;
        case "KLMCA":
          sPath = [latLngX, pclk2, pclk1, pci, pch, pcf, pce, pca, latLngY];
          break;
        case "KEP":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pci,
            pch,
            pcg,
            pcf,
            pce,
            pca,
            pcep,
            latLngY,
          ];
          break;
        case "KSAV1":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pci,
            pch,
            pcg,
            pcf,
            pce,
            pcsav1,
            latLngY,
          ];
          break;
        case "KDCB":
          sPath = [latLngX, ppclk2, pclk1, ci, pch, pcg, pccb, latLngY];
          break;
        case "KLMAT":
          sPath = [latLngX, pclk2, pclk1, pci, pch, pcg, pccb, latLngY];
          break;
        case "KSAV2":
          sPath = [latLngX, pclk2, pclk1, pch, pcsav2, latLngY];
          break;
        case "KLIND":
          sPath = [latLngX, pclk2, pclk1, pcli, latLngY];
          break;
        case "KDDEPI":
          sPath = [latLngX, pclk2, pclk1, latLngY];
          break;
        case "KEAU":
          sPath = [latLngX, pclk2, latLngY];
          break;
        case "KLCC":
          sPath = [latLngX, pclk2, latLngY];
          break;
        case "KLELO":
          sPath = [latLngX, pclk2, pclk1, latLngY];
          break;
        case "KALB":
          sPath = [latLngX, pclk2, pclk1, pcgy, pcal, latLngY];
          break;
        case "KCM":
          sPath = [latLngX, pclk2, pclk1, pcgy, pcoo, pcj, latLngY];
          break;
        case "KCFUT":
          sPath = [latLngX, pclk2, pclk1, pcal, pcoo, pccan, latLngY];
          break;
        case "KEAT":
          sPath = [latLngX, pclk2, pclk1, pcal, pcoo, pccan, latLngY];
          break;
        case "KSAV4":
          sPath = [latLngX, pclk2, pclk1, pcal, pccampana, pcsav4, latLngY];
          break;
        case "KAUDI":
          sPath = [latLngX, pclk2, pclk1, pcal, pccampana, pcaud, latLngY];
          break;
        case "KCAF":
          sPath = [latLngX, pclk2, pclk1, pcal, pccampana, pcsav4, latLngY];
          break;
        case "KSJD":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pcal,
            pcgy,
            pci,
            pch,
            pcg,
            pcf,
            pccentro,
            latLngY,
          ];
          break;
        case "KBSF":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pcal,
            pcgy,
            pcipch,
            pcg,
            pcf,
            pccentro,
            latLngY,
          ];
          break;
        case "KDGV":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pcal,
            pcgy,
            pci,
            pch,
            pcg,
            pcf,
            pccentro,
            latLngY,
          ];
          break;
        case "KDSC":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pcal,
            pcgy,
            pci,
            pch,
            pcg,
            pcf,
            pccentrocafe,
            latLngY,
          ];
          break;
        case "KLRED":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pcal,
            pcgy,
            pci,
            pch,
            pcg,
            pcf,
            pccentrocafe,
            latLngY,
          ];
          break;
        case "KCOPI":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pcal,
            pcgy,
            pci,
            pcg,
            pcf,
            pccentrocafe,
            latLngY,
          ];
          break;
        case "KCI":
          sPath = [latLngX, pch, pcg, pcf, pce, pcd, pcisla, pclq, latLngY];
          break;
        case "KSUM":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pcal,
            pcgy,
            pci,
            pcg,
            pcf,
            pce,
            pcd,
            pcisla,
            pclq,
            pci2,
            latLngY,
          ];
          break;
        case "KLQIM":
          sPath = [
            latLngX,
            pclk2,
            pclk1,
            pcal,
            pcgy,
            pci,
            pcg,
            pcf,
            pce,
            pcd,
            pcisla,
            pclq,
            latLngY,
          ];
          break;
        //departamentos y faltantes

        //SUM
        case "SUMCI":
          sPath = [latLngX, latLngY];
          break;
        case "SUMLQIM":
          sPath = [latLngX, pci2, pclq, latLngY];
          break;
        case "SUMDID":
          sPath = [latLngX, pci2, pclq, latLngY];
          break;
        case "SUMDS":
          sPath = [latLngX, pci2, pclq, pca, latLngY];
          break;
        case "SUMEP":
          sPath = [latLngX, pci2, pclq, pca, pcep, latLngY];
          break;
        case "SUMLEE":
          sPath = [latLngX, pci2, pclq, pca, latLngY];
          break;
        case "SUMLMCA":
          sPath = [latLngX, pci2, pclq, pca, latLngY];
          break;
        case "SUMSAV1":
          sPath = [latLngX, pca, pcsav1, latLngY];
          break;
        case "SUMDCB":
          sPath = [latLngX, pca, pcsav1, pccb, latLngY];
          break;
        case "SUMLMAT":
          sPath = [latLngX, pca, pcsav1, pccb, latLngY];
          break;
        case "SUMSAV2":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav2, latLngY];
          break;
        case "SUMLIND":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, latLngY];
          break;
        case "SUMDDEPI":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            latLngY,
          ];
          break;
        case "SUMEAU":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pccentrocasileros,
            pcentppal,
            pcaud,
            pcgy,
            pcal,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "SUMLCC":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pccentrocasileros,
            pcentppal,
            pcaud,
            pcgy,
            pcal,
            latLngY,
          ];
          break;
        case "SUMLELO":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pccentrocasileros,
            pcentppal,
            pcaud,
            latLngY,
          ];
          break;
        case "SUMALB":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pccentrocasileros,
            pcentppal,
            pcaud,
            pcgy,
            pcal,
            latLngY,
          ];
          break;
        case "SUMCM":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pccentrocasileros,
            pcentppal,
            pcaud,

            latLngY,
          ];
          break;
        case "SUMCFUT":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pccentrocasileros,
            pcentppal,
            pcaud,
            pccan,
            latLngY,
          ];
          break;
        case "SUMEAT":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pccentrocasileros,
            pcentppal,
            pcaud,
            pccan,
            latLngY,
          ];
          break;
        case "SUMSAV4":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pccentrocasileros,
            pccentrocafe,
            pcsav4,
            latLngY,
          ];
          break;
        case "SUMAUDI":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pccentrocasileros,
            pcentppal,
            pcaud,
            latLngY,
          ];
          break;
        case "SUMCAF":
          sPath = [
            latLngX,
            pci2,
            pclq,
            pcisla,
            pcc,
            pcde,
            pcg,
            pch,
            pcsav4,
            latLngY,
          ];
          break;
        case "SUMSJD":
          sPath = [latLngX, pci2, pclq, pcisla, latLngY];
          break;
        case "SUMBSF":
          sPath = [latLngX, pci2, pclq, pcisla, latLngY];
          break;
        case "SUMDGV":
          sPath = [latLngX, pci2, pclq, pcisla, latLngY];
          break;
        case "SUMDSC":
          sPath = [latLngX, pci2, pclq, pcisla, latLngY];
          break;
        case "SUMLRED":
          sPath = [latLngX, pci2, pclq, pcisla, latLngY];
          break;
        case "SUMCOPI":
          sPath = [latLngX, pci2, pclq, pcisla, latLngY];
          break;

        case "CIDID":
          sPath = [latLngX, pca, latLngY];
          break;
        case "CIDS":
          sPath = [latLngX, pca, latLngY];
          break;
        case "CILEE":
          sPath = [latLngX, pca, latLngY];
          break;
        case "CILMCA":
          sPath = [latLngX, pca, latLngY];
          break;
        case "CIEP":
          sPath = [latLngX, pca, pcep, latLngY];
          break;
        case "CISAV1":
          sPath = [latLngX, pca, pcsav1, latLngY];
          break;
        case "CIDCB":
          sPath = [latLngX, pca, pcsav1, pccb, latLngY];
          break;
        case "CILMAT":
          sPath = [latLngX, pca, pcsav1, pccb, latLngY];
          break;
        case "CISAV2":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav2, latLngY];
          break;
        case "CILIND":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pci, pcli, latLngY];
          break;
        case "CIDDEPI":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            latLngY,
          ];
          break;
        case "CIEAU":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "CILCC":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pclk2,
            latLngY,
          ];
          break;
        case "CILELO":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            latLngY,
          ];
          break;
        case "CIALB":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcli,
            pclk1,
            pcal,
            latLngY,
          ];
          break;
        case "CICM":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pcj,
            latLngY,
          ];
          break;
        case "CICFUT":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "CIEAT":
          sPath = [
            latLngX,
            pca,
            pcc,
            pcde,
            pcg,
            pch,
            pci,
            pcgy,
            pcoo,
            pccan,
            latLngY,
          ];
          break;
        case "CISAV4":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, latLngY];
          break;
        case "CIAUDI":
          sPath = [latLngX, pca, pcc, pcde, pcg, pch, pcsav4, pcaud, latLngY];
          break;
        case "CICAF":
          sPath = [latLngX, pclq, pcisla, pccentrocasileros, latLngY];
          break;
        case "CISJD":
          sPath = [latLngX, pclq, pcisla, pccentro, latLngY];
          break;
        case "CIBSF":
          sPath = [latLngX, pclq, pcisla, pccentro, latLngY];
          break;
        case "CIDGV":
          sPath = [latLngX, pclq, pcisla, pccentro, latLngY];
          break;
        case "CIDSC":
          sPath = [latLngX, pclq, pcisla, latLngY];
          break;
        case "CILRED":
          sPath = [latLngX, pclq, pcisla, latLngY];
          break;
        case "CICOPI":
          sPath = [latLngX, pclq, pcisla, latLngY];
          break;
        case "CILQIM":
          sPath = [latLngX, pclq, latLngY];
          break;

        default:
          sPath = [latLngX,  latLngY]
          break;
      }
  }
  pathBetween = new google.maps.Polyline({
    path: sPath,
    strokeColor: "#ffa500",
    strokeOpacity: 1.0,
    strokeWeight: 3,
  });
  pathArray.push(pathBetween);
  pathBetween.setMap(map);
}

async function clean() {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}
async function showMarkers() {
  clean();
  getMarkers();
}
async function clearPath() {
  for (var i = 0; i < pathArray.length; i++) {
    pathArray[i].setMap(null);
  }
  pathArray.length = 0;
}
google.maps.event.addDomListener(window, "load", initialize);
window.initMap = initMap;
