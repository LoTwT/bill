const Service = require("egg").Service

class BillService extends Service {
  async add(params) {
    const { ctx, app } = this

    try {
      // 向 bill 表中插入一条账单数据
      const result = await app.mysql.insert("bill", params)
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

module.exports = BillService
