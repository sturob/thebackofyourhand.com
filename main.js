
  window.onFrame = function(){ }; 


  window.v = { // has to match studio
    inputs: {
      highpass: 10,
      power: 0.41,
      labels: 5200
    }
  };

  $(function() {

    $(window).bind('resize', function() {
      $('canvas').attr({
        width: window.innerWidth, height: window.innerHeight
      });
    });

    $('body').trigger('resize');

    var params = window.location.hash.substr(1).split('=');

    if (params.length > 1) {
      var auth = params[1];
      $('.foursquareauth').hide();
      $('#map, #canvas').show();
    } else {
      return;
    }

    //paper.install( window );
    //paper.setup( $('canvas')[0] ); // Create

    // (function animloop() {
    //   requestAnimFrame( animloop );
    //   window.onFrame();
    //   paper.view.draw();
    // })();


    window.v.map = new L.Map('map');

    var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/65711/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = '©2012 OSM, CloudMade + foursquare',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18,  detectRetina: true, attribution: cloudmadeAttribution});

    v.map.addLayer( cloudmade );

    v.map.setView(new L.LatLng( 51.522225, -0.109496 ), 12).addLayer(cloudmade);
    v.map.boxZoom.disable();

    v.canvasTiles = new L.TileLayer.Canvas();
    v.canvasTiles.drawTile = function(canvas, tilePoint, zoom) { }
    v.map.addLayer(v.canvasTiles);

    $.getJSON('latest.json', function(code){
      window.initial = new Function('with (v.inputs) { ' + code.functions.initial + '\n } ' );
      window.instant = new Function('with (v.inputs) { ' + code.functions.instant + '\n } ' );

      initial();
      instant();
      window.onFrame = new Function('with (v.inputs) { ' + code.functions.paperjs + '\n } ' );

      v.map.locate();

      //window.throttledFetch = _.throttle(window.refetch, 1000);
      //v.map.on('moveend', window.throttledFetch);

      //v.map.on('zoomend', window.refetch);
      v.map.on('locationfound', onLocationFound);

      Categories.fetch( v.Venue.loadByScore );
    });  

    

    function onLocationFound(e) {
      var radius = e.accuracy / 2;
      // var marker = new L.Marker(e.latlng);

//      v.map.panTo( e.latlng );

      // v.map.addLayer(marker);
      //marker.bindPopup("You are within " + radius + " meters from this point").openPopup();

      var circle = new L.Circle(e.latlng, radius);
      v.map.addLayer(circle);

//      window.startScan( v.map )
    }


    // $('.reload button').click(function() {
    //   window.refetch();
    // });
  });

  


    // map.on('locationerror', onLocationError);

    // function onLocationError(e) {
    //   alert(e.message);
    // }
