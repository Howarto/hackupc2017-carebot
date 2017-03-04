var restify = require('restify');
var builder = require('botbuilder');


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
server.post('/api/messages', connector.listen());

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


var quemaduras_regex = [/burn*/i, /blaze*/i, /char*/i, /heat*/i, /ignite*/i, /incinerate*/i, /light*/i,
						/melt*/i, /scorch*/i, /smolder*/i, /torch*/i, /bake*/i, /brand*/i, /broil*/i,
						/calcine*/i, /cauterize*/i, /combust*/i, /conflagrate*/i, /cremate*/i, /flare*/i,
						/toast*/i, /be ablaze/i, /reduces to ashes/i];


var intents = new builder.IntentDialog();
bot.dialog('/', intents);
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


