var map = L.map('map').setView([0, 0], 2); // Default center and zoom level

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Create a reference to the info div
var infoDiv = document.getElementById('info');

// Load store data from CSV
fetch('stores.csv')
  .then((response) => response.text())
  .then((data) => {
    var lines = data.split('\n');
    for (var i = 1; i < lines.length; i++) {
      let fields = lines[i].split(',');
      let storeName = fields[0];
      let address = fields[1];
      let link = fields[2];
      console.log(fields);
      // Use Nominatim API to get latitude and longitude
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`,
      )
        .then((response) => response.json())
        .then((json) => {
          var lat = parseFloat(json[0].lat);
          var lon = parseFloat(json[0].lon);

          var marker = L.marker([lat, lon]).addTo(map);

          // Bind a popup with store details to the marker
          var popupContent = `
            <strong>${storeName}</strong><br>
            Address: ${address}<br>
            <a href=" ${link}">${storeName}</a>
          `;
          marker.bindPopup(popupContent);

          // Add event listener to marker to show details in the info div
          marker.on('click', function () {
            infoDiv.innerHTML = popupContent;
          });
        })
        .catch((error) => console.error('Error:', error));
    }
  })
  .catch((error) => console.error('Error:', error));
