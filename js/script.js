/* script.js 
   Author:
   Date:
*/

// var map = L.map('map', {minZoom: 3}).setView([50.8513826,-118.2170459], 3);
// var pane = map.createPane('fixedbg', document.getElementById('map'));
// var pane = map.createPane('fixed', document.getElementById('map'));
// var pane = map.createPane('bgfixed', document.getElementById('map'));

// map.getPane('bgfixed').style.zIndex = 300;

// //background layer
// var imageUrl = 'img/Background.png',
// imageBounds = [[30, -112], [37, -125]];
// L.imageOverlay(imageUrl, imageBounds, {pane: 'bgfixed'}).addTo(map).setOpacity(1);


// //tile layer
// L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	subdomains: 'abcd',
// 	opacity: 0.25,
// 	pane: 'overlayPane',
// 	ext: 'png'
// }).addTo(map);


// var layer = L.leafletGeotiff("FloodDepthh_Composite.tif").addTo(map);


// https://dig.abclocal.go.com/kabc/flood-map/flood_cog.tif

$(document).ready(function(){ // begin document.ready block


	var map = L.map('map', {minZoom: 3}).setView([33.9864365,-118.1101426], 10);

  var pane = map.createPane('raster', document.getElementById('map'));



	//tile layer
	L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		opacity: 0.8,
		pane: 'overlayPane',
		maxZoom: 20
	}).addTo(map);

  //flood hazard layer
  L.esri.tiledMapLayer({
    url: "https://tiles.arcgis.com/tiles/zzN1kKcv4jyJtkCg/arcgis/rest/services/100yr_Composite_Flood_Hazard/MapServer",
    opacity: 0.8,
    pane: 'overlayPane',
  }).addTo(map);


$("#justexplore").click(function(){
  $(".overlay").fadeOut();
  $("#searchagain").fadeIn();
});

$("#searchagain").click(function(){
  $("#searchagain").fadeOut();
  $(".overlay").fadeIn();
});


$("#submit").on("click", function(){

  

  // map.removeLayer(filtered_zip)

  var zipval = $("#zip").val()

    zipvallength = zipval.length
    console.log(zipval)

    if (zipvallength<5) {

      $(".tryagaintext p").html("Please type a valid zip code.")

      $(".tryagain").fadeIn()

      $("#oktryagain").click(function(){
        $(".tryagain").fadeOut()
      });

    } else {

      $(".overlay").fadeOut();
      $("#searchagain").fadeIn();


        // zip layer
        $.getJSON("la-metro-zips-2.geojson",function(data){

          var items = data;

          items = data.features.filter(function(obj) {
            // return the filtered value
            return obj.properties.geoid === zipval;
          });

          var items_length = items.length
          // console.log(items_length);

          if (items_length == 0) {
            $(".tryagaintext p").html("Sorry, this zip code was not in the area studied. Try another zip code!")
            $(".tryagain").fadeIn()

            $("#oktryagain").click(function(){
              $(".tryagain").sfadeOut()
            });
          }



            var myStyle = {
              "fillColor": "rgba(0,0,0,0)",
              "color": "black",
              "weight": 3,
              "fillOpacity": 0.9
          };

            var filtered_zip = L.geoJson(items, {
                style: myStyle,
                // pane: "polygonsPane",
                opacity:1,
                className: "polygons"
            }).addTo(map)



            var svgs_in_overlay_pane = $(".leaflet-overlay-pane svg g path");

            svgs_in_overlay_pane_length = svgs_in_overlay_pane.length
            console.log(svgs_in_overlay_pane_length)

            if (svgs_in_overlay_pane_length > 1) {

              svgs_in_overlay_pane[0].remove()

              
            } else {
              
            }

            var bounds = filtered_zip.getBounds();
            var zoom = map.getBoundsZoom(bounds);
            var swPoint = map.project(bounds.getSouthWest(), zoom);
            var nePoint = map.project(bounds.getNorthEast(), zoom);
            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
            map.flyTo(center, (zoom-1));

          });


    }



});



    






// var data = [{"name":"Lenovo Thinkpad 41A4298","website":"google"},
// {"name":"Lenovo Thinkpad 41A2222","website":"google"},
// {"name":"Lenovo Thinkpad 41Awww33","website":"yahoo"},
// {"name":"Lenovo Thinkpad 41A424448","website":"google"},
// {"name":"Lenovo Thinkpad 41A429rr8","website":"ebay"},
// {"name":"Lenovo Thinkpad 41A429ff8","website":"ebay"},
// {"name":"Lenovo Thinkpad 41A429ss8","website":"rediff"},
// {"name":"Lenovo Thinkpad 41A429sg8","website":"yahoo"}]

// var data_filter = data.filter( element => element.website =="yahoo")
// console.log(data_filter)






	

}); //end document.ready block
