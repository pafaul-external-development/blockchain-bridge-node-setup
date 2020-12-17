const Sequelize = require('sequelize');
class Database{

    /**
     * 
     * @return {*}
     */
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
              type: Sequelize.DataTypes.INTEGER,
              allowNull: false
            },
            node_name: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false
            },
            pub_key: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
              }
          }, {
            timestamps: true // Колонки createdAt и updatedAt будут созданы автоматически
          });

          this.users.belongsTo(this.key_vault, { as: 'users_key_vaults', foreignKey: 'id', targetKey: 'user_id'});
    }

    /**
     * 
     */
    async createDB(){ // Tолько инициализация проекта не использовать на прод!
        await this.sequelize.sync();
    }

    /**
     * 
     * @param {*} uid 
     * @return {*}
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
     * 
     * @param {*} user_id 
     * @param {*} node_name 
     * @param {*} pub_key 
     * @return {*}
     */
    async safeAddKeyVault(user_id, node_name, pub_key){
      let userKey = await this.sequelize.models.key_vault.findOne({ where: { user_id: user_id, node_name: node_name} });
      if (userKey) {
        return userKey;
      }
      else {
        let newUserKey = {
          user_id: user_id,
          node_name: node_name,
          pub_key: pub_key
        }
        let userKey = await this.sequelize.models.key_vault.create(newUserKey);
        return userKey;
      }
    }

    /**
     * 
     * @param {*} id 
     * @param {*} uid 
     * @return {*}
     */
    async safeUpdateUser(id, uid){
      let user = await this.sequelize.models.users.findOne({ where: { uid: uid } });
      if (user) {
        throw new Error("User with this uid is already in database!")
      }
      let updatedUser = await this.sequelize.models.users.update({ uid: uid }, { where: { id: id } });
      return Boolean(updatedUser[0]);
    }

    /**
     * 
     * @param {*} user_id 
     * @param {*} node_name 
     * @param {*} pub_key 
     * @return {*}
     */
    async safeUpdateKeyVault(user_id, node_name, pub_key){
      let userKey = await this.sequelize.models.key_vault.findOne({ where: { node_name: node_name, pub_key: pub_key} });
      if (userKey) {
        throw new Error("Such node_name, pub_key pair is already in database!")
      }
      let updatedUserKey = await this.sequelize.models.key_vault.update({ pub_key: pub_key }, { where: {user_id: user_id, node_name: node_name } });
      return Boolean(updatedUserKey[0]);
    }

    /**
     * 
     * @param {*} uid 
     * @return {*}
     */
    async getUserByUid(uid){
      let user = await this.sequelize.models.users.findOne({ where: { uid: uid } });
      return user;
    }

    /**
     * 
     * @param {*} id 
     * @return {*}
     */
    async getUserById(id){
      let user = await this.sequelize.models.users.findOne({ where: { id: id } });
      return user;
    }

    /**
     * 
     * @param {*} user_id 
     * @param {*} node_name 
     * @return {*}
     */
    async getKeyVault(user_id, node_name){
      let userKey = await this.sequelize.models.key_vault.findOne({ where: { user_id: user_id, node_name: node_name} });
      return userKey;
    }

    /**
     * 
     * @param {*} id 
     * @return {*}
     */
    async getKeyVaultById(id){
      let userKey = await this.sequelize.models.key_vault.findOne({ where: { id: id} });
      return userKey;
    }

    /**
     * 
     * @param {*} user_id 
     * @return {*}
     */
    async getAllKeyVaultsByUserId(user_id){
      let userKeys = await this.sequelize.models.key_vault.findAll({ where: { user_id: user_id} });
      return userKeys;
    }

    /**
     * 
     * @param {*} uid 
     * @return {*}
     */
    async getAllKeyVaultsByUid(uid){
      let user = await this.getUserByUid(uid);
      if (user) {
        let user_id = user.dataValues.id
        return this.getAllKeyVaultsByUserId(user_id)
      }
      return false
    }

    /**
     * 
     * @param {*} uid 
     * @return {*}
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
        return null;
      }
    }

    /**
     * 
     * @param {*} id 
     * @return {*}
     */
    async deleteUserById(id){
      let user = await this.getUserById(id);
      if (user) {
        let res = await this.sequelize.models.users.destroy({ where: { id: id } });
        let res2 = await this.sequelize.models.key_vault.destroy({ where: { user_id: user_id} });

        return [Boolean(res), Boolean(res2)];
      }
      else{
        return null
      }
    }

    /**
     * 
     * @param {*} user_id 
     * @param {*} node_name 
     * @return {*}
     */
    async deleteKeyVault(user_id, node_name){
      let userKey = await this.sequelize.models.key_vault.destroy({ where: { user_id: user_id, node_name: node_name} });
      return userKey;
    }

    /**
     * 
     * @param {Number} id 
     * @return {*}
     */
    async deleteKeyVaultById(id){
      let userKey = await this.sequelize.models.key_vault.destroy({ where: { id: id} });
      return userKey;
    }
}

async function main(){
  let db = new Database();
  // let test  = await db.safeAddUser("testtest");

  user_id = 1
  node_name = "test2"
  pub_key = "testtest"

  let test  = await db.deleteUserById(user_id);

  await console.log(test);
  
  // db.createDB();
}

main();

