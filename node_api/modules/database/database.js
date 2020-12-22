const Sequelize = require('sequelize');
class Database{

    constructor(){ //TODO Раскидать конфиг и таблицы на файлы
        const config =  {
            username: 'root',
            password: null, 
            database: 'bc_bridge', 
            host: '127.0.0.1', 
            dialect: 'sqlite', 
            dialectOptions: {
              multipleStatements: true
            },
            logging: console.log, 
            storage: './bc_bridge.sqlite', 
            operatorsAliases: Sequelize.Op 
          }
          this.sequelize = new Sequelize(config); 


          this.users = this.sequelize.define('users', {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.DataTypes.INTEGER
            },
            uid: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false
            }
          }, {
            timestamps: true // Колонки createdAt и updatedAt будут созданы автоматически
          });

          this.key_vault = this.sequelize.define('key_vault', {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.DataTypes.INTEGER
            },
            user_id: { 
              type: Sequelize.DataTypes.STRING,
              allowNull: false
            },
            wallet_currency: { 
              type: Sequelize.DataTypes.STRING,
              allowNull: false
            },
            pub_key: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false
              },
            wallet_id: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false
            }
          }, {
            timestamps: true // Колонки createdAt и updatedAt будут созданы автоматически
          });

          // this.users.belongsTo(this.key_vault, { as: 'users_key_vaults', foreignKey: 'id', targetKey: 'user_id'});
    }

    /**
     * 
     */
    async createDB(){ // Tолько инициализация  проекта не использовать на прод!
        await this.sequelize.sync();
    }

    /**
     * Добавляет нового пользователя в users если нет пользователей со схожим uid иначе отдает пользователя с таким uid
     * @param {String} uid 
     * @return {Object}
     */
    async safeAddUser(uid){ 
      let user = await this.sequelize.models.users.findOne({ where: { uid: uid } });
      if (user) {
        return user;
      }
      else {
        let newUser = {
          uid: uid
        }
        let user = await this.sequelize.models.users.create(newUser);
        return user;
      }
    }

    /**
     * Добавляет новую запись в key_vault если нет записи со схожими user_id и wallet_currency иначе отдает ее
     * @param {String} user_id 
     * @param {String} wallet_currency 
     * @param {String} pub_key 
     * @return {Object}
     */
    async safeAddKeyVault(user_id, wallet_currency, pub_key, wallet_id){ 
      let userKey = await this.sequelize.models.key_vault.findOne({ where: { user_id: user_id, wallet_currency: wallet_currency} });
      if (userKey) {
        return userKey;
      }
      else {
        let newUserKey = {
          user_id: user_id,
          wallet_currency: wallet_currency,
          pub_key: pub_key,
          wallet_id: wallet_id
        }
        let userKey = await this.sequelize.models.key_vault.create(newUserKey);
        return userKey;
      }
    }

    /**
     * Обновляет записи в таблице users если пользователь с таким id существует и нет других записей с таким uid
     * @param {Number} id 
     * @param {String} uid 
     * @return {Boolean}
     */
    async safeUpdateUser(id, uid){ //+
      let user = await this.sequelize.models.users.findOne({ where: { uid: uid } });
      if (user) {
        return false
      }
      let updatedUser = await this.sequelize.models.users.update({ uid: uid }, { where: { id: id } });
      return Boolean(updatedUser[0]);
    }

    /**
     * Обновляет записи в таблице key_vault если пользователь с таким user_id существует и нет других записей с таким pub_key по валюте wallet_currency
     * @param {Number} user_id 
     * @param {String} wallet_currency 
     * @param {String} pub_key 
     * @return {Boolean}
     */
    async safeUpdateKeyVault(user_id, wallet_currency, pub_key, wallet_id){
      let userKey = await this.sequelize.models.key_vault.findOne({ where: { wallet_currency: wallet_currency, pub_key: pub_key} });
      if (userKey) {
        console.log(100)
        if (user_id != userKey.dataValues.user_id ){
          return false
        }
        else{

          if (wallet_id == userKey.dataValues.wallet_id && pub_key == userKey.dataValues.pub_key){
            return true
          }
  
          let updatedUserKey = await this.sequelize.models.key_vault.update({ pub_key: pub_key, wallet_id: wallet_id }, { where: {user_id: user_id, wallet_currency: wallet_currency} });
          return Boolean(updatedUserKey[0]);
        }

      }
      else {
          let updatedUserKey = await this.sequelize.models.key_vault.update({ pub_key: pub_key, wallet_id: wallet_id }, { where: {user_id: user_id, wallet_currency: wallet_currency} });
          return Boolean(updatedUserKey[0]);
      }

    }
 
    /**
     * Возвращает объект с пользователем по uid
     * @param {String} uid 
     * @return {Object}
     */
    async getUserByUid(uid){
      let user = await this.sequelize.models.users.findOne({ where: { uid: uid } });
      if (user)
        return user.dataValues;
      else
        return null;
    }

    /**
     * Возвращает объект с пользователем по id
     * @param {Number} id 
     * @return {Object}
     */
    async getUserById(id){
      let user = await this.sequelize.models.users.findOne({ where: { id: id } });
      if (user)
        return user.dataValues;
      else
        return null;
    }

    /**
     * Возвращает объект с key_vault по user_id и wallet_currency
     * @param {String} user_id 
     * @param {String} wallet_currency 
     * @return {Object}
     */
    async getKeyVault(user_id, wallet_currency){
      let userKey = await this.sequelize.models.key_vault.findOne({ where: { user_id: user_id, wallet_currency: wallet_currency} });
      if (userKey)
        return userKey.dataValues;
      else
        return null;
    }

    /**
     * Возвращает объект с key_vault по id записи
     * @param {Number} id 
     * @return {Object}
     */
    async getKeyVaultById(id){
      let userKey = await this.sequelize.models.key_vault.findOne({ where: { id: id} });
      if (userKey)
        return userKey.dataValues;
      else
        return null;
    }

    /**
     * Получение кошелька по wallet_id
     * @param {String} wallet_id 
     * @return {Object || false}
     */
    async getKeyVaultByWalletId(wallet_id) {
      let wallet = await this.sequelize.models.key_vault.findOne({ where: {wallet_id: wallet_id}});
      if (wallet)
        return wallet.dataValues;
      else
        return null;
    }

    /**
     * Возвращает все key_vault пользователя по user_id
     * @param {String} user_id // Check
     * @return {Object || false}
     */
    async getAllKeyVaultsByUserId(user_id){
      let userKeys = await this.sequelize.models.key_vault.findAll({ where: { user_id: user_id} });
      if (userKeys) {
        let realKeys = [];
        for (const key of userKeys) {
          realKeys.push(key.dataValues);
        }
        return realKeys;
      }
      else {
        return false
      }
      
    }

    /**
     * Возвращает все key_vault пользователя по uid
     * @param {String} uid // Check
     * @return {Object || false}
     */
    async getAllKeyVaultsByUid(uid){
      let user = await this.getUserByUid(uid);
      if (user) {
        let user_id = user.dataValues.id;
        return this.getAllKeyVaultsByUserId(user_id);
      }
      return false;
    }

    /**
     * Удаляет записи о пользователе по uid со всеми его key_vault (НЕ ПРОТЕСТИРОВАНО)
     * @param {String} uid 
     * @return {Array(Boolean, Boolean)}
     */
    async deleteUserByUid(uid){

      let user = await this.getUserByUid(uid);
      if (user) {
        let user_id = user.dataValues.id
        let res2 = await this.sequelize.models.key_vault.destroy({ where: { user_id: user_id} });
        let res = await this.sequelize.models.users.destroy({ where: { uid: uid } });

        return [Boolean(res), Boolean(res2)];
      }
      else {
        return [false, false];
      }
    }

    /**
     * Удаляет записи о пользователе по id со всеми его key_vault (НЕ ПРОТЕСТИРОВАНО)
     * @param {Number} id 
     * @return {Array(Boolean, Boolean)}
     */
    async deleteUserById(id){
      let user = await this.getUserById(id);
      if (user) {
        let res = await this.sequelize.models.users.destroy({ where: { id: id } });
        let res2 = await this.sequelize.models.key_vault.destroy({ where: { user_id: user_id} });

        return [Boolean(res), Boolean(res2)];
      }
      else{
        return [false, false]
      }
    }

    /**
     * Удаляет key_vault по user_id и wallet_currency (НЕ ПРОТЕСТИРОВАНО)
     * @param {String} user_id 
     * @param {String} wallet_currency 
     * @return {Object}
     */
    async deleteKeyVault(user_id, wallet_currency){
      let userKey = await this.sequelize.models.key_vault.destroy({ where: { user_id: user_id, wallet_currency: wallet_currency} });
      return userKey;
    }

    /**
     * Удаляет key_vault по его id (НЕ ПРОТЕСТИРОВАНО)
     * @param {Number} id 
     * @return {Object}
     */
    async deleteKeyVaultById(id){
      let userKey = await this.sequelize.models.key_vault.destroy({ where: { id: id} });
      return userKey;
    }
}

// async function main(){
//   let db = new Database();
//   let test  = await db.safeAddUser("testtest");

//   let user_id = 2
//   let wallet_currency = "test1"
//   let pub_key = "pub_key1"
//   let wallet_id = "wallet_id1"
//   let id =1
//   let uid = "test2test"


//   db.safeAddKeyVault(user_id, wallet_currency, pub_key, wallet_id)
//   db.safeUpdateUser(2, "test")
//   test = await db.safeUpdateKeyVault(user_id, wallet_currency, pub_key, wallet_id)
//   test = await db.safeAddKeyVault(user_id, wallet_currency, pub_key, wallet_id)
//   test = await db.getAllKeyVaultsByUid(uid)


//   console.log("_________ ", test)
//   test  = await db.deleteUserById(user_id);

//   await console.log(test);
  
//   db.createDB();

//   process.exit();
// }

// main();

module.exports = Database;