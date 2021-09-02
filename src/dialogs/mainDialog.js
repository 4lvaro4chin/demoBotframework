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
