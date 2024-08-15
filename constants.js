let constants = {

    // Status Codes// 
    SUCCESS: 200,
    BAD_REQUEST: 400,
    AUTHORIZATION_REQUIRED: 401,
    NOT_FOUND: 404,
    SUCCESS_STATUS:true,
    ERROR_STATUS:false,
    NO_DATA_STATUS:false,
    INTERNAL_SERVER_ERROR: 500,
    Active: "Active",
    Hris:"HRISMaster",
    AuthTokenKey:"U1NHSGFwdGlrQXV0aEtleQ==",//Encode to Base64 format
    AuthTokenKeyActual:"SSGHaptikAuthKey",
    RoleAuthorization: {
        "/addDropdownMaster/Add":{MenuName:"Maintain Dropdown Values", AccessType:"Write"}
    },

}   

module.exports = Object.freeze(constants);