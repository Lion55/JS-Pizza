$(function () {

    function initialize() {
        var mapProp = {
            center: new google.maps.LatLng(50.464379, 30.519131), 
            zoom: 13
        };
        var html_element = document.getElementById("googleMap");
        var map = new google.maps.Map(html_element, mapProp);

        var point = new google.maps.LatLng(50.464379, 30.519131);
        var marker = new google.maps.Marker({
            position: point,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: "assets/images/map-icon.png"
        });

        var coordinates;
        var marker_home;
        var counter = 0;

        google.maps.event.addListener(map, 'click', function (me) {
            if (counter > 0) {
                marker_home.setMap(null);
            }
            counter++;
            coordinates = me.latLng;
            marker_home = new google.maps.Marker({
                position: coordinates,
                map: map,
                animation: google.maps.Animation.DROP,
                icon: "assets/images/home-icon.png"
            });
            calculateRoute(point, coordinates, function () {
                console.log(this);
            });
        });

        function geocodeLatLng(latlng, callback) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK && results[1]) {
                    var address = results[1].formatted_address;
                    callback(null, address);
                } else {
                    callback(new Error("Can't find adress"));
                }
            });
        }

        var addressForm = $(".address-form");

        google.maps.event.addListener(map, 'click', function (me) {
            coordinates = me.latLng;
            geocodeLatLng(coordinates, function (err, address) {
                if (!err) {
                    console.log(address);
                    $('#order-address').text(address);
                    $("#address").val(address);
                    addressForm.find(".has-error").attr("class", "status");
                    addressForm.find(".status").attr("class", "has-success");
                } else {
                    console.log("Немає адреси")
                }
            })
        });

        function geocodeAddress(address, callback) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': address}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    coordinates = results[0].geometry.location;
                    callback(null, coordinates);
                    if (marker_home != null || counter > 0) {
                        marker_home.setMap(null);
                    }
                    $('#order-address').val(address);
                    marker_home = new google.maps.Marker({
                        position: coordinates,
                        map: map,
                        animation: google.maps.Animation.DROP,
                        icon: "assets/images/home-icon.png"
                    });
                    calculateRoute(point, coordinates, function () {
                        console.log(this);
                    });
                } else {
                    callback(new Error("Can not find the adress"));
                }
            });
        }

        $("#address").focusout(function () {
            var address = $("#address").val();
            geocodeAddress($(this).val(), function (err) {
			if (!err) {
				addressForm.find(".has-error").attr("class", "status");
                addressForm.find(".has-success").attr("class", "status");
                addressForm.find(".help-block").css("display", "none");
                addressForm.find(".status").attr("class", "has-success");
                $('#order-address').text(address);
                geocodeAddress(address);
			} else {
				addressForm.find(".has-error").attr("class", "status");
                addressForm.find(".has-success").attr("class", "status");
                addressForm.find(".status").attr("class", "has-error");
                addressForm.find(".help-block").css("display", "inline");
                $('#order-address').text("невідома");
			}
            });   
        });

        function calculateRoute(A_latlng, B_latlng, callback) {
            var directionService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            directionService.route({
                origin: A_latlng,
                destination: B_latlng,
                travelMode: google.maps.TravelMode["DRIVING"]
            }, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var leg = response.routes[0].legs[0];
                    callback(null, {
                        duration: leg.duration
                    });
                    $("#time").text(leg.duration.text);
                    console.log(leg.duration);
                } else {
                    callback(new Error("Can' not find direction"));
                }
            });
        }
    }

    google.maps.event.addDomListener(window, 'load', initialize);

});