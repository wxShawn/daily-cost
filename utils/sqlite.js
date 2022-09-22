const db = {
  dbName: 'daily_cost',           //数据库名称
  dbPath: '_doc/daily_cost.db',   //数据库地址，uniapp推荐以下划线为开头
  
  // 是否已连接数据库
  isOpen() {
    const res = plus.sqlite.isOpenDatabase({
      name: this.dbName,
      path: this.dbPath,
    });
    return res;
  },
  
	// 连接数据库
  openDb() {
    return new Promise((resolve, reject) => {
      plus.sqlite.openDatabase({
        name: this.dbName,
        path: this.dbPath,
        success(e){
          resolve(e); //成功回调
        },
        fail(e){
          reject(e); //失败回调
        }
      });
    });
  },

  // 关闭数据库
  closeDb(){
  	return new Promise((resolve,reject) =>{
  		plus.sqlite.closeDatabase({
  			name: this.dbName,
  			success(e){
  				resolve(e);
  			},
  			fail(e){
  				reject(e);
  			}
  		})
  	})
  },
  
	/**
	 * 创建表
	 * @param {String} tableName 
	 * @param {String} tableHead 
	 * @returns 
	 */
  createTable(tableName, tableHead) {
    return new Promise((resolve,reject) =>{
    	plus.sqlite.executeSql({
    		name: this.dbName,
        sql: `CREATE TABLE IF NOT EXISTS ${tableName}(${tableHead})`,
    		success(e){
    			resolve(e);
    		},
    		fail(e){
    			reject(e);
    		}
    	})
    })
  },
  
	/**
	 * 删除表
	 * @param {String} tableName 
	 * @returns 
	 */
  dropTable(tableName) {
    return new Promise((resolve,reject) =>{
    	plus.sqlite.executeSql({
    		name: this.dbName,
        sql: `DROP TABLE ${tableName}`,
    		success(e){
    			resolve(e);
    		},
    		fail(e){
    			reject(e);
    		}
    	})
    })
  },
  
	/**
	 * 插入数据
	 * @param {String} tableName 
	 * @param {Object} data { key: value }
	 * @returns 
	 */
  insertData(tableName, data) {
		const keyList = Object.keys(data);
		const valueList = Object.values(data);
    return new Promise((resolve,reject) =>{
    	plus.sqlite.executeSql({
    		name: this.dbName,
        sql: `INSERT INTO ${tableName}(${keyList}) VALUES('${valueList}')`,
    		success(e){
    			resolve(e);
    		},
    		fail(e){
    			reject(e);
    		}
    	})
    })
  },

	/**
	 * 删除数据
	 * @param {String} tableName 
	 * @param {Number} id 
	 * @returns 
	 */
	deleteData(tableName, id) {
		return new Promise((resolve,reject) =>{
    	plus.sqlite.executeSql({
    		name: this.dbName,
        sql: `DELETE FROM ${tableName} WHRER id = ${id})`,
    		success(e){
    			resolve(e);
    		},
    		fail(e){
    			reject(e);
    		}
    	})
    })
	},

	/**
	 * 修改数据
	 * @param {String} tableName 
	 * @param {Number} id 
	 * @param {Object} data 
	 * @returns 
	 */
	updateData(tableName, id, data) {
		const keyList = Object.keys(data);
		const valueList = Object.values(data);
		const dataString = '';
		for (let i = 0; i < keyList.length; i++) {
			dataString = `${dataString}${dataString !== '' ? ',' : ''} ${keyList[i]} = ${valueList[i]}`;
		}
		return new Promise((resolve,reject) =>{
    	plus.sqlite.executeSql({
    		name: this.dbName,
        sql: `UPDATE ${tableName} SET ${dataString} WHRER id = ${id})`,
    		success(e){
    			resolve(e);
    		},
    		fail(e){
    			reject(e);
    		}
    	})
    })
	},

	/**
	 * 查询数据
	 * @param {String} tableName 
	 * @param {Object} condition 
	 * @param {Number} pageSize 
	 * @param {Number} pageNum 
	 * @returns 
	 */
	findData(tableName, condition, pageSize, pageNum) {
		const conditionKeyList = Object.keys(condition);
		const conditionValueList = Object.values(condition);
		let conditionString = '';
		for (let i = 0; i < conditionKeyList.length; i++) {
			conditionString = `${conditionString}${conditionString !== '' ? ' and' : ''} ${conditionKeyList[i]} = ${conditionValueList[i]}`
		}
		return new Promise((resolve,reject) =>{
    	plus.sqlite.executeSql({
    		name: this.dbName,
        sql: `SELECT * FROM ${tableName} WHRER ${conditionString} ORDER BY id LIMIT ${pageSize} OFFSET ${pageSize * (pageNum - 1)}`,
    		success(e){
    			resolve(e);
    		},
    		fail(e){
    			reject(e);
    		}
    	})
    })
	},

	// 自定义执行sql语句
	executeSql(sql) {
		return new Promise((resolve,reject) =>{
    	plus.sqlite.executeSql({
    		name: this.dbName,
        sql: sql,
    		success(e){
    			resolve(e);
    		},
    		fail(e){
    			reject(e);
    		}
    	})
    })
	}
}

const account = {
  name: 'account',
  schema: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT,
    fund INTEGER
  `
}

const trade = {
  name: 'trade',
  schema: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    num INTEGER,
    isIncome BOOLEAN,
    accountId INTEGER,
    tradeType TEXT,
    iconUrl TEXT,
    remark TEXT
  `
}

// 创建数据表
// db.createTable(account.name, account.schema);
// db.createTable(trade.name, trade.schema);

export default db;