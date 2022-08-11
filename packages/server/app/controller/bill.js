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

  async list() {
    const { ctx, app } = this

    // 获取 date、分页数据、type_id
    const { date, page = 1, page_size = 5, type_id = "all" } = ctx.query

    try {
      let user_id

      // 通过 token 解析，拿到 user_id
      const token =
        ctx.request.header.authorization ?? ctx.request.header.Authorization
      const decode = await app.jwt.verify(token, app.config.jwt.secret)

      if (!decode) return

      user_id = decode.id

      // 拿到当前用户的账单列表
      const list = await ctx.service.bill.list(user_id)

      // 过滤出月份和类型对应的账单列表
      const _list = list.filter((item) => {
        if (type_id != "all") {
          return (
            moment(Number(item.date)).format("YYYY-MM") === date &&
            type_id === item.type_id
          )
        }
        return moment(Number(item.date)).format("YYYY-MM") === date
      })

      // 格式化数据
      const listMap = _list
        .reduce((curr, item) => {
          // curr 默认初始值为空数组 []
          // 把第一个账单项的时间格式化为 YYYY-MM-DD
          const date = moment(Number(item.date)).format("YYYY-MM-DD")
          // 如果能在累加的数组中找到当前项日期 date
          if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date === date) > -1
          ) {
            const index = curr.findIndex((item) => item.date === date)
            curr[index].bills.push(item)
          }

          // 在累加的数组中找不到当前项日期，就新建一项
          if (
            curr &&
            curr.length &&
            curr.findIndex((item) => item.date === date) === -1
          ) {
            curr.push({
              date,
              bills: [item],
            })
          }

          // 如果 curr 为空数组，则默认添加第一个账单项 item
          if (!curr.length) {
            curr.push({
              date,
              bills: [item],
            })
          }

          return curr
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date)) // 时间顺序为倒序，时间新的在上面

      // 分页处理，listMap 为格式化后全部数据，未分页
      const filterListMap = listMap.slice(
        (page - 1) * page_size,
        page * page_size,
      )

      // 计算当月总收入和支出
      // 首先获取当月所有账单列表
      const __list = list.filter(
        (item) => moment(Number(item.date)).format("YYYY-MM") === date,
      )

      // 累加计算支出
      const totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount)
          return curr
        }

        return curr
      }, 0)

      // 累加计算收入
      const totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount)
          return curr
        }

        return curr
      }, 0)

      // 返回数据
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: {
          totalExpense, // 当月支出
          totalIncome, // 当月收入
          totalPage: Math.ceil(listMap.length / page_size), // 总分页
          list: filterListMap || [], // 格式化后，并且经过分页处理的数据
        },
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
