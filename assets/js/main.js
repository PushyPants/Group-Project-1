$(document).ready(function(){

    autoComplete = 'Hall and oates'
    bandName = autoComplete.split(' ').join('+').toLowerCase();

    console.log(bandName);

    
    //this is pertaining to the modal on the splash page <plz do not delete my dudes>

    $(window).on('load',function(){
        $('#myModal').modal('show');
    });
   
    $.ajax({
        url: 'http://api.eventful.com/json/performers/events/list?app_key=dT9kBLwTGpSRrDZQ&id=P0-001-000000265-4',
        method: 'GET',
        dataType: 'jsonp',
    }).then(function(response){
        console.log(response);
    })

    $.ajax({
        url: `http://api.eventful.com/json/performers/search?app_key=dT9kBLwTGpSRrDZQ&keywords=`+bandName,
        method: 'GET',
        dataType: 'jsonp',
    }).then(function(response){
        console.log(response);
    })



    var start ={
        lat: 29.743414,
        lng: -95.392648
    };

    var end = {
        lat:30.266474,
        lng: -97.740786
    };
    function initMap() {
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var directionsService = new google.maps.DirectionsService;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: start
        });
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('right-panel'));

        calculateAndDisplayRoute(directionsService, directionsDisplay);
    }

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        //var selectedMode = "DRIVING";
        directionsService.route({
          origin: start,  
          destination: end,  
          // Note that Javascript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
            console.log(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    }





});