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
