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

var quemaduras_regex = [/burn.*/i, /blaze.*/i, /char.*/i, /heat.*/i, /ignite.*/i, /incinerate.*/i, /light.*/i,
						/melt.*/i, /scorch.*/i, /smolder.*/i, /torch.*/i, /bake.*/i, /brand.*/i, /broil.*/i,
						/calcine.*/i, /cauterize.*/i, /combust.*/i, /conflagrate.*/i, /cremate.*/i, /flare.*/i,
						/toast.*/i, /be ablaze/i, /reduces to ashes/i];


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


var wound_regex = [/cut.*/i, /lacerat.*/i, /abras.*/i, /scrape.*/i, /graze.*/i, /wound.*/i, /dissect.*/i, /fissure.*/i, /scratch.*/i,
       /touch.*/i, /rub.*/i, /mortise.*/i, /saw.*/i, /slash.*/i, /sabe.*/i, /incise.*/i];

var sprain_regex = [/twist.*/i, /sprain.*/i, /ligament.*/i, /curve.*/i, /bend.*/i, /swivel.*/i, /torsion.*/i, /twine.*/i,
/warp.*/i, /distort.*/i, /wrench.*/i, /wring.*/i, /yank.*/i, /stretch.*/i, /torn.*/i];

var knock_regex = [/slue.*/i, /enshroud.*/i, /hit.*/i, /coup.*/i, /beat.*/i, /knock.*/i, /bang.*/i, /kick.*/i, /slap.*/i,
/smack.*/i, /swat.*/i, /swipe.*/i, /thump.*/i, /whack.*/i];

// intents.matchesAny(sprain_regex.concat(knock_regex.concat(wound_regex)), '/lesion/showtypes');

// bot.dialog("/lesion/showtypes", [
//     function (session) {
//         session.send("Don't worry. First of all choose the image that seems like your lesion.");
//         var msg = new builder.Message(session)
//             .textFormat(builder.TextFormat.xml)
//             .attachmentLayout('carousel')   // Horizontal to swipe!
//             .attachments([
//                 new builder.HeroCard(session)
//                     .title("Wound")
//                     .images([builder.CardImage.create(session, "http://i67.tinypic.com/35kpvnq.jpg")])
//                     .buttons([builder.CardAction.dialogAction(session, "heridaresponse", null, "THIS")]),

//                 new builder.HeroCard(session)
//                     .title("Twist like")
//                     .images([builder.CardImage.create(session, "http://i68.tinypic.com/insgts.jpg")])
//                     .buttons([builder.CardAction.dialogAction(session, "torceduraresponse", null, "THIS")]),

//                 new builder.HeroCard(session)
//                     .title("hit like")
//                     .images([builder.CardImage.create(session, "http://i65.tinypic.com/16htapw.jpg")])
//                     .buttons([builder.CardAction.dialogAction(session, "moradoresponse", null, "THIS")]),

//             ]);
//         session.send(msg);
//     }

// ])


intents.matchesAny(wound_regex, '/herida');
intents.matchesAny(sprain_regex, '/torcedura');
intents.matchesAny(knock_regex, '/morado');


var firstPresentation = true;
var saludos = ['Hi! I\'m Carebot. You must know that you can reset me saying \'goodbye\'', 'Hi, I\'m CareBot, your med assistant!',
               'What can I do for you?', 'Hi!', 'Have you got a burn or sprain?', 'I\'m CareBot! BALE!?', 'CareBot, the med hidden behind a program!'];
intents.onDefault(
    function(session) {
        if (firstPresentation) {
            firstPresentation = false;
            session.send("Hi, I'm CareBot, the basic med bot. Thanks for chatting with me! I'm here to help with things like burns, twists, cuts, sprains, bruises... You can also ask for help to get a list of the most near hospitals. Let's get started!");
        }
        else {
            var rand = Math.floor((Math.random()*10) + 1)%saludos.length;
            session.send(saludos[rand]);
        }
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


var assistance_regex = [/assistance.*/i, /aid.*/i, /backing.*/i, /service.*/i, /support.*/i, /help.*/i,
						/hospital.*/i, /clinic.*/i, /medical.*/i, /emergency/i, /death.*/i];
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
            session.endConversation();
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
                    ]))
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

bot.dialog('/herida',[
    function(session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout('carousel')   // Horizontal to swipe!
            .attachments([
                new builder.HeroCard(session)
                    .title("Abrasion")
                    .images([builder.CardImage.create(session, "http://i68.tinypic.com/2lvza6t.jpg")])
                    .buttons([builder.CardAction.dialogAction(session, "lowwound", null, "THIS")]),
                
                new builder.HeroCard(session)
                    .title("Hemorrhage")
                    .images([builder.CardImage.create(session, "http://i67.tinypic.com/2unultx.png")])
                    .buttons([builder.CardAction.dialogAction(session, "assistance", null, "THIS")]),

                new builder.HeroCard(session)
                    .title("Object stuck")
                    .images([builder.CardImage.create(session, "http://i67.tinypic.com/2vmvmgk.jpg")])
                    .buttons([builder.CardAction.dialogAction(session, "assistance", null, "THIS")]),

                new builder.HeroCard(session)
                    .title("Infected")
                    .images([builder.CardImage.create(session, "http://i65.tinypic.com/vnmuix.jpg")])
                    .buttons([builder.CardAction.dialogAction(session, "assistance", null, "THIS")])
        ]);
        session.send(msg);
    }
]);

var step_counter_bruises = 0;
var steps_for_bruises = ['http://i68.tinypic.com/261p2yf.jpg', 'http://i65.tinypic.com/263hus6.jpg',
                        'http://i66.tinypic.com/e15ev8.jpg', 'http://i68.tinypic.com/124fnt0.jpg'];
