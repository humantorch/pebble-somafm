var UI = require('ui');
var ajax = require('ajax');

var main = new UI.Card({
    title: 'somafm',
    body: 'Press select to choose a station.',
    scrollable: true
});

var stationsList = new UI.Menu({
    sections: [{
        title: 'Stations'
    }]
});

var currentStation = 'null';

main.show();

// ajax request magic

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
        url: 'http://somafm.prayingmadness.com/proxy.php?url=http%3A%2F%2Fapi.somafm.com%2Fsongs%2F'+station+'.json',
        type: 'json'
    },
    function(data) {
        main.body('title:\n  '+data.contents.songs[0].title+'\nartist:\n  '+data.contents.songs[0].artist+'\n[Shake to update]');
        main.show();
    },
    function(error) {
        console.log('error getting data');
        main.body('bah');
    });
}

// main.body("Press select to browse.\n\nLoading posts...");

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
    getSong(e.item.data);
});