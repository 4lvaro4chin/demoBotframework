const { ComponentDialog, WaterfallDialog, TextPrompt } = require("botbuilder-dialogs");
const {CardFactory } = require('botbuilder');
const { OdataConnection } = require('../odata/odataConnection');
const { Cards } = require('../cards/card');

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class RegistroUsuarioFormDialog extends ComponentDialog {
    constructor(dialogId) {
        super(dialogId);

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]))
            .addDialog(new TextPrompt(TEXT_PROMPT, this.promptValidator));

        this.initialDialogId = WATERFALL_DIALOG;
    }
    
    async initialStep(stepContext) {
        let card = new Cards();
        await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.registrarUsuario())]});

        const promptText = 'Esperando que ingrese los datos.';
        return await stepContext.prompt(TEXT_PROMPT, { prompt: promptText });
    }
    
    async finalStep(stepContext) {
        const userData = stepContext.options;

        // get adaptive card input value
        console.log(stepContext.context.activity.value);

        switch(stepContext.context.activity.value.id) {
            case 'actionSave':
                userData.uname = stepContext.context.activity.value.uname;
                userData.firstName = stepContext.context.activity.value.firstName;
                userData.lastName = stepContext.context.activity.value.lastName;
                userData.celphone = stepContext.context.activity.value.celphone;
                userData.email = stepContext.context.activity.value.email;
                userData.dateBirth = stepContext.context.activity.value.dateBirth;
                userData.dateBirthJSON = new Date(stepContext.context.activity.value.dateBirth).valueOf();
                
                let odataConnection = new OdataConnection();
                let odataResult = await odataConnection.createUser(userData);

                switch(odataResult.type){
                    case 'S':
                        const message = `Se creó el usuario con los datos:
                        \n**User ID:** ${ userData.uname }
                        \n**Nombres:** ${ userData.firstName }
                        \n**Apellidos:** ${ userData.lastName }
                        \n**Celular:** ${ userData.celphone }
                        \n**Email:** ${ userData.email }
                        \n**Fecha de nacimiento:** ${ userData.dateBirth }
                        \n**Fecha JSON:** ${ userData.dateBirthJSON }`;
                        await stepContext.context.sendActivity(message);
                        break;
                    case 'E':         
                        let card = new Cards();
                        await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.errorMessage(odataResult.message))]});
                        break;
                }
        }

        return await stepContext.endDialog();
    }

    async promptValidator(promptContext){
        const activity = promptContext.context._activity;
        return activity.type === 'message' && activity.channelData.postBack;
    }
}

module.exports.RegistroUsuarioFormDialog = RegistroUsuarioFormDialog;