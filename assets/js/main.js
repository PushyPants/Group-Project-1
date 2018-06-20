$(document).ready(function(){

    autoComplete = 'Hall and oates'
    bandName = autoComplete.split(' ').join('+').toLowerCase();

    console.log(bandName);

    
    //this is pertaining to the modal on the splash page <plz do not delete my dudes>

    $(window).on('load',function(){
        $('#myModal').modal('show');
    });

    // //this plays my song--- or should
    // var song = document.createElement('audio');
    // song.setAttribute("src", ".//audio/travel-song");
    // song.play();


    // map = new google.maps.Map(document.getElementById('map'), {
    //     center: {lat: -34.397, lng: 150.644},
    //     zoom: 10
    //   });

    // let evfKey = 'dT9kBLwTGpSRrDZQ';

    // $.ajax({
    //     url: 'http://api.eventful.com/json/performers/events/list?app_key=dT9kBLwTGpSRrDZQ&id=P0-001-000000265-4',
    //     method: 'GET',
    //     dataType: 'jsonp',
    // }).then(function(response){
    //     console.log(response);
    // })
    
    //call eventful API and place the band name in the seach paramater of the endpoint

    //NOT WORKING CROSS ORIGIN ERROR

    $.ajax({
        url: `http://api.eventful.com/json/performers/search?app_key=dT9kBLwTGpSRrDZQ&keywords=`+bandName,
        method: 'GET',
        dataType: 'jsonp',
    }).then(function(response){
        console.log(response);
    })









});