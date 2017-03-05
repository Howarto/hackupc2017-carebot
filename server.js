var restify = require('restify');
var builder = require('botbuilder');

var MICROSOFT_ID = '3f593c14-a4b3-4dc2-a883-5e46e2b7550b';
var MICROSOFT_PASS = 'ayphH3VcKA6FqOrXXG5bW8a';
var GOOGLEMAPS_ID = 'AIzaSyAFne0T1t3aYW8AtWoevIHMEO0EmsW851M'; // AIzaSyCdGma2YpPwV2v29z_sEglIqVyU7BvRqPU
var dummyImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg";
var googleMapsClient = require('@google/maps').createClient({
  key: GOOGLEMAPS_ID
});

var stepIndex = 0;


//=========================================================
// Bot&Server Setup
//=========================================================

// Create bot
var connector = new builder.ChatConnector({
    appId: MICROSOFT_ID,
    appPassword: MICROSOFT_PASS
	});

var bot = new builder.UniversalBot(connector);

// Reset after a version
bot.use(builder.Middleware.dialogVersion({version: 1.0, resetCommand: /^reset/i}));
// Global command
bot.endConversationAction('goodbye', 'Goodbye :)', {matches: /^goodbye/i});

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


intents.matchesAny(quemaduras_regex, '/quemaduras/showdegree');

bot.dialog('/quemaduras/showdegree', [
        function (session) {
        session.send("Don't worry. First of all choose the image that seems like your burn.");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout('carousel')   // Horizontal to swipe!
            .attachments([
                new builder.HeroCard(session)
                    .title("First degree burn")
                    .images([builder.CardImage.create(session, "http://i67.tinypic.com/j63ps0.jpg")])
                    .buttons([builder.CardAction.dialogAction(session, "firstorseconddegreeresponse", null, "THIS")]),

                new builder.HeroCard(session)
                    .title("Second degree burn")
                    .images([builder.CardImage.create(session, "http://i68.tinypic.com/34rjcqs.jpg")])
                    .buttons([builder.CardAction.dialogAction(session, "firstorseconddegreeresponse", null, "THIS")]),

                new builder.HeroCard(session)
                        .title("Second degree burn")
                        .images([builder.CardImage.create(session, "http://i65.tinypic.com/1zfk1v5.jpg")])
                        .buttons([builder.CardAction.dialogAction(session, "firstorseconddegreeresponse", null, "THIS")]),

                new builder.HeroCard(session)
                        .title("Thirst degree burn")
                        .images([builder.CardImage.create(session, "http://i63.tinypic.com/14jumwh.jpg")])
                        .buttons([builder.CardAction.dialogAction(session, "thirstdegreeresponse", null, "THIS")]),

        ]);
        session.send(msg);
    }
]);

var saludos = ['Hi, I\'m CareBot, your med assistant!', 'What can I do for you?', 'Hi!', 'Have you got a burn or sprain?',
                'I\'m CareBot! BALE!?', 'CareBot, the med hidden behind a program!'];
intents.onDefault(
    function(session) {
        var rand = Math.floor((Math.random()*10) + 1)%saludos.length;
        session.send(saludos[rand]);
    }
);

bot.dialog('/test', [
    function (session) {
        // Ask for dialog
        builder.Prompts.text(session, "What dialog do you want to test?");
    },
    function (session, results) {
        switch (results.response) {
            case "asistencia":
                session.beginDialog('/asistencia');
                break;
            case "tratarquemadura":
                session.beginDialog('/tratarQuemadura');
                break;
            case "quemadura":
                session.beginDialog('/quemadura');
                break;
            default:
                session.send("default");
                break;
        }
        session.endDialog();
    }
]);


var assistance_regex = [/assistance*/i, /aid*/i, /backing*/i, /service*/i, /support*/i, /help*/i,
						/hospital*/i, /clinic*/i, /medical*/i, /emergency/i, /death*/i];
