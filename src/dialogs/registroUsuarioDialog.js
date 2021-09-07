const { ComponentDialog, WaterfallDialog, TextPrompt, ChoicePrompt, ChoiceFactory, ListStyle, NumberPrompt, DateTimePrompt } = require("botbuilder-dialogs");
const { OdataConnection } = require('../odata/odataConnection');
const { CardFactory } = require("botbuilder");
const { Cards } = require('../cards/card');

const TEXT_PROMPT = 'textPrompt';
const EMAIL_TEXT_PROMPT = 'emailTextPrompt';
const CHOICE_PROMPT = 'choicePrompt';
const NUMBER_PROMPT = 'numberPrompt';
const DATE_TIME_PROMPT = 'dateTimePrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class RegistroUsuarioDialog extends ComponentDialog {
    constructor(dialogId) {
        super(dialogId);

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.unameStep.bind(this),
            this.firstNameStep.bind(this),
            this.lastNameStep.bind(this),
            this.mobNumberStep.bind(this),
            this.emailStep.bind(this),
            this.dateBirthStep.bind(this),
            this.confirmStep.bind(this),
            this.finalStep.bind(this)
        ]))
            .addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new TextPrompt(EMAIL_TEXT_PROMPT, this.emailPromptValidator))
            .addDialog(new NumberPrompt(NUMBER_PROMPT))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new DateTimePrompt(DATE_TIME_PROMPT));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async unameStep(stepContext) {
        const userData = stepContext.options;

        const promptText = 'Ingresar user ID:';
        return await stepContext.prompt(TEXT_PROMPT, { prompt: promptText });
    }

    async firstNameStep(stepContext) {
        const userData = stepContext.options;

        userData.uname = stepContext.result;

        const promptText = 'Ingresar nombres:';
        return await stepContext.prompt(TEXT_PROMPT, { prompt: promptText });
    }

    async lastNameStep(stepContext) {
        const userData = stepContext.options;

        userData.firstName = stepContext.result;

        const promptText = 'Ingresar apellidos:';
        return await stepContext.prompt(TEXT_PROMPT, { prompt: promptText });
    }

    async mobNumberStep(stepContext) {
        const userData = stepContext.options;

        userData.lastName = stepContext.result;

        const numberText = 'Ingresar número de celular:';
        return await stepContext.prompt(NUMBER_PROMPT, { prompt: numberText });
    }

    async emailStep(stepContext) {
        const userData = stepContext.options;

        userData.mobNumber = stepContext.result;

        const promptText = 'Ingresar email:';
        return await stepContext.prompt(EMAIL_TEXT_PROMPT, { prompt: promptText });
    }

    async dateBirthStep(stepContext) {
        const userData = stepContext.options;

        userData.email = stepContext.result;
        
        const promptText = 'Ingresar fecha de nacimiento:';
        return await stepContext.prompt(DATE_TIME_PROMPT, { prompt: promptText });
    }

    async confirmStep(stepContext) {
        const userData = stepContext.options;

        userData.dateBirth = stepContext.result;
        //var splitted = userData.dateBirth[0].value.split("-");
        //userData.dateBirthJSON = new Date(Date.UTC(splitted[2], splitted[0], splitted[1])).getTime();
        userData.dateBirthJSON = new Date(userData.dateBirth[0].value).valueOf();
        //userData.dateBirth = (new Date(parseInt('19850717'))).toJSON()

        return await stepContext.prompt(CHOICE_PROMPT, {
            choices: ChoiceFactory.toChoices(['Si','No']),
            prompt: 'Se creará un registro con los datos ingresados. ¿Desea continuar?.',
            style: ListStyle.heroCard
        });
    }

    async finalStep(stepContext) {
        const userData = stepContext.options;
        
        if (stepContext.result.value === 'Si') {               
            let odataConnection = new OdataConnection();
            let odataResult = await odataConnection.createUser(userData);

            switch(odataResult.type){
                case 'S':
                    const message = `Se creó el usuario con los datos:
                    \n**User ID:** ${ userData.uname }
                    \n**Nombres:** ${ userData.firstName }
                    \n**Apellidos:** ${ userData.lastName }
                    \n**Celular:** ${ userData.mobNumber }
                    \n**Email:** ${ userData.email }
                    \n**Fecha de nacimiento:** ${ userData.dateBirth[0].value }
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
    
    async emailPromptValidator(promptContext) {
        if (promptContext.recognized.succeeded) {        
            const email = promptContext.recognized.value;
            if (!RegistroUsuarioDialog.validateEmail(email)) {
                promptContext.context.sendActivity('Email ingresado no es válido.');
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
  
    static validateEmail(email) {
      const re = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i;
      return re.test(email);
    }
}

module.exports.RegistroUsuarioDialog = RegistroUsuarioDialog;