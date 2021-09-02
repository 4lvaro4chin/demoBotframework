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
