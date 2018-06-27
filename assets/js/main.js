$(document).ready(function () {

    $('.artist-val').focus();

    let searchInput;
    let tourResultObj = [];
    let userAddressLat;
    let userAddressLng;

    //This function will take the current object (placed in x) and modify the dom based on the objects contents
    function popArtistList(x) {
        if (x.image === null) {
            artistImage = 'https://i.pinimg.com/originals/55/04/f9/5504f9e91eea2dd858e595845142c7da.jpg'
        } else {
            artistImage = x.image.medium.url.split('//').join('https://');
        }

        let resRow = $('<div>').attr({
            id: x.id,
            class: 'res-row row',
            'data-name': x.name,
            'data-bio': x.short_bio,
        });
        let imgCol = $('<div>').attr({ class: 'col-sm-2 mx-auto img-col' });
        let resImg = $('<img>').attr({
            class: 'res-image img-fluid mx-auto',
            src: artistImage,
        });
        let contentCol = $('<div>').attr({ class: 'col-sm-8 res-content text-center' });
        let resTitleRow = $('<div>').attr({ class: 'row title-row text-center' });
        let resTitle = $('<h2>').attr({ class: 'text-center' });
        let resBodyRow = $('<div>').attr({ class: 'row res-body-row text-left' });
        let resLocation = $('<h3>').attr({ class: 'text-left' });
        let dateCol = $('<div>').attr({ class: 'col-sm-2 res-date text-center' });
        let resDate = $('<h4>');

        $('.search-results').append(resRow);
        $('#' + x.id).append(imgCol);
        $('#' + x.id + ' .img-col').append(resImg);
        $('#' + x.id).append(contentCol);
        $('#' + x.id + ' .res-content').append(resTitleRow);
        $('#' + x.id + ' .title-row').append(resTitle);
        resTitle.text(x.name);
        $('#' + x.id + ' .res-content').append(resBodyRow);
        $('#' + x.id + ' .res-body-row').append(resLocation);
        resLocation.text(x.short_bio);
        //click function to populate map from multiple bands
        $('#' + x.id).on("click", function () {
            console.log("Tour info my guy");
            $('.search-results').empty(); //<<<<empty right on click
            $.ajax({
                url: 'http://api.eventful.com/json/performers/events/list?app_key=dT9kBLwTGpSRrDZQ&id=' + x.id,
                method: 'GET',
                dataType: 'jsonp',
            }).then(function (tourInfo) {
                //grabs the correct ajax response
                console.log(tourInfo);
                if (tourInfo.event_count === "0") {
                    console.log("no tours :(");
                    //if no tour have a pop up?? 
                }
                else {
                    //I want to put events on map
                    //new blank map
                    window.map = new google.maps.Map(document.getElementById('map'), {
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                    var infowindow = new google.maps.InfoWindow();//info after clicking marker                 
                    var bounds = new google.maps.LatLngBounds();//fits map correctly
                    //one more ajax call to get lat and long
                    console.log("we got concerts"); //event.id
                    //grab each event
                    $.each(tourInfo.event, function () {
                        $.ajax({
                            url: 'http://api.eventful.com/json/events/get?app_key=dT9kBLwTGpSRrDZQ&id=' + this.id,
                            method: 'GET',
                            dataType: 'jsonp'
                        }).then(function (details) {
                            console.log("----------------------------------")
                            console.log(details); //correctly grabbing each separate event and their info



                            ///////////////////////////////////////////////////////////////////////////////
                            //here is where I want to grab each event, put in a div and populate the div to .search results//
                            



                            let tourRow = $('<div>').attr({ 
                                class: 'res-row row',
                                id : details.id,
                                'data-lat': details.latitude,
                                'data-lng': details.longitude,
                            });

                            let imgCol = $('<div>').attr({ class: 'col-sm-2 img-col' });
                            let resImg = $('<img>').attr({
                                class: 'res-image img-fluid mx-auto',
                                src: details.images.image["0"].medium.url,
                            });
                            let tourContentCol = $('<div>').attr({ class: 'col-sm-8 res-content text-left' });

                            let tourTitleRow = $('<div>').attr({ class: 'row title-row text-left' })
                            let tourTitle = $('<h2>').attr({ class: 'text-center' });
                            let tourBodyRow = $('<div>').attr({ class: 'row res-body-row text-left' });
                            let tourLocation = $('<h3>').attr({ class: 'text-left' });
                            let dateCol = $('<div>').attr({ class: 'col-sm-2 res-date text-center' });
                            let tourDate = $('<h4>');

                            $('.search-results').append(tourRow);
                            tourRow.append(imgCol);
                            imgCol.append(resImg);
                            tourRow.append(tourContentCol);
                            tourContentCol.append(tourTitleRow);
                            tourTitleRow.append(tourTitle);
                            tourTitle.text(details.title);
                            tourContentCol.append(tourBodyRow);
                            tourBodyRow.append(tourLocation);
                            tourLocation.text(details.city+", " + details.region + ": " + details.venue_name);
                            tourRow.append(dateCol);
                            dateCol.append(tourDate);
                            tourDate.text(details.start_time);
                            
                            //mark out the map
                            marker = new google.maps.Marker({
                                position: new google.maps.LatLng(details.latitude, details.longitude),
                                map: map
                            });
                            bounds.extend(marker.position);
                            map.fitBounds(bounds);

                            // below is your marker info
                            let windowContent = `
                             <div class="row wc-content">
                                 <div class="col-md-3">
                                     <img class="img-circle wc-image" src="`+ details.images.image["0"].small.url + `">
                                 </div>
                                 <div class="col-md-9">
                                     <div class="wc-title">
                                         <h6>`+ details.title + `</h6>
                                     </div>
                                     <div class="wc-location">
                                         <p>`+ details.city + `, ` + details.region_abbr + ` @ ` + details.venue_name + `</p>
                                     </div>
                                 </div>
                             </div>
                             `
                            //click event for marker
                            google.maps.event.addListener(marker, 'click', (function (marker) {
                                return function () {
                                    infowindow.setContent(windowContent);
                                    infowindow.open(map, marker);
                                }
                            })(marker));

                        });
                    });
                }
            });
        });
    }

    function performSearch() {
        $('#artist-search').submit(function (event) {
            event.preventDefault();
            searchInput = $('.artist-val').val().trim().split(' ').join('+').toLowerCase();
            $('.artist-val').val('');
            $('.search-results').empty();
            console.log(searchInput);

            $.ajax({
                //search for performers this returns all artists
                url: `https://api.eventful.com/json/performers/search?app_key=dT9kBLwTGpSRrDZQ&keywords=` + searchInput,
                method: 'GET',
                dataType: 'jsonp',
            }).then(function (artistSearch) {
                let performersObj = artistSearch.performers.performer
                let performersAmt = performersObj.length;

                if (performersAmt > 1) {
                    $.each(performersObj, function () {
                        popArtistList(this);
                    })
                } else {
                    //new blank map
                    window.map = new google.maps.Map(document.getElementById('map'), {
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                    var infowindow = new google.maps.InfoWindow();//info after clicking marker                 
                    var bounds = new google.maps.LatLngBounds();//fits map correctly

                    console.log(performersObj.name);
                    console.log('Artist ID: ', performersObj.id)
                    $.ajax({
                        //this grabs specific artist
                        url: 'https://api.eventful.com/json/performers/events/list?app_key=dT9kBLwTGpSRrDZQ&id=' + performersObj.id,
                        method: 'GET',
                        dataType: 'jsonp',
                    }).then(function (tourList) {
                        console.log(tourList);
                        $.each(tourList.event, function () {
                            $.ajax({
                                //this is specific tour entries-returns indicvidual tour entries relating to artist
                                url: 'http://api.eventful.com/json/events/get?app_key=dT9kBLwTGpSRrDZQ&id=' + this.id,
                                method: 'GET',
                                dataType: 'jsonp'
                            }).then(function (tourInfo) {
                                tourResultObj.push(tourInfo);
                                console.log(tourInfo)
                                console.log('lat: ', tourInfo.latitude, ' lng: ', tourInfo.longitude);

                                marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(tourInfo.latitude, tourInfo.longitude),
                                    map: map
                                });

                                bounds.extend(marker.position);
                                map.fitBounds(bounds);

                                // below is your marker info
                                let windowContent = `
                                <div class="row wc-content">
                                    <div class="col-md-3">
                                        <img class="img-circle wc-image" src="`+ tourInfo.images.image["0"].small.url + `">
                                    </div>
                                    <div class="col-md-9">
                                        <div class="wc-title">
                                            <h6>`+ tourInfo.title + `</h6>
                                        </div>
                                        <div class="wc-location">
                                            <p>`+ tourInfo.city + `, ` + tourInfo.region_abbr + ` @ ` + tourInfo.venue_name + `</p>
                                        </div>
                                    </div>
                                </div>
                                `
                                //click event for marker
                                google.maps.event.addListener(marker, 'click', (function (marker) {
                                    return function () {
                                        infowindow.setContent(windowContent);
                                        infowindow.open(map, marker);
                                    }
                                })(marker));
                            })
                        })
                    })

                }

            })
        })
    }
    performSearch();


    //this is pertaining to the modal on the splash page <plz do not delete my dudes>
    $(window).on('load', function () {
        if(window.location.href.includes('index')) {
        showModal();
        }
    });

    //this is so nav icon can be clickable
    function showModal(){
        $('#myModal').modal({backdrop: 'static', keyboard: false , show: true});

        $(document).on("click", "#locate-button", function () {
            localStorage.clear();
            console.log("clicked locate-button"); //click is functioning
            if ("geolocation" in navigator) { //check geolocation available 
                //try to get user current location using getCurrentPosition() method
                navigator.geolocation.getCurrentPosition(function (position) {
                    console.log("Found your location \nLat : " + position.coords.latitude + " \nLong :" + position.coords.longitude);
                    var currLat = position.coords.latitude;
                    var currLong = position.coords.longitude;
                    //here we store these variables into localStorage (because we can use this info for google maps)
                    localStorage.setItem("currLat", currLat);
                    localStorage.setItem("currLong", currLong);
                    var newUrl = "search.html";
                    window.location.replace(newUrl);
                    //to use coordinates with google maps, make sure you use localStorage.currLong or localStorage.currLat
                });
            } else {
                console.log("Browser doesn't support geolocation!");
            }
        });
    }
    //check if variable exists outside clicks (hence, saved in Local)
    console.log("local storage has " + localStorage.currLat + " " + localStorage.currLong);
    console.log("local storage : \n address is " + localStorage.address + " \n city is " + localStorage.city + "\n state is " + localStorage.state + "\n zip is " + localStorage.zipcode);

    //this is so submit can send you to search.html
    $(document).on("click", "#submit-button", function () {

        if ($('#state-in').val() == '') {
            console.log('must enter state')
            $('.alert-container').fadeIn();
            setTimeout(() => {
                $('.alert-container').fadeOut();
            }, 2000);

        } else {

            localStorage.clear();
            //grabs values from input
            var address = $("#address-in").val().trim();
            var city = $("#city-in").val().trim();
            var state = $("#state-in").val().trim();
            var zipcode = $("#zip-in").val().trim();
            //saves values from input and saves to local storage for us to use
            localStorage.setItem("address", address);
            localStorage.setItem("city", city);
            localStorage.setItem("state", state);
            localStorage.setItem("zipcode", zipcode);
            console.log(city + " " + state + " " + zipcode);

            var newUrl = "search.html";
            window.location.replace(newUrl);

        }
    });
    
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
        }, function (response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
                console.log(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    //if user manages to get to this page without submitting geo info, it asks for it again
    if (window.location.href.includes('search') && localStorage.currLat == undefined && localStorage.state == undefined) {
        showModal();
        console.log('all conditions met')
    } else if (localStorage.currLat !== undefined) { //else if geo data from button exists, use that
        userAddressLat = parseFloat(localStorage.currLat);
        userAddressLng = parseFloat(localStorage.currLong);
        console.log("geo location passed through: " + userAddressLat + userAddressLng)
        window.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: userAddressLat, lng: userAddressLng},
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        })
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(userAddressLat,userAddressLng),
            map: map
        });
    } else { //else use user input & populate map
        $.ajax({
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=`+ localStorage.address +`,`+ localStorage.city +`,`+ localStorage.state +`&key=AIzaSyByQ2vFELH2U1syRSBKWtQI_NKo-EBIjDI`,
            method: 'GET',
            dataType: 'json',
        }).then(function(geoCodeResponse){
            userAddressLat = geoCodeResponse.results["0"].geometry.location.lat;
            userAddressLng = geoCodeResponse.results["0"].geometry.location.lng;
            console.log(userAddressLat,userAddressLng)
            window.map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: userAddressLat, lng: userAddressLng},
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            })
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(userAddressLat,userAddressLng),
                map: map
            }); 
        });
    }   

});