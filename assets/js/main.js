$(document).ready(function(){

    autoComplete = 'Hall and oates'
    bandName = autoComplete.split(' ').join('+').toLowerCase();

    console.log(bandName);

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 10
      });

    let evfKey = 'dT9kBLwTGpSRrDZQ';

    $.ajax({
        url: 'http://api.eventful.com/json/performers/events/list?app_key=dT9kBLwTGpSRrDZQ&id=P0-001-000000265-4',
        method: 'GET',
        dataType: 'jsonp',
    }).then(function(response){
        console.log(response);
    })
    
});