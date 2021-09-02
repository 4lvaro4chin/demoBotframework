# demoBotframework

## Paso 1:

Crear la aplicación NodeJs con el comando:

```
  npm init
```

## Paso 2:

Instalar los módulos npm:

```
  "dependencies": {
    "axios": "^0.21.1",
    "base-64": "^1.0.0",
    "botbuilder": "^4.14.1",
    "botbuilder-dialogs": "^4.14.1",
    "node-fetch": "^2.6.1",
    "nodemon": "^2.0.12",
    "restify": "^8.5.1",
    "url": "^0.11.0"
  }
```

Modificar archivo **package.json**. Sustituir la sección scripts.

```
"scripts": {
  "start": "node ./index.js",
  "watch": "nodemon ./index.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```
    
## Paso 3:

Crear carpeta **src** en la raiz del proyecto.

Crear carpeta **bots** dentro de la carpeta **src**.

Crear archivo **bot.js** dentro de la carpeta **bots** y agregar el siguiente código.

```
const { ActivityHandler, MessageFactory } = require('botbuilder');

class OmniaBot extends ActivityHandler {
    constructor(){
        super();

        this.onMessage(async (context, next) => {
            let userName = context.activity.from.name;
            await context.sendActivity(MessageFactory.text(`Hola **${userName}**, has ingresado el texto: **${ context.activity.text }** `));        
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });    

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hola y bienvenido!!!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });        
    }
}

module.exports.OmniaBot = OmniaBot;
```

## Paso 4:

Crear el archivo **index.js** en la carpeta raiz del proyecto y agregar el siguiente código.

```
const restify = require('restify')
const { BotFrameworkAdapter } = require('botbuilder');

// Import required bot configuration.
// This bot's main dialog.
const { OmniaBot } = require('./src/bots/bot');

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Create the main dialog.
const omniaBot = new OmniaBot();

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await omniaBot.run(context);
    });
});

// Listen for Upgrade requests for Streaming.
server.on('upgrade', (req, socket, head) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new BotFrameworkAdapter({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword
    });
    // Set onTurnError for the BotFrameworkAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;

    streamingAdapter.useWebSocket(req, socket, head, async (context) => {
        // After connecting via WebSocket, run this logic for every request sent over
        // the WebSocket connection.
        await myBot.run(context);
    });
});
```

## Paso 5:

Crear la carpeta **cards** dentro de la carpeta **src**.

Crear el archivo **card.js** dentro de la carpeta **cards**.

Agregar el código en el archivo **card.js**.

```
class Cards {
    constructor() {

    }

    async welcome(userName) {
        const json = {
            "type": "AdaptiveCard",
            "body": [
                {
                    "type": "Image",
                    "url": "https://omniasolution.com/wp-content/uploads/2021/06/Group-158@2x.png"
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/1724/PNG/512/4023883-bot-head-robot-robotics_112865.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "weight": "Bolder",
                                    "text": `¡Bienvenido ${ userName }!`,
                                    "wrap": true,
                                    "size": "ExtraLarge"
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": `Soy tu asistente virtual y estoy disponible para ayudarte en el momento que lo necesites.`,
                    "wrap": true
                }
            ],
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3"
        };       
        
        return json; 
    }    
}

module.exports.Cards = Cards;
```

Modificar el archivo **bot.js**.

Agregar el código al inicio del archivo.

```
const { Cards } = require('../cards/card');
```

Agregar la librería **CardFactory** al inicio del archivo.

```
const { ActivityHandler, CardFactory } = require('botbuilder');
```

Modificar el método **this.onMembersAdded**, reemplazar por.

```
this.onMembersAdded(async (context, next) => {
    const membersAdded = context.activity.membersAdded;

    for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
        if (membersAdded[cnt].id !== context.activity.recipient.id) {
            let userName = membersAdded[cnt].name;
            let card = new Cards();
            await context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.welcome(userName))]});
        }
    }
    // By calling next() you ensure that the next BotHandler is run.
    await next();
});
```

