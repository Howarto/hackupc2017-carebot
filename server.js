var restify = require('restify');
var builder = require('botbuilder');

var googleMapsKey = 'AIzaSyAFne0T1t3aYW8AtWoevIHMEO0EmsW851M';
var dummyImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg";
var googleMapsClient = require('@google/maps').createClient({
  key: googleMapsKey
});


//=========================================================
// Bot&Server Setup
//=========================================================

// Create bot
var connector = new builder.ChatConnector({
    appId: '3f593c14-a4b3-4dc2-a883-5e46e2b7550b',
    appPassword: 'ayphH3VcKA6FqOrXXG5bW8a'
	});

var bot = new builder.UniversalBot(connector);

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
var location = null;
server.post('/api/messages', [
    function create(req, res, next) {
        //location = geoip.lookup(req.connection.remoteAddress);
        //console.log(req.connection.remoteAddress)
        return next();
 },
connector.listen()]);

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});


//=========================================================
// Bots Dialogs
//=========================================================

var intents = new builder.IntentDialog();
bot.dialog('/', intents);



var quemaduras_regex = [/burn*/i, /blaze*/i, /char*/i, /heat*/i, /ignite*/i, /incinerate*/i, /light*/i,
						/melt*/i, /scorch*/i, /smolder*/i, /torch*/i, /bake*/i, /brand*/i, /broil*/i,
						/calcine*/i, /cauterize*/i, /combust*/i, /conflagrate*/i, /cremate*/i, /flare*/i,
						/toast*/i, /be ablaze/i, /reduces to ashes/i];


intents.matchesAny(quemaduras_regex, [
    function (session) {
        session.send("Good. First of all choose the image that seems like your burn.");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout('carousel')   // Horizontal to swipe!
            .attachments([
                new builder.HeroCard(session)
                    .title("First degree burn")
                    .images([builder.CardImage.create(session, "http://i67.tinypic.com/j63ps0.jpg")])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle")),

                new builder.HeroCard(session)
                    .title("Second degree burn")
                    .images([builder.CardImage.create(session, "http://i68.tinypic.com/34rjcqs.jpg")])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle")),

            new builder.HeroCard(session)
                    .title("Second degree burn")
                    .images([builder.CardImage.create(session, "http://i65.tinypic.com/1zfk1v5.jpg")])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle")),

            new builder.HeroCard(session)
                    .title("Thirst degree burn")
                    .images([builder.CardImage.create(session, "http://i63.tinypic.com/14jumwh.jpg")])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))

        ]);
        session.send(msg);
        session.endDialog();
    }
]);

/*
Dialog tratar quemadura
*/

function getStepsAttachments() {}
bot.dialog('/tratarQuemadura', [
    function (session) {

    }
])

/*
Dialog de presentación
*/
bot.dialog('/presentacion', [
    function (session) {
        session.send('Hi! I\'m CareBot and I\'m ready to help you!');
        session.beginDialog('/asistencia');
        session.endDialog();
    }
])



var assistance_regex = [/assistance*/i, /aid*/i, /backing*/i, /service*/i, /support*/i, /help*/i,
						/hospital*/i, /clinic*/i, /medical*/i, /emergency/i, /death*/i];
/*
Dialog de asistencia
*/
intents.matchesAny(assistance_regex, [
    function (session) {
        getAssystanceAsync(function (hospitals) {
            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(getHospitalAttachments(session, hospitals));
            session.send(msg);
            session.endDialog();
        });
    }
]);

function getAssystanceAsync(onAssistanceReady) {
    getHospitals(500, onAssistanceReady);

}
function buidImageUrlFromHospital(hospital) {
    if (hospital.photos != undefined && hospital.photos.length > 0) {
        return ("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="
        + hospital.photos[0].photo_reference + "&sensor=false&key=" + googleMapsKey);
    }
    else return dummyImage;

}

function getHospitalAttachments(session, hospitals) {
    var attachments = [];
    for (var i = 0; i < hospitals.length; ++i) {
        console.log("kek" + " " +hospitals[i].name)
        attachments[i] = (new builder.HeroCard(session)
                    .title(hospitals[i].name)
                    .subtitle(hospitals[i].name)
                    .text(hospitals[i].formatted_address)
                    .images([
                        builder.CardImage.create(session, buidImageUrlFromHospital(hospitals[i]))
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle")))
    }
    return attachments;
}
/*
Gets the nearest hospitals near your location given a radious
*/
function getHospitals(radious, onAssistanceReady) {
    googleMapsClient.places({
      query: 'hospital',
      //very hardcoded due to localhost (ip based)
      location: [41.389291, 2.113506],
      radius: radious,
      opennow: true,
    }, function(err, response) {
        if (!err) {
            var hospitals = response.json.results;
            onAssistanceReady(hospitals);
        }
        else {
            console.log(err);
        }
    });
}
