$(document).ready(function(){

    autoComplete = 'Hall and oates'
    bandName = autoComplete.split(' ').join('+').toLowerCase();

    console.log(bandName);
    
    //call eventful API and place the band name in the seach paramater of the endpoint

    //NOT WORKING CROSS ORIGIN ERROR

    $.ajax({
        url: `http://api.eventful.com/json/performers/search?app_key=dT9kBLwTGpSRrDZQ&keywords=`+bandName,
        method: 'GET',
        dataSet: 'jsonp',
    }).then(function(response){
        console.log(response);
    })









});