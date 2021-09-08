const { ComponentDialog, WaterfallDialog, TextPrompt } = require("botbuilder-dialogs");
const {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         CardFactory } = require('botbuilder');
const { Cards } = require('../cards/card');

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class RegistroUserDialog extends ComponentDialog {
    constructor(dialogId) {
        super(dialogId);

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]))
            .addDialog(new TextPrompt(TEXT_PROMPT));

        this.initialDialogId = WATERFALL_DIALOG;
    }
    
    async initialStep(stepContext) {
        let card = new Cards();
        await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(await card.registrarUsuario())]});
    }
    
    async finalStep(stepContext) {
        const userData = stepContext.options;
        return await stepContext.endDialog();
    }
}

module.exports.RegistroUserDialog = RegistroUserDialog;