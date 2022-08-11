const moment = require("moment")
const Controller = require("egg").Controller

class BillController extends Controller {
  async add() {
    const { ctx, app } = this

    // 获取请求中携带的参数
    const {
      amount,
      type_id,
      type_name,
      date,
      pay_type,
      remark = "",
    } = ctx.request.body

    // 判空处理
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: "参数错误",
        data: null,
      }
    }

    try {
      let user_id
      const token =
        ctx.request.header.authorization ?? ctx.request.header.Authorization

      // 拿到 token 获取用户信息
      const decode = await app.jwt.verify(token, app.config.jwt.secret)

      if (!decode) return

      user_id = decode.id

      // user_id 默认添加到每个账单项，作为后续获取指定用户账单的标识
      // 可以理解为，登录 A 账户，所做的操作都需要加上 A 账户的 id，后续获取时，过滤出 A 账户 id
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      })

      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: null,
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: null,
      }
    }
  }
}

module.exports = BillController
