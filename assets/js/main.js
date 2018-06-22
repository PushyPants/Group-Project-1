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
                url: `https://api.eventful.com/json/performers/search?app_key=dT9kBLwTGpSRrDZQ&keywords=`+searchInput,
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
                        url: 'https://api.eventful.com/json/performers/events/list?app_key=dT9kBLwTGpSRrDZQ&id='+performersObj.id,
                        method: 'GET',
                        dataType: 'jsonp',
                    }).then(function(tourList){
                        console.log(tourList);
                        $.each(tourList.event, function(){
                            $.ajax({
                                url: 'http://api.eventful.com/json/events/get?app_key=dT9kBLwTGpSRrDZQ&id='+this.id,
                                method: 'GET',
                                dataType: 'jsonp'
                            }).then(function(tourInfo){
                                console.log(tourInfo)
                                console.log('lat: ',tourInfo.latitude,' lng: ',tourInfo.longitude);
                            })
                        })
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
    //this is so nav icon can be clickable
    $(document).on("click", "#locate-button",function(){
        localStorage.clear();
        console.log("clicked locate-button"); //click is functioning
        if ("geolocation" in navigator){ //check geolocation available 
            //try to get user current location using getCurrentPosition() method
            navigator.geolocation.getCurrentPosition(function(position){ 
                    console.log("Found your location \nLat : "+position.coords.latitude+" \nLong :"+ position.coords.longitude);
                    var currLat = position.coords.latitude;
                    var currLong = position.coords.longitude;
                        //here we store these variables into localStorage (because we can use this info for google maps)
                        localStorage.setItem("currLat", currLat); 
                        localStorage.setItem("currLong", currLong);
                    var newUrl = "search.html";
                    window.location.replace(newUrl);
                    //to use coordinates with google maps, make sure you use localStorage.currLong or localStorage.currLat
                });
            }else{
                console.log("Browser doesn't support geolocation!");
            }
        });
    //check if variable exists outside clicks (hence, saved in Local)
    console.log("local storage has " + localStorage.currLat+" "+localStorage.currLong); 
    console.log("local storage : \n address is "+localStorage.address+" \n city is " +localStorage.city+"\n state is " +localStorage.state +"\n zip is " +localStorage.zipcode);
        
    //this is so submit can send you to search.html
    $(document).on("click", "#submit-button",function(){
        localStorage.clear();

        var address = $("#address-in").val().trim();
        var city = $("#city-in").val().trim();
        var state = $("#state-in").val().trim();
        var zipcode = $("#zip-in").val().trim();
        localStorage.setItem("address", address);
        localStorage.setItem("city", city);
        localStorage.setItem("state", state);
        localStorage.setItem("zipcode", zipcode);
        console.log(city+" "+state+" "+zipcode);
        
        
        var newUrl = "search.html";
        window.location.replace(newUrl);
    });




    // MAPPING CODE
    // events to test marker of results
    var event1 = {event: "Albany Concert", lat: 42.667, lng: -73.75};
    var event2 = {event: "Albuquerque Concert", lat: 35.0833, lng: -106.65};
    var event3= {event: "Amarilllo Concert", lat: 35.1833, lng: -101.833};
    var arrayOfEvents = [event1,event2,event3];
    var event1Loc = {lat: event1.lat, lng: event1.lng};
    // place holder variables for point to point directions
    var start ={
        lat: 29.743414,
        lng: -95.392648
    };
    
    var end = {
        lat:30.266474,
        lng: -97.740786
    };
    // function to generate a map with markers for each result
    function resultsMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: {lat: 39.833333, lng:-98.583333}
        });
        var marker = new google.maps.Marker({
            position: start, 
            map: map
        });
        var marker = new google.maps.Marker({position: end, map: map});
        var marker = new google.maps.Marker({position: {lat: event1.lat, lng: event1.lng}, map: map});
        var marker = new google.maps.Marker({position: {lat: event2.lat, lng: event2.lng}, map: map});
        var marker = new google.maps.Marker({position: {lat: event3.lat, lng: event3.lng}, map: map});
       
        // bounds  = new google.maps.LatLngBounds();
        // console.log(bounds);
        // console.log(loc);
        // bounds.extend(loc);
        // map.fitBounds(bounds); 
        // map.panToBounds(bounds); 

                        //******* LOOP AND RECENTER MAP TO BOUNDS *******/
                        // function initialize() {
                        //     var locations = [
                        //         ['DESCRIPTION', 41.926979, 12.517385, 3],
                        //         ['DESCRIPTION', 41.914873, 12.506486, 2],
                        //         ['DESCRIPTION', 61.918574, 12.507201, 1],
                        //         ['DESCRIPTION', 39.833333, -98.583333, 14]
                        //     ];
                        
                        //     window.map = new google.maps.Map(document.getElementById('map'), {
                        //         mapTypeId: google.maps.MapTypeId.ROADMAP
                        //     });
                        
                        //     var infowindow = new google.maps.InfoWindow();
                        
                        //     var bounds = new google.maps.LatLngBounds();
                        
                        //     for (i = 0; i < locations.length; i++) {
                        //         marker = new google.maps.Marker({
                        //             position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                        //             map: map
                        //         });
                        
                        //         bounds.extend(marker.position);
                        
                        //         google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        //             return function () {
                        //                 infowindow.setContent(locations[i][0]);
                        //                 infowindow.open(map, marker);
                        //             }
                        //         })(marker, i));
                        //     }
                        
                        //     map.fitBounds(bounds);
                        
                        // }


    }
    resultsMap();
        // map for point to point
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
        // initMap();

        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                directionsService.route({
                    origin: start,  
                    destination: end,  
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