const { ActivityHandler, CardFactory } = require('botbuilder');
const { Cards } = require('../cards/card');

class OmniaBot extends ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();

        this.conversationState = conversationState;
        this.userState = userState;
        this.mainDialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');


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

        this.onDialog(async (context, next) => {
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            await next();
        });  
    }
}

module.exports.OmniaBot = OmniaBot;
