const axios = require('axios');

class OdataConnection {
    constructor() {

    }

    async getSystemSet() {
        let url;
        url = `${ process.env.OdataHostUrlOCS200 }/SystemSet`;

        const resultOdata = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            auth: {
              username: process.env.OdataUser,
              password: process.env.OdataPassword
            }
        }).then((response) => {
            return response.data.d;
        })
        .catch((error) => { 
            console.log(error);
            return error;
        });

        return resultOdata;
    }

    async resetPassword(SistMandt, Useralias) {
        let url;

        var jsonError = {
            'type' : 'E',
            'message' : 'El sistema y mandante seleccionados no están disponibles.'
        }

        switch(SistMandt){
            case 'OCS200':
                url = `${ process.env.OdataHostUrlOCS200 }/ResetPassword?SistMandt='${ SistMandt }'&Useralias='${ Useralias }'`;
                break;
            case 'OCS010':
                return jsonError;
        }

        const resultOdata = await axios.get(url, {
            auth: {
              username: process.env.OdataUser,
              password: process.env.OdataPassword
            }
        }).then((response) => { 
            var json = {
                'type' : response.data.d.Type,
                'id' : response.data.d.Id,
                'number' : response.data.d.Number,
                'message' : response.data.d.MsgTexto,
                'user' : response.data.d.MsgVar1,
                'system' : response.data.d.MsgVar2,
                'password' : response.data.d.MsgVar3,
            }
            return json;
        })
        .catch((error) => { 
            console.log(error);
            return error;
        });

        return resultOdata;
    }

    async unlockUser(SistMandt, Useralias) {
        let url;

        var jsonError = {
            'type' : 'E',
            'message' : 'El sistema y mandante seleccionados no están disponibles.'
        }

        switch(SistMandt){
            case 'OCS200':
                url = `${ process.env.OdataHostUrlOCS200 }/UnlockUser?SistMandt='${ SistMandt }'&Useralias='${ Useralias }'`;
                break;
            case 'OCS010':
                return jsonError;
            case 'PRD400':
                return jsonError;
        }

        const resultOdata = await axios.get(url, {
            auth: {
              username: process.env.OdataUser,
              password: process.env.OdataPassword
            }
        }).then((response) => { 
            var json = {
                'type' : response.data.d.Type,
                'id' : response.data.d.Id,
                'number' : response.data.d.Number,
                'message' : response.data.d.MsgTexto,
                'user' : response.data.d.MsgVar1,
                'system' : response.data.d.MsgVar2,
                'password' : response.data.d.MsgTexto
            }
            return json;
        })
        .catch((error) => { 
            console.log(error);
            return error;
        });

        return resultOdata;
    }

    async createUser(userData) {
        let url;
        url = `${ process.env.OdataHostUrlOCS200 }/SystemSet`;

        const resultToken = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-csrf-token': 'fetch'
            },
            auth: {
              username: process.env.OdataUser,
              password: process.env.OdataPassword
            }
        }).then((response) => {
            var string = JSON.stringify(response.headers);
            var objectValue = JSON.parse(string);
            return objectValue;
        })
        .catch((error) => { 
            return error;
        });
                
        url = `${ process.env.OdataHostUrlMdkcrud }/UserSet`;

        var bodyJSON = JSON.stringify({
            "Uname" : `${ userData.uname }`,
            "FirstName" : `${ userData.firstName }`,
            "LastName" : `${ userData.lastName }`,
            "MobNumber" : `${ userData.mobNumber }`,
            "SmtpAddr" : `${ userData.email }`,
            "DateBirth" : `\/Date(${ userData.dateBirthJSON })\/`
        });

        const resultOdata = await axios.post(url, bodyJSON, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-csrf-token': resultToken['x-csrf-token'],
                'Cookie': resultToken['set-cookie']
            },
            auth: {
              username: process.env.OdataUser,
              password: process.env.OdataPassword
            }
        })
        .then((response) => { 
            var jsonSuccess = {
                'type' : 'S',
                'message' : `Se ha registrado el usuario ${ userData.uname }.`
            }
            return jsonSuccess;
        })
        .catch((error) => {
            console.log(error.response.status);

            switch(error.response.status){
                case 500:   
                    var jsonError = {
                        'type' : 'E',
                        'message' : 'Ya existe un usuario con el ID indicado.'
                    }
                    return jsonError;
                default:
                    var jsonError = {
                        'type' : 'E',
                        'message' : 'Error en la ejecución del OData.'
                    }
                    return jsonError;
            }
        });

        return resultOdata;        
    }
}

module.exports.OdataConnection = OdataConnection