Para diseñar una tarjeta adaptativa visitar la web https://adaptivecards.io/designer/.

## Paso 6:

Crear la carpeta **dialogs** dentro de la carpeta **src**.

Crear el archivo **menuInicialDialog.js** dentro de la carpeta **dialogs**. Agregar el código en el archivo.

```
const { ComponentDialog, NumberPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const NUMBER_PROMPT = 'numberPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class MenuInicialDialog extends ComponentDialog{
    constructor(dialogId){
        super(dialogId);

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.callOptionStep.bind(this),
            this.finalStep.bind(this)
        ]))
            .addDialog(new NumberPrompt(NUMBER_PROMPT));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async initialStep(stepContext) {    
        const dialogData = stepContext.options;

        const promptText = `¿Cómo te puedo ayudar?
        \n**1.** Desbloqueo de usuario SAP
        \n**2.** Reinicio de contraseña SAP
        \n Ingresa el número.`;

        return await stepContext.prompt(NUMBER_PROMPT, { prompt: promptText });
    }

    async callOptionStep(stepContext) {
        const dialogData = stepContext.options;

        dialogData.option = stepContext.result;

        switch(dialogData.option.toString()) {
            case '1':
                console.log('Desbloqueo Usuario SAP');
                await stepContext.context.sendActivity(`Has seleccionado la opción 1.`);
            case '2':
                console.log('Reinicio Usuario SAP');
                await stepContext.context.sendActivity(`Has seleccionado la opción 2.`);
            default:
                return await stepContext.endDialog();
        }
    }

    async finalStep(stepContext) {
        console.log('Fin Menu Inicial Dialog');
        return await stepContext.endDialog();
    }
}

module.exports.MenuInicialDialog = MenuInicialDialog;
```

Crear el archivo **mainDialog.js** dentro de la carpeta **dialogs**. Agregar el código en el archivo.

```
const { ComponentDialog, WaterfallDialog, DialogSet, DialogTurnStatus } = require("botbuilder-dialogs");
const { MenuInicialDialog } = require("./menuInicialDialog");

const MAIN_DIALOG = 'mainDialog';
const MENU_INICIAL_DIALOG = 'menuInicialDialog';
const WATERFALL_DIALOG = 'waterfallDialog';

class MainDialog extends ComponentDialog {
    constructor(dialogId){
        super(dialogId);

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]))
            .addDialog(new MenuInicialDialog(MENU_INICIAL_DIALOG));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async initialStep(stepContext) {    
        return await stepContext.beginDialog(MENU_INICIAL_DIALOG);
    }

    async finalStep(stepContext) {
        console.log('Fin Main Dialog');
        return await stepContext.endDialog();
    }

    async run(context, dialogState) {
        var newDialog = true;

        const dialogSet = new DialogSet(dialogState);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();

        if (results.status === DialogTurnStatus.empty && newDialog === true) {
            console.log('Nuevo diálogo Main Dialog');
            await dialogContext.beginDialog(MAIN_DIALOG);
        }
    }
}

module.exports.MainDialog = MainDialog;
```

Modificar el archivo **bot.js**.

Agregar los parámetros al método **constructor**.

```
constructor(conversationState, userState, dialog) {
```

Iniciarlizar variables:

```
this.conversationState = conversationState;
this.userState = userState;
this.mainDialog = dialog;
this.dialogState = this.conversationState.createProperty('DialogState');
```

Modifciar el método **onMessage**:

```
this.onMessage(async (context, next) => {
    await (this.mainDialog).run(context, this.dialogState);

    // By calling next() you ensure that the next BotHandler is run.
    await next();
});   
```

Modificar el archivo **index.js**.

Agregar librerias.

```
const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require('botbuilder');

const { MainDialog  } = require('./src/dialogs/mainDialog');
```

Crear variables después de la definición del método **onTurnError**:

```
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);
```

Crear la variable **dialog** y modificar la creación de la variable **omniaBot**.

```
const dialog = new MainDialog('mainDialog');
const omniaBot = new OmniaBot(conversationState, userState, dialog);
```
