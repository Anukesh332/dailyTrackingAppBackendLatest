const { UserMasterHelper } = require("../helpers/user-helper");

let userHelper = new UserMasterHelper();

class UserService { 

    async addUser(userObj) {
        let userdata = await userHelper.addUser(userObj);   
        return userdata;
      };

      async authenticateUser(userObj) {
        let userdata = await userHelper.authenticateUser(userObj);   
        return userdata;
      };

      async fetchUser(userObj) {
        let userdata = await userHelper.fetchUser(userObj);   
        return userdata;
      };

      async getAllUsers() {
        let allusersdata = await userHelper.getAllUsers();
        return allusersdata;
      };

      async deleteUser(userObj) {
        let userdata = await userHelper.deleteUser(userObj);
        return userdata;
      };

};

module.exports = { UserService };