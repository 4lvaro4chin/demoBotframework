# demoBotframework

## Paso 1:

Crear la aplicación NodeJs con el comando:

```
  npm init
```

```
package name: (demobotframework)
version: (1.0.0)
description: Demo Botframework para el uso de diálogos
entry point: (index.js)
test command:
git repository: (https://github.com/4lvaro4chin/demoBotframework.git)
keywords:
author: 4lvaro4chin
license: (ISC)
```

## Paso 2:

Instalar los módulos npm:

```
  "dependencies": {
    "axios": "^0.21.1",
    "base-64": "^1.0.0",
    "botbuilder": "^4.14.1",
    "botbuilder-dialogs": "^4.14.1",
    "dotenv": "^10.0.0",
    "node-fetch": "^2.6.1",
    "nodemon": "^2.0.12",
    "path": "^0.12.7",
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
                return await stepContext;
            case '2':
                console.log('Reinicio Usuario SAP');
                await stepContext.context.sendActivity(`Has seleccionado la opción 2.`);
                return await stepContext;
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

Crear el método **onDialog**:

```
this.onDialog(async (context, next) => {
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);

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

## Paso 7:

Modificar el archivo **menuInicialDialog**, crear el método **optionPromptValidator**.

```
async optionPromptValidator(promptContext) {
    return promptContext.recognized.succeeded && promptContext.recognized.value > 0 && promptContext.recognized.value < 2;
}
```

Modificar el método **constructor**, reemplazar los diálogos añadidos.

```
this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
    this.initialStep.bind(this),
    this.callOptionStep.bind(this),
    this.finalStep.bind(this)
]))
    .addDialog(new NumberPrompt(NUMBER_PROMPT, this.optionPromptValidator));
```

Reemplazar el método **initialStep**:

```
async initialStep(stepContext) {    
    const dialogData = stepContext.options;

    let userName = stepContext.context.activity.from.name;

    const promptText = `¿Cómo te puedo ayudar?
    \n**1.** Desbloqueo de usuario SAP
    \n**2.** Reinicio de contraseña SAP
    \n Ingresa el número.`;

    const retryPromptText = `Ingresar una opción válida.`

    return await stepContext.prompt(NUMBER_PROMPT, { prompt: promptText, retryPrompt:  retryPromptText });
}
```

## Paso 8:

Modificar archivo **bot.js**, reemplazar el código para el método **onMessage**.

```
this.onMessage(async (context, next) => {        
    const currentDialog = await this.dialogState.get(context);
    if (currentDialog === undefined) {
        let userName = context.activity.from.name;
        await context.sendActivity(`Hola **${userName}**, por favor selecciona una de las opciones disponibles:`);        

        //console.log('No dialogs started');
    } else if (currentDialog.dialogStack && currentDialog.dialogStack.length > 0) {
        //console.log('Dialog is running');
    } else {
        //console.log('Dialog is not running');
    }

    await (this.mainDialog).run(context, this.dialogState);
    
    // By calling next() you ensure that the next BotHandler is run.
    await next();
});
```

## Paso 9:

Modificar el archivo **mainDialog**, Agregar el paso **continueStep** para **WaterfallDialog** y agregar el diálogo ChoicePrompt.

```
this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
    this.initialStep.bind(this),
    this.continueStep.bind(this),
    this.finalStep.bind(this)
]))
    .addDialog(new MenuInicialDialog(MENU_INICIAL_DIALOG))
    .addDialog(new ChoicePrompt(CHOICE_PROMPT));
```

Crear la constante:

```
const CHOICE_PROMPT = 'choicePrompt';
```


Crear el método **continueStep**.

```
async continueStep(stepContext){
    return await stepContext.prompt(CHOICE_PROMPT, {
        choices: ChoiceFactory.toChoices(['Si, ver menú.','No, gracias.']),
        prompt: '¿Necesitas que te ayude con algo más?.',
        style: ListStyle.heroCard
    });
}
```

Agregar las librerías **ChoicePrompt**, **ChoiceFactory** y **ListStyle**.

Modificar el método **finalStep**, reemplazar el código por:

```
async finalStep(stepContext) {
    const menuData = stepContext.options;

    menuData.option = stepContext.result.value

    switch(menuData.option){
        case 'Si, ver menú.':
            console.log('Reiniciar Menú Inicial Dialog');
            break;
        case 'No, gracias.':
            let userName = stepContext.context.activity.from.name;
            await stepContext.context.sendActivity(`**${ userName }** ha sido un gusto poder ayudarte. Si necesitas algo más, no dudes en contactarme.`);
            break;
    }

    console.log('Fin Main Dialog');
    return await stepContext.endDialog();
}
```

Modíficar el método **run** , reemplazar el código por:

```
async run(context, dialogState) {
    var newDialog = true;

    const dialogSet = new DialogSet(dialogState);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(context);
    const results = await dialogContext.continueDialog();

    switch(context.activity.text){
        case 'Si, ver menú.':
            console.log('Intencion continuar Diálogo');
            newDialog = false;
            await dialogContext.cancelAllDialogs();
            await dialogContext.beginDialog(MAIN_DIALOG);
            break;
    }

    if (results.status === DialogTurnStatus.empty && newDialog === true) {
        console.log('Nuevo diálogo Main Dialog');
        await dialogContext.beginDialog(MAIN_DIALOG);
    }
}
```

## Paso 10:

Crear el archivo **.env** en la carpeta raiz del proyecto e ingresar el código:

```
OdataHostUrlOCS200 = 'http://omnias4hana01.omniasolution.com:8000/sap/opu/odata/sap/zosgw_user_management_srv'
OdataUser = 'AACCHIN'
OdataPassword = 'j3ML#BDzc4'
```

Modificar el archivo **index.js**, ingresar el código al inicio del archivo.

```
const path = require('path');
const dotenv = require('dotenv');
// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });
```

Crear la carpeta **odata** dentro de la carpeta **src**.

Crear el archivo **odataConnection.js** dentro de la carpeta **odata** e ingresar el código.

```
const axios = require('axios');

class OdataConnection {
    constructor() {

    }

    async getSystemSet() {
        let url;
        url = `${ process.env.OdataHostUrlDEV200 }/SystemSet`;

        const resultOdata = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            auth: {
              username: process.env.OdataUser,
              password: process.env.OdataPassword
            }
        }).then((response) => {
            return response.data.d;
        })
        .catch((error) => { 
            console.log(error);
            return error;
        });

        return resultOdata;
    }

    async resetPassword(SistMandt, Useralias) {
        let url;

        var jsonError = {
            'type' : 'E',
            'message' : 'El sistema y mandante seleccionados no están disponibles.'
        }

        switch(SistMandt){
            case 'OCS200':
                url = `${ process.env.OdataHostUrlDEV200 }/ResetPassword?SistMandt='${ SistMandt }'&Useralias='${ Useralias }'`;
                break;
            case 'OCS010':
                return jsonError;
        }

        const resultOdata = await axios.get(url, {
            auth: {
              username: process.env.OdataUser,
              password: process.env.OdataPassword
            }
        }).then((response) => { 
            var json = {
                'type' : response.data.d.Type,
                'id' : response.data.d.Id,
                'number' : response.data.d.Number,
                'message' : response.data.d.MsgTexto,
                'user' : response.data.d.MsgVar1,
                'system' : response.data.d.MsgVar2,
                'password' : response.data.d.MsgVar3,
            }
            return json;
        })
        .catch((error) => { 
            console.log(error);
            return error;
        });

        return resultOdata;
    }

    async unlockUser(SistMandt, Useralias) {
        let url;

        var jsonError = {
            'type' : 'E',
            'message' : 'El sistema y mandante seleccionados no están disponibles.'
        }

        switch(SistMandt){
            case 'OCS200':
                url = `${ process.env.OdataHostUrlDEV200 }/UnlockUser?SistMandt='${ SistMandt }'&Useralias='${ Useralias }'`;
                break;
            case 'OCS010':
                return jsonError;
            case 'PRD400':
                return jsonError;
        }

        const resultOdata = await axios.get(url, {
            auth: {
              username: process.env.OdataUser,
              password: process.env.OdataPassword
            }
        }).then((response) => { 
            var json = {
                'type' : response.data.d.Type,
                'id' : response.data.d.Id,
                'number' : response.data.d.Number,
                'message' : response.data.d.MsgTexto,
                'user' : response.data.d.MsgVar1,
                'system' : response.data.d.MsgVar2,
                'password' : response.data.d.MsgTexto
            }
            return json;
        })
        .catch((error) => { 
            console.log(error);
            return error;
        });

        return resultOdata;
    }
}

module.exports.OdataConnection = OdataConnection
```

Crear el archivo **reinicioSapDialog.js** en la carpeta **dialogs**.

```
const { ComponentDialog, ChoicePrompt, WaterfallDialog, ChoiceFactory, ListStyle } = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const { Cards } = require('../cards/card');
const { OdataConnection } = require('../odata/odataConnection');

const CHOICE_PROMPT = 'choicePrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class ReinicioSapDialog extends ComponentDialog {
    constructor(dialogId) {
        super(dialogId);

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.systemChoiceStep.bind(this),
                this.reinicioStep.bind(this)
            ])
        );
            
        this.initialDialogId = WATERFALL_DIALOG;
    }

    async systemChoiceStep(stepContext) {
        const systemData = stepContext.options;
 
        systemData.Useralias = 'aachin@omniasolution.com';

        let odataConnection = new OdataConnection();
        let odataResult = await odataConnection.getSystemSet();

        if(odataResult.results){
            var systemChoices = [];
            odataResult.results.forEach(function(result, index) {
                systemChoices.push(result.SistMandt);
            });

            systemChoices.push('Cancelar');

            return await stepContext.prompt(CHOICE_PROMPT, {
                choices: ChoiceFactory.toChoices(systemChoices),
                prompt: 'Seleccionar el sistema y mandante.',
                style: ListStyle.heroCard
            });
        }else{
            systemData.desbloqueo = false;

            var message = 'No se encontraron sistemas SAP disponibles.'
            let card = new Cards();
            await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.errorMessage(message))]});

            console.log('Fin Reinicio SAP Dialog');
            return await stepContext.endDialog();
        };     
/*
        var systemChoices = [];
        systemChoices.push('DEV200');
        systemChoices.push('DEV400');
        systemChoices.push('QAS400');
        systemChoices.push('PRD400');
        systemChoices.push('Cancelar');

        systemData.Useralias = 'aachin@omniasolution.com';

        return await stepContext.prompt(CHOICE_PROMPT, {
            choices: ChoiceFactory.toChoices(systemChoices),
            prompt: 'Seleccionar el sistema y mandante para el besbloqueo de usuario SAP.',
            style: ListStyle.heroCard
        });   
        */
    }

    async reinicioStep(stepContext){
        const systemData = stepContext.options;

        systemData.option = stepContext.result.value;

        switch(systemData.option) {
            case 'Cancelar': 
                return stepContext;
            default:

            let odataConnection = new OdataConnection();
            let odataResult = await odataConnection.resetPassword(systemData.option, systemData.Useralias);
            
            let card = new Cards();
            switch(odataResult.type){
                case 'S':
                    await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.reinicioSap(odataResult.user, odataResult.system, odataResult.password))]});
                    break;
                case 'E':
                    await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.reinicioSapError(odataResult.message))]});
                    break;
            }
            console.log('Fin Menú Desbloqueo SAP Dialog');
            return await stepContext.endDialog();
        }
    }
}

module.exports.ReinicioSapDialog = ReinicioSapDialog;
```

Modificar el archivo **card.js**, agregar los métodos **errorMessage**, **reinicioSap** y **reinicioSapError**.

```
async errorMessage(message){
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/586/PNG/512/robot-head-with-cardiogram_icon-icons.com_55279.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `¡Ooppps!.
                                    \n**${ message }**`,
                                    "size": "Default",
                                    "fontType": "Default",
                                    "height": "stretch",
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                } 
            ]
        };
        
        return json;
    }
```

```
async reinicioSap(user, system, password){
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
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
                                    "text": `Se ha reiniciado la contraseña del usuario **${ user }** en el sistema **${ system }**.
                                    \nLa nueva contraseña es:
                                    \n**${ password }**`,
                                    "size": "Default",
                                    "fontType": "Default",
                                    "height": "stretch",
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                } 
            ]
        };
        
        return json;
    }
```

```
async reinicioSapError(message){
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/586/PNG/512/robot-head-with-cardiogram_icon-icons.com_55279.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `Se ha identificado un error en SAP.
                                    \n**${ message }**`,
                                    "size": "Default",
                                    "fontType": "Default",
                                    "height": "stretch",
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                } 
            ]
        };
        
        return json;
    }
```

Modificar el archivo **menuInicialDialog.js**, agregar la librería al inicio del archivo.

```
const { ReinicioSapDialog } = require("./reinicioSapDialog");
```

Crear la constante **REINICIO_SAP_DIALOG**.

```
const REINICIO_SAP_DIALOG = 'reinicioSapDialog';
```

Agregar el llamado al diálogo **ReinicioSapDialog**.

```
ReinicioSapDialog(REINICIO_SAP_DIALOG)
```

Llamar al diálogo en el método **callOptionStep**.

```
return await stepContext.beginDialog(REINICIO_SAP_DIALOG);
```

## Paso 11:

Crear el archivo **desbloqueoSapDialog.js** en la carpeta **dialogs**.

```
const { ChoicePrompt, WaterfallDialog, ChoiceFactory, ListStyle } = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const { HelperDialog } = require("./helperDialog");
const { Cards } = require('../cards/card');
const { OdataConnection } = require('../odata/odataConnection');

const CHOICE_PROMPT = 'choicePrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class DesbloqueoSapDialog extends HelperDialog {
    constructor(dialogId) {
        super(dialogId);

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.systemChoiceStep.bind(this),
                this.desbloqueoStep.bind(this)
            ])
        );
            
        this.initialDialogId = WATERFALL_DIALOG;
    }

    async systemChoiceStep(stepContext) {
        const systemData = stepContext.options;

        systemData.Useralias = "aachin@omniasolution.com";

        let odataConnection = new OdataConnection();
        let odataResult = await odataConnection.getSystemSet();

        if(odataResult.results){
            var systemChoices = [];
            odataResult.results.forEach(function(result, index) {
                systemChoices.push(result.SistMandt);
            });

            systemChoices.push('Cancelar');

            return await stepContext.prompt(CHOICE_PROMPT, {
                choices: ChoiceFactory.toChoices(systemChoices),
                prompt: 'Seleccionar el sistema y mandante.',
                style: ListStyle.heroCard
            });
        }else{
            systemData.desbloqueo = false;

            var message = 'No se encontraron sistemas SAP disponibles.'
            let card = new Cards();
            await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.errorMessage(message))]});

            console.log('Fin Desbloqueo SAP Dialog');
            return await stepContext.endDialog();
        };     
/*
        var systemChoices = [];
        systemChoices.push('DEV200');
        systemChoices.push('DEV400');
        systemChoices.push('QAS400');
        systemChoices.push('PRD400');
        systemChoices.push('Cancelar');

        systemData.Useralias = 'aachin@omniasolution.com';

        return await stepContext.prompt(CHOICE_PROMPT, {
            choices: ChoiceFactory.toChoices(systemChoices),
            prompt: 'Seleccionar el sistema y mandante para el besbloqueo de usuario SAP.',
            style: ListStyle.heroCard
        });   
        */
    }

    async desbloqueoStep(stepContext){
        const systemData = stepContext.options;

        systemData.option = stepContext.result.value;

        switch(systemData.option) {
            case 'Cancelar': 
                return stepContext;
            default:               
                let odataConnection = new OdataConnection();
                let odataResult = await odataConnection.unlockUser(systemData.option, systemData.Useralias);
                
                let card = new Cards();
                switch(odataResult.type){
                    case 'S':
                        await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.desbloqueoSap(odataResult.user, odataResult.system))]});
                        break;
                    case 'E':
                        await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.desbloqueoSapError(odataResult.message))]});
                        break;
                }
                console.log('Fin Menú Desbloqueo SAP Dialog');
                return await stepContext.endDialog();

/*             let card = new Cards();
            await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.desbloqueoSap('AACHIN', systemData.option))]});
            
            console.log('Fin Desbloqueo Usuario SAP');
            return await stepContext.endDialog(); */
        }
    }
}

module.exports.DesbloqueoSapDialog = DesbloqueoSapDialog;
```

Modificar el archivo **menuInicialDialog.js** agregar la llamada a la librería:

```
const { DesbloqueoSapDialog } = require("./desbloqueoSapDialog");
```

Crear la constante **DESBLOQUEO_SAP_DIALOG**.

```
const DESBLOQUEO_SAP_DIALOG = 'desbloqueoSapDialog';
```

Agregar la llamada al díalogo.

```
.addDialog(new DesbloqueoSapDialog(DESBLOQUEO_SAP_DIALOG))
```

Agregar el llamado al diálogo en el método **callOptionStep**.

```
return await stepContext.beginDialog(DESBLOQUEO_SAP_DIALOG);
```
