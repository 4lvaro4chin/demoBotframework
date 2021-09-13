const { TurnContext } = require('botbuilder');
const hana = require('@sap/hana-client');

class HanaConnection {
    constructor() {

    }

    async saveRefenceInHana(context){
        const reference = JSON.stringify(TurnContext.getConversationReference(context.activity));
        
        let connOptions = {
            serverNode: process.env.hanaServerNode,
            encrypt: "true",
            sslValidateCertificate: "false",
            uid: process.env.hanaUid,
            pwd: process.env.hanaPwd,
        };
    
        let dbConnection = hana.createConnection();

        let userEmail = "aachin@omniasolution.com";
    
        try {
            await dbConnection.connect(connOptions);
            
            let sql = `UPSERT CHATBOT.REFERENCE VALUES ('demoBotframework','${ userEmail }','${ reference }') 
                       where CHATBOTNAME = 'demoBotframework' 
                       AND USEREMAIL = '${ userEmail }';`;
    
            let result = await dbConnection.exec(sql);
        } catch (err) {
            console.log(err);
        }
    }

    async getRefenceInHana(chatbotName, userEmail) {
        let connOptions = {
            serverNode: process.env.hanaServerNode,
            encrypt: "true",
            sslValidateCertificate: "false",
            uid: process.env.hanaUid,
            pwd: process.env.hanaPwd,
        };
    
        try {
            let dbConnection = hana.createConnection();

            await dbConnection.connect(connOptions);
            
            var sql = `SELECT * from CHATBOT.REFERENCE WHERE CHATBOTNAME = '${chatbotName}' AND USEREMAIL = '${userEmail}';`;
    
            var result = await dbConnection.exec(sql);
    
            return JSON.parse(result[0].REFERENCE);
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports.HanaConnection = HanaConnection;