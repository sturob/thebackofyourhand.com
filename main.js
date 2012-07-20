
  window.onFrame = function(){ }; 


  window.v = { // has to match studio
    inputs: {
      highpass: 10,
      power: 0.41
    }
  };

  $(function() {

    var params = window.location.hash.substr(1).split('=');

    // if (params.length > 1) {
    //   var auth = params[1];
    //   $('.foursquareauth').hide();
    //   $('#map, #canvas').show();
    // } else {
    //   return;
    // }

    //paper.install( window );
    //paper.setup( $('canvas')[0] ); // Create

    // (function animloop() {
    //   requestAnimFrame( animloop );
    //   window.onFrame();
    //   paper.view.draw();
    // })();


    window.v.map = new L.Map('map', { trackResize: true });

    var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/65711/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = '©2012 OSM, CloudMade + foursquare',
        cloudmade = new L.TileLayer(cloudmadeUrl, { maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution });

    v.map.addLayer( cloudmade );
    v.cloudmade = cloudmade;

    v.map.setView(new L.LatLng( 51.52284331713511, -0.11260986328124999 ), 13).addLayer(cloudmade);
  
    $.getJSON('latest.json', function(code){
      window.initial = new Function('with (v.inputs) { ' + code.functions.initial + '\n } ' );
      window.instant = new Function('with (v.inputs) { ' + code.functions.instant + '\n } ' );

      initial();
      instant();
      //window.onFrame = new Function('with (v.inputs) { ' + code.functions.paperjs + '\n } ' );

      //v.map.on('moveend', window.throttledFetch);
      //v.map.on('zoomend', window.refetch);

      v.map.on('locationfound', onLocationFound);

      v.cloudmade.setOpacity(0);

      v.dataPoint = '/data/';
      Categories.fetch( v.Venue.loadByCategory );
    });  

    
    function onLocationFound(e) {
      var radius = e.accuracy / 2;
      
      var quad = v.QuadTree.get( e.latlng.getAllTiles()[10].join('/') )
      

      var goHere = function(){
        v.layergroup.clearLayers();
          
        var circle = new L.Circle(e.latlng, radius, { opacity: 1, color: '#fff', fillColor: '#0099ff'  });
        v.layergroup.addLayer( circle );
        v.map.panTo( e.latlng );

        _.delay(function(){
          if (ui.BrightSwitch.mode == 'a') ui.BrightSwitch.flick( 'b' );
        }, 1000);
      }

      if (_(quad.venues).size() == 0) {
        if (prompt('You are outside of central London, if you continue' +
                   ' there will be no venues for you to explore.')) {
          goHere();
        }
      } else {
        goHere();
      }
    }


    // $('.reload button').click(function() {
    //   window.refetch();
    // });
  });

  


    // map.on('locationerror', onLocationError);

    // function onLocationError(e) {
    //   alert(e.message);
    // }