bot.dialog('/stepforbruises',[
    function(session, args) {
        step_counter_bruises = 0;
        session.beginDialog('/bruisesstep');
    }
]);

bot.dialog('/bruisesstep',[
    function (session, args) {
        if (step_counter_bruises < steps_for_bruises.length) {
            session.send(new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.list)
                .attachments([
                    new builder.HeroCard(session)
                    .images([
                        builder.CardImage.create(session, steps_for_bruises[step_counter_bruises])
                    ])
                    .buttons([
                        builder.CardAction.dialogAction(session, "stepforbruisesrepetition", null, "Next step"),
                    ])
                ]));
            step_counter_bruises++;
        }
        else {
            session.endConversation("FINISH!\nIf you need something more... so call me maybe(8)!")
        }
    }
]);


bot.dialog('/morado',[
    function(session) {
        session.send("Your hematoma is like...?");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout('carousel')   // Horizontal to swipe!
            .attachments([
                new builder.HeroCard(session)
                    .title("Low")
                    .images([builder.CardImage.create(session, "http://i65.tinypic.com/16htapw.jpg")])
                    .buttons([builder.CardAction.dialogAction(session, "lowhematomaresponse", null, "THIS")]),

                new builder.HeroCard(session)
                    .title("Hight")
                    .images([builder.CardImage.create(session, "http://i64.tinypic.com/jhwxvn.jpg")])
                    .buttons([builder.CardAction.dialogAction(session, "assistance", null, "THIS")])
        ]);
        session.send(msg);
    }
]);


bot.dialog('/torcedura',[
    function(session) {
        session.send("Your twist is like...?");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout('carousel')   // Horizontal to swipe!
            .attachments([
                new builder.HeroCard(session)
                    .title("Low")
                    .images([builder.CardImage.create(session, "http://i67.tinypic.com/2mgrpqw.jpg")])
                    .buttons([builder.CardAction.dialogAction(session, "lowtwistresponse", null, "THIS")]),

                new builder.HeroCard(session)
                    .title("Hight")
                    .images([builder.CardImage.create(session, "http://i68.tinypic.com/insgts.jpg")])
                    .buttons([builder.CardAction.dialogAction(session, "assistance", null, "THIS")])
        ]);
        session.send(msg);
    }
]);

var step_counter_twist = 0;
var steps_for_twist = ['http://i68.tinypic.com/261p2yf.jpg', 'http://i65.tinypic.com/263hus6.jpg',
                        'http://i66.tinypic.com/e15ev8.jpg', 'http://i68.tinypic.com/124fnt0.jpg',
                        'http://i67.tinypic.com/2w7ojo2.jpg'];
bot.dialog('/stepfortwist',[
    function(session, args) {
        step_counter_twist = 0;
        session.beginDialog('/twiststep');
    }
]);

bot.dialog('/twiststep',[
    function (session, args) {
        if (step_counter_twist < steps_for_twist.length) {
            session.send(new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.list)
                .attachments([
                    new builder.HeroCard(session)
                    .images([
                        builder.CardImage.create(session, steps_for_twist[step_counter_twist])
                    ])
                    .buttons([
                        builder.CardAction.dialogAction(session, "stepfortwistrepetition", null, "Next step"),
                    ])
                ]));
            step_counter_twist++;
        }
        else {
            session.endConversation("FINISH!\nAnd remember that you can ask me about the near hospitals!")
        }
    }
]);

var step_counter_wound = 0;
var steps_for_wound = ['http://i66.tinypic.com/2w7lsad.jpg', 'http://i65.tinypic.com/vo1nqw.jpg','http://i64.tinypic.com/s49auq.png',
                       'http://i65.tinypic.com/10571g8.jpg'];
bot.dialog('/stepforwound',[
    function(session, args) {
        step_counter_wound = 0;
        session.beginDialog('/woundstep');
    }
]);

bot.dialog('/woundstep',[
    function (session, args) {
        if (step_counter_wound < steps_for_wound.length) {
            session.send(new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachmentLayout(builder.AttachmentLayout.list)
                .attachments([
                    new builder.HeroCard(session)
                    .images([
                        builder.CardImage.create(session, steps_for_wound[step_counter_wound])
                    ])
                    .buttons([
                        builder.CardAction.dialogAction(session, "stepforwoundrepetition", null, "Next step"),
                    ])
                ]));
            step_counter_wound++;
        }
        else {
            session.endConversation("FINISH!\n Sana sana culito de rana, si no se cura hoy se curará mañana!")
        }
    }
]);

bot.beginDialogAction('step','/step');
//bot.beginDialogAction('stepforbruises','/stepforbruises');
bot.beginDialogAction('stepforbruisesrepetition','/bruisesstep');
bot.beginDialogAction('stepfortwistrepetition','/twiststep');
bot.beginDialogAction('stepforwoundrepetition','/woundstep');
bot.beginDialogAction('firstorseconddegreeresponse','/groupexclusions');
bot.beginDialogAction('thirstdegreeresponse','/assistance');
bot.beginDialogAction('assistance','/assistance');


//bot.beginDialogAction('heridaresponse','/herida');
//bot.beginDialogAction('torceduraresponse','/torcedura');
//bot.beginDialogAction('moradoresponse','/morado');
bot.beginDialogAction('lowhematomaresponse','/stepforbruises');
bot.beginDialogAction('lowtwistresponse','/stepfortwist');
bot.beginDialogAction('lowwound','/stepforwound');


bot.beginDialogAction('hemorragiaresponse','/hemorragia_continua');
bot.beginDialogAction('objetoincrustadoresponse','/assistance');
