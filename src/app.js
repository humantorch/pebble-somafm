/**
 * @author kosman.scott@gmail.com
 */

// require modules
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');


// app setup and display
var main = new UI.Card({
    body: 'Press select to choose a station.',
    scrollable: true,
    style: 'small'
});

var stationsList = new UI.Menu({
    sections: [{
        title: 'Stations'
    }]
});

var currentStation = 'null';


// bam!
main.show();


// ajax functionality

function getStations() {
    ajax({
        url: 'http://api.somascrobbler.com/api/v1/stations',
        type: 'json'
    },
    function(stationData) {
        console.log(stationData);
        var stations = Object.keys(stationData),
        itemslen = stations.length;
        for (var x = 0; x < itemslen; x++) {
            stationsList.item(0,x,{'title': stationData[stations[x]].title, 'data': stationData[stations[x]].id});
        }
        stationsList.show();
    });
}

function getSong(station) {
    currentStation = station;
    ajax({
        url: 'http://api.somascrobbler.com/api/v1/nowplaying/'+station,
        type: 'json'
    },
    function(data) {
        main.body('[track]\n  '+data.title+'\n[artist]\n  '+data.artist+'\n\n[Shake to update]');
        main.show();
    },
    function(error) {
        console.log('error getting data');
        main.body('Sorry, we\'re having trouble getting data for that station. Try another?');
        main.show();
    });
}


// Event handlers

main.on('click','select',function(e) {
    getStations();
});

main.on('accelTap', function(e){
    if (currentStation !== 'null' || !!currentStation) {
        main.body('Updating...!');
        getSong(currentStation);
    }
});

stationsList.on('select', function(e) {
    main.title(e.item.title);
    getSong(e.item.data);
});