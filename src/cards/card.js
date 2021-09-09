class Cards {
    constructor() {

    }

    async welcome(userName) {
        const json = {
            "type": "AdaptiveCard",
            "body": [
                {
                    "type": "Image",
                    "url": "https://omniasolution.com/wp-content/uploads/2021/06/Group-158@2x.png"
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/1724/PNG/512/4023883-bot-head-robot-robotics_112865.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "weight": "Bolder",
                                    "text": `¡Bienvenido ${ userName }!`,
                                    "wrap": true,
                                    "size": "ExtraLarge"
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "text": `Soy tu asistente virtual y estoy disponible para ayudarte en el momento que lo necesites.`,
                    "wrap": true
                }
            ],
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3"
        };       
        
        return json; 
    }

    async reinicioSap(user, system, password){
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/1724/PNG/512/4023883-bot-head-robot-robotics_112865.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `Se ha reiniciado la contraseña del usuario **${ user }** en el sistema **${ system }**.
                                    \nLa nueva contraseña es:
                                    \n**${ password }**`,
                                    "size": "Default",
                                    "fontType": "Default",
                                    "height": "stretch",
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                } 
            ]
        };
        
        return json;
    }

    async reinicioSapError(message){
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/586/PNG/512/robot-head-with-cardiogram_icon-icons.com_55279.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `Se ha identificado un error en SAP.
                                    \n**${ message }**`,
                                    "size": "Default",
                                    "fontType": "Default",
                                    "height": "stretch",
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                } 
            ]
        };
        
        return json;
    }

    async errorMessage(message){
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/586/PNG/512/robot-head-with-cardiogram_icon-icons.com_55279.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `¡Ooppps!.
                                    \n**${ message }**`,
                                    "size": "Default",
                                    "fontType": "Default",
                                    "height": "stretch",
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                } 
            ]
        };
        
        return json;
    }

    async desbloqueoSap(user, system){
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/1724/PNG/512/4023883-bot-head-robot-robotics_112865.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `Se ha desbloqueado el usuario **${ user }** en el sistema **${ system }**.`,
                                    "size": "Default",
                                    "fontType": "Default",
                                    "height": "stretch",
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                }                
            ]
        };
        
        return json;
    }

    async desbloqueoSapError(message){
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/586/PNG/512/robot-head-with-cardiogram_icon-icons.com_55279.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `Se ha identificado un error en SAP.
                                    \n**${ message }**`,
                                    "size": "Default",
                                    "fontType": "Default",
                                    "height": "stretch",
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                } 
            ]
        };
        
        return json;
    }

    async reconexion(){
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "Image",
                                    "size": "Small",
                                    "url": "https://cdn.icon-icons.com/icons2/1724/PNG/512/4023883-bot-head-robot-robotics_112865.png"
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `¡Bienvenido nuevamente!`,
                                    "size": "Default",
                                    "fontType": "Default",
                                    "height": "stretch",
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        }
                    ]
                }                
            ]
        };
    
        return json;
    }

    async registrarUsuario() {
        const json = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.3",
            "body": [
                {
                    "type": "TextBlock",
                    "size": "Large",
                    "weight": "Bolder",
                    "text": "Crear Usuario",
                    "horizontalAlignment": "Center",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "style": "text",
                    "id": "uname",
                    "isRequired": true,
                    "label": "User ID",
                    "errorMessage": "Es necesario ingresar el User ID."
                },
                {
                    "type": "Input.Text",
                    "id": "firstName",
                    "label": "Nombres",
                    "isRequired": true,
                    "errorMessage": "Es necesario ingresar por lo menos un Nombre"
                },
                {
                    "type": "Input.Text",
                    "id": "lastName",
                    "label": "Apellidos",
                    "isRequired": true,
                    "errorMessage": "Es necesario ingresar los apellidos."
                },
                {
                    "type": "Input.Text",
                    "style": "Email",
                    "id": "email",
                    "label": "Email",
                    "isRequired": true,
                    "errorMessage": "Es necesario ingresar el email."
                },
                {
                    "type": "Input.Text",
                    "style": "Tel",
                    "id": "celphone",
                    "label": "Celular",
                    "isRequired": true,
                    "errorMessage": "Es necesario ingresar el celular."
                },
                {
                    "type": "Input.Date",
                    "id": "dateBirth",
                    "label": "Fecha de nacimiento",
                    "errorMessage": "Es necesario ingresar la fecha de nacimiento",
                    "isRequired": true
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Guardar",
                    "data": {
                        "id": "actionSave"
                    },
                    "style": "positive"
                },
                {
                    "type": "Action.Submit",
                    "title": "Cancelar",
                    "data": {
                        "id": "actionCancel"
                    }
                }
            ]
        };

        return json;
    }
}

module.exports.Cards = Cards;
