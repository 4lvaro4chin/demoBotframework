const { ActivityHandler, CardFactory, TurnContext } = require('botbuilder');
const { Cards } = require('../cards/card');
const { HanaConnection } = require('../hana/hanaConnection')

const CONVERSATION_REFERENCE = 'CONVERSATION_REFERENCE';

class OmniaBot extends ActivityHandler {
    constructor(conversationState, userState, dialog, expireAfterSeconds) {
        super();

        this.conversationState = conversationState;
        this.userState = userState;
        this.mainDialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');
        this.lastAccessedTimeProperty = this.conversationState.createProperty('LastAccessedTime');
        this.expireAfterSeconds = expireAfterSeconds;
        this.conversationReference = this.conversationState.createProperty(CONVERSATION_REFERENCE);

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

                    // store the conversation reference for the newly added user
                    await this.storeConversationReference(context);
                    let hanaConnection = new HanaConnection();
                    await hanaConnection.saveRefenceInHana(context);                    
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

    async run(context) {
        // Retrieve the property value, and compare it to the current time.
        const now = new Date();
        const lastAccess = new Date(await this.lastAccessedTimeProperty.get(context, now.toISOString()));
        if (now !== lastAccess && ((now.getTime() - lastAccess.getTime()) / 1000) >= this.expireAfterSeconds) {
            // Notify the user that the conversation is being restarted.
            let userName = context.activity.from.name;
            let card = new Cards();
            await context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.reconexion(userName))]});
    
            // Clear state.
            await this.conversationState.clear(context);
        }
    
        await super.run(context);
    }

    async storeConversationReference(context) {
        // pull the reference
        const reference = TurnContext.getConversationReference(context.activity);
        // store reference in memory using conversation data property
        await this.conversationReference.set(context, reference);
    }
}

module.exports.OmniaBot = OmniaBot;
