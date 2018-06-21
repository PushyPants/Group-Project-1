
function myMap() {
var mapProp= {
    center:new google.maps.LatLng(29.761993, -95.366302),
    zoom:10,
};
var map=new google.maps.Map(document.getElementById("map-canvas"),mapProp);
}
var infowindow = new google.maps.InfoWindow({
    content: "Hello World!"
  });
  var marker = new google.maps.Marker({position:myCenter});
  marker.setMap(map)
  infowindow.open(map,marker)



// <!--
// To use this code on your website, get a free API key from Google.
// Read more at: https://www.w3schools.com/graphics/google_maps_basic.asp
// 305 E 5th St, Austin, TX 78701
// -->