/*
Dialog de asistencia
*/
intents.matchesAny(assistance_regex, '/assistance');

bot.dialog('/assistance', [
    function (session) {
        session.send("Please, go to the more near hospital.");
        getAssystanceAsync(function (hospitals) {
            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(getHospitalAttachments(session, hospitals));
            session.send(msg);
        });
    }
]);

function getAssystanceAsync(onAssistanceReady) {
    getHospitals(500, onAssistanceReady);

}
function buidImageUrlFromHospital(hospital) {
    if (hospital.photos != null && hospital.photos.length > 0) {
        return ("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="
        + hospital.photos[0].photo_reference + "&sensor=false&key=" + GOOGLEMAPS_ID);
    }
    else return dummyImage;

}

function getHospitalAttachments(session, hospitals) {
    var attachments = [];
    for (var i = 0; i < hospitals.length; ++i) {
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


/*
Dialog tratar quemadura
*/
bot.dialog('/tratarQuemadura', [
    function (session) {
        stepIndex = 0;
        session.beginDialog('/step');
    }
])

function getStepMessage(session, step) {
    return (new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.list)
                .attachments([
                    new builder.HeroCard(session)
                    .images([
                        builder.CardImage.create(session, step)
                    ])
                    .buttons([
                        builder.CardAction.dialogAction(session,"step",null,"Next Step")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
                ]));
}

var steps_first_grade = ["http://i67.tinypic.com/2drzbcy.jpg",
                         "http://i68.tinypic.com/33elers.jpg",
                         "http://i67.tinypic.com/33lmfk6.jpg"];

bot.dialog('/step', [
    function (session, args) {
        if (stepIndex < steps_first_grade.length) {
            session.send(getStepMessage(session, steps_first_grade[stepIndex]));
            stepIndex++;
        }
        else {
            session.endConversation("FINISH!\nIf you need something more... so call me maybe(8)!")
        }
        session.endDialog();
    }
]);

bot.dialog('/groupexclusions', [
    function (session, args) {

        session.send("Have you got any of these conditions?");
        var list = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Have you got more than 70 years or less than 10?"),

                new builder.HeroCard(session)
                    .title("Have you got a burn more bigger than your forearm?"),

                new builder.HeroCard(session)
                    .title("Have you got a burn on genitales or face?"),

                new builder.HeroCard(session)
                    .title("Seems that the burn is infectated?")

        ]);
        session.send(list);

        var buttons = new builder.Message(session)
                    .textFormat(builder.TextFormat.xml)
                    .attachmentLayout(builder.AttachmentLayout.list)
                    .attachments([
                        new builder.HeroCard(session)
                        .buttons([
                            builder.CardAction.dialogAction(session, "assistance", null, "YES"),
                            builder.CardAction.dialogAction(session, "step", null, "NO")
                        ])
                ]);
        session.send(buttons);
    }
]);

var sprain_regex = [
/twist*/i,
/sprain*/i,
/ligament*/i,
/curve*/i,
/bend*/i,
/knock*/i,
/swivel*/i,
/torsion*/i,
/twine*/i,
/warp*/i,
/distort*/i,
/wrench*/i,
/warp*/i,
/wring*/i,
/yank*/i,
/stretch*/i,
/torn*/i
];

var knock_regex = [
/hit*/i,
/slue*/i,
/bend*/i,
/enshroud*/i,
/hit*/i,
/coup*/i,
/beat*/i,
/knock*/i,
/bang*/i,
/kick*/i,
/slap*/i,
/smack*/i,
/swat*/i,
/swipe*/i,
/thump*/i,
/whack*/i,
];

bot.beginDialogAction('step','/step');
bot.beginDialogAction('firstorseconddegreeresponse','/groupexclusions');
bot.beginDialogAction('thirstdegreeresponse','/assistance');
bot.beginDialogAction('assistance','/assistance');
