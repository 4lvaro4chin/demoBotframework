const { ComponentDialog, NumberPrompt, WaterfallDialog } = require("botbuilder-dialogs");
const { ReinicioSapDialog } = require("./reinicioSapDialog");
const { DesbloqueoSapDialog } = require("./desbloqueoSapDialog");
const { RegistroUsuarioDialog } = require("./registroUsuarioDialog");
const { RegistroUserDialog } = require("./registroUserDialog");

const NUMBER_PROMPT = 'numberPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const REINICIO_SAP_DIALOG = 'reinicioSapDialog';
const REGISTRO_USUARIO_DIALOG = 'registroUsuarioDialog';
const REGISTRO_USER_DIALOG = 'registroUserDialog';
const DESBLOQUEO_SAP_DIALOG = 'desbloqueoSapDialog';

class MenuInicialDialog extends ComponentDialog{
    constructor(dialogId){
        super(dialogId);

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.callOptionStep.bind(this),
            this.finalStep.bind(this)
        ]))
            .addDialog(new ReinicioSapDialog(REINICIO_SAP_DIALOG))
            .addDialog(new DesbloqueoSapDialog(DESBLOQUEO_SAP_DIALOG))
            .addDialog(new RegistroUsuarioDialog(REGISTRO_USUARIO_DIALOG))
            .addDialog(new RegistroUserDialog(REGISTRO_USER_DIALOG))
            .addDialog(new NumberPrompt(NUMBER_PROMPT, this.optionPromptValidator));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async initialStep(stepContext) {    
        const dialogData = stepContext.options;
        
        const promptText = `¿Cómo te puedo ayudar?
        \n**1.** Desbloqueo de usuario SAP
        \n**2.** Reinicio de contraseña SAP
        \n**3.** Registrar usuario
        \n Ingresa el número.`;
    
        const retryPromptText = `Ingresar una opción válida.`
    
        return await stepContext.prompt(NUMBER_PROMPT, { prompt: promptText, retryPrompt:  retryPromptText });
    }

    async callOptionStep(stepContext) {
        const dialogData = stepContext.options;

        dialogData.option = stepContext.result;
        
        switch(dialogData.option.toString()) {
            case '1':
                console.log('Desbloqueo Usuario SAP');
                return await stepContext.beginDialog(DESBLOQUEO_SAP_DIALOG);
            case '2':
                console.log('Reinicio Usuario SAP');
                return await stepContext.beginDialog(REINICIO_SAP_DIALOG);
            case '3':
                console.log('Registro Usuario');
                return await stepContext.beginDialog(REGISTRO_USUARIO_DIALOG);
                //return await stepContext.beginDialog(REGISTRO_USER_DIALOG);
            default:
                return await stepContext.endDialog();
        }
    }

    async finalStep(stepContext) {
        console.log('Fin Menu Inicial Dialog');
        return await stepContext.endDialog();
    }

    async optionPromptValidator(promptContext) {
        return promptContext.recognized.succeeded && promptContext.recognized.value > 0 && promptContext.recognized.value < 4;
    }
}

module.exports.MenuInicialDialog = MenuInicialDialog;
