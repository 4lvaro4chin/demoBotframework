const { ComponentDialog, WaterfallDialog, DialogSet, DialogTurnStatus} = require("botbuilder-dialogs");
const { ChoicePrompt, ChoiceFactory, ListStyle } = require("botbuilder-dialogs");
const { MenuInicialDialog } = require("./menuInicialDialog");

const MAIN_DIALOG = 'mainDialog';
const MENU_INICIAL_DIALOG = 'menuInicialDialog';
const WATERFALL_DIALOG = 'waterfallDialog';
const CHOICE_PROMPT = 'choicePrompt';

class MainDialog extends ComponentDialog {
    constructor(dialogId){
        super(dialogId);

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.continueStep.bind(this),
            this.finalStep.bind(this)
        ]))
            .addDialog(new MenuInicialDialog(MENU_INICIAL_DIALOG))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async initialStep(stepContext) {    
        return await stepContext.beginDialog(MENU_INICIAL_DIALOG);
    }

    async continueStep(stepContext){
        return await stepContext.prompt(CHOICE_PROMPT, {
            choices: ChoiceFactory.toChoices(['Si, ver menú.','No, gracias.']),
            prompt: '¿Necesitas que te ayude con algo más?.',
            style: ListStyle.heroCard
        });
    }

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
}

module.exports.MainDialog = MainDialog;
