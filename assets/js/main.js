$(document).ready(function(){

    $('.artist-val').focus();

    let searchInput;
    let tourResultObj = [];

    //This function will take the current object (placed in x) and modify the dom based on the objects contents
    function popArtistList (x){
        if (x.image === null) {
            artistImage = 'https://i.pinimg.com/originals/55/04/f9/5504f9e91eea2dd858e595845142c7da.jpg'
        } else {
            artistImage = x.image.medium.url.split('//').join('https://');
        }

        let resRow = $('<div>').attr({
            id: x.id,
            class: 'res-row row',
            'data-name' : x.name,
            'data-bio' : x.short_bio,
        });
        let imgCol = $('<div>').attr({class: 'col-sm-2 mx-auto img-col'});
        let resImg = $('<img>').attr({
            class: 'res-image img-fluid mx-auto',
            src: artistImage,
        });
        let contentCol = $('<div>').attr({class: 'col-sm-8 res-content text-center'});
        let resTitleRow = $('<div>').attr({class: 'row title-row text-center'})
        let resTitle = $('<h2>').attr({class:'text-center'});
        let resBodyRow = $('<div>').attr({class: 'row res-body-row text-left'});
        let resLocation = $('<h3>').attr({class: 'text-left'});
        let dateCol = $('<div>').attr({class: 'col-sm-2 res-date text-center'});
        let resDate = $('<h4>');

        $('.search-results').append(resRow);
            $('#'+x.id ).append(imgCol);
                $('#'+x.id+' .img-col').append(resImg);
            $('#'+x.id).append(contentCol);
                $('#'+x.id+' .res-content').append(resTitleRow);
                $('#'+x.id+' .title-row').append(resTitle);
                    resTitle.text(x.name);
                $('#'+x.id+' .res-content').append(resBodyRow);
                $('#'+x.id+' .res-body-row').append(resLocation);
                    resLocation.text(x.short_bio);
    }

    function performSearch() {
        $('#artist-search').submit(function(event){
            event.preventDefault();
            searchInput = $('.artist-val').val().trim().split(' ').join('+').toLowerCase();
            $('.artist-val').val('');
            $('.search-results').empty();
            console.log(searchInput);

            
            $.ajax({
                url: `https://api.eventful.com/json/performers/search?app_key=dT9kBLwTGpSRrDZQ&keywords=`+searchInput,
                method: 'GET',
                dataType: 'jsonp',
            }).then(function(artistSearch){
                let performersObj = artistSearch.performers.performer
                let performersAmt = performersObj.length;

                if (performersAmt > 1) {
                    $.each(performersObj, function(){
                        popArtistList(this);
                    })
                } else {
                    window.map = new google.maps.Map(document.getElementById('map'), {
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });                
                    var infowindow = new google.maps.InfoWindow();                
                    var bounds = new google.maps.LatLngBounds();

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
                                tourResultObj.push(tourInfo);
                                console.log(tourInfo)
                                console.log('lat: ',tourInfo.latitude,' lng: ',tourInfo.longitude);

                                marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(tourInfo.latitude, tourInfo.longitude),
                                    map: map
                                });
                        
                                bounds.extend(marker.position);
                                map.fitBounds(bounds);  

                                let windowContent = `
                                <div class="row wc-content">
                                    <div class="col-md-3">
                                        <img class="img-circle wc-image" src="`+tourInfo.images.image["0"].small.url+`">
                                    </div>
                                    <div class="col-md-9">
                                        <div class="wc-title">
                                            <h6>`+tourInfo.title+`</h6>
                                        </div>
                                        <div class="wc-location">
                                            <p>`+tourInfo.city+`, `+tourInfo.region_abbr+` @ `+tourInfo.venue_name+`</p>
                                        </div>
                                    </div>
                                </div>
                                `

                                google.maps.event.addListener(marker, 'click', (function (marker) {
                                    return function () {
                                        infowindow.setContent(windowContent);
                                        infowindow.open(map, marker);
                                    }
                                })(marker));
                            })
                        })
                        //change timeout to somehow wait till each loop is finished
                        // setTimeout(function(){
                        //     resultsMap()
                        //     console.log(tourResultObj)
                        // },10000);
                        // console.log(tourResultObj);
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
    performSearch();


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
    console.log("local storage zip is " +localStorage.zipcode);
        
    //this is so submit can send you to search.html
    $(document).on("click", "#submit-button",function(){
        localStorage.clear();
        var city = $("#city-in").val().trim();
        var state = $("#state-in").val().trim();
        var zip = $("#zip-in").val().trim();
        localStorage.setItem("zipcode", zip);
        console.log(city+" "+state+" "+zip);
        
        
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
        // var map = new google.maps.Map(document.getElementById('map'), {
        //     zoom: 4,
        //     //change to users stored location value
        //     center: {lat: 39.833333, lng:-98.583333}
        // });


        /******* LOOP AND RECENTER MAP TO BOUNDS *******/   
        
            // var locations = [
            //     ['DESCRIPTION', 41.926979, 12.517385, 3],
            //     ['DESCRIPTION', 41.914873, 12.506486, 2],
            //     ['DESCRIPTION', 61.918574, 12.507201, 1],
            //     ['DESCRIPTION', 39.833333, -98.583333, 14]
            // ];
        
            window.map = new google.maps.Map(document.getElementById('map'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        
            var infowindow = new google.maps.InfoWindow();
        
            var bounds = new google.maps.LatLngBounds();
            console.log(tourResultObj.length)
        
            for (i = 0; i < tourResultObj.length; i++) {
                console.log('anything')
                console.log(tourResultObj[i])
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(tourResultObj[i].latitude, tourResultObj[i].longitude),
                    map: map
                });
        
                bounds.extend(marker.position);
        
                // google.maps.event.addListener(marker, 'click', (function (marker, i) {
                //     return function () {
                //         infowindow.setContent(tourResultObj[i][0]);
                //         infowindow.open(map, marker);
                //     }
                // })(marker, i));
            }
        
            map.fitBounds(bounds);

    }


    //resultsMap();

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