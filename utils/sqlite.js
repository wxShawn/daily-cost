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

	// 自定义sql增删改语句
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
	},
  
  // 自定义sql查询语句
  selectSql(sql) {
    return new Promise((resolve,reject) =>{
    	plus.sqlite.selectSql({
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

// account表结构
const account = {
  name: 'account',
  schema: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT UNIQUE,
    fund INTEGER
  `
}

// trade表结构
const trade = {
  name: 'trade',
  schema: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    num DECIMAL(10, 2),
    isIncome BOOLEAN,
    accountId INTEGER,
    tradeAt STRING,
    tradeType TEXT,
    iconUrl TEXT,
    remark TEXT
  `
}

// 初始化，创建数据表、插入默认数据
const init = async () => {
  console.log('是否已连接数据库', db.isOpen());
  const res1 = await db.executeSql(`CREATE TABLE IF NOT EXISTS ${account.name}(${account.schema})`);
  const res2 = await db.executeSql(`CREATE TABLE IF NOT EXISTS ${trade.name}(${trade.schema})`);
  // const res3 = await db.executeSql(`INSERT INTO account (name, fund) SELECT '支付宝',0 WHERE NOT EXISTS (SELECT * FROM account WHRER name='支付宝')`);
  // const res4 = await db.executeSql(`INSERT INTO account (name, fund) SELECT '微信',0 WHERE NOT EXISTS (SELECT * FROM account WHRER name='微信')`);
}
init();

export default db;