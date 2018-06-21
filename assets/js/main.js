$(document).ready(function(){

    let searchInput;
    let artistResults = [];

    //console.log(bandName);

    function popResults() {
        $('#artist-search').submit(function(event){
            event.preventDefault();
            searchInput = $('.artist-val').val().trim().split(' ').join('+').toLowerCase();
            $('.artist-val').val('');
            console.log(searchInput);

            
            $.ajax({
                url: `http://api.eventful.com/json/performers/search?app_key=dT9kBLwTGpSRrDZQ&keywords=`+searchInput,
                method: 'GET',
                dataType: 'jsonp',
            }).then(function(response){
                let performersObj = response.performers.performer
                console.log(performersObj);
                let performersAmt = performersObj.length;
                console.log(performersAmt);

                if (performersAmt > 1) {
                    $.each(performersObj, function(){
                        console.log(this.name)
                        console.log('Artist ID: ',this.id)
                    })
                } else {
                    console.log(performersObj.name);
                    console.log('Artist ID: ',performersObj.id)
                    $.ajax({
                        url: 'http://api.eventful.com/json/performers/events/list?app_key=dT9kBLwTGpSRrDZQ&id='+performersObj.id,
                        method: 'GET',
                        dataType: 'jsonp',
                    }).then(function(response){
                        console.log(response);
                    })
                }

            })
        })

        //if results return more tha one artist 
            //loop trough change the dom to list all artists
                //on click of particular artist repopulate list with tour dates
        //else 
            //update DOM with list of tour dates
    }
    popResults();

    
    //this is pertaining to the modal on the splash page <plz do not delete my dudes>
    $(window).on('load',function(){
        $('#myModal').modal('show');
    });



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