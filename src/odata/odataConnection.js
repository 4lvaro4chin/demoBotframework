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
                'Accept': 'application/json',
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
}

module.exports.OdataConnection = OdataConnection
