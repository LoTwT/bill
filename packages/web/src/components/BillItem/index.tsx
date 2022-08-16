import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Cell } from "zarm"
import CustomIcon from "../CustomIcon"
import dayjs from "dayjs"

import s from "./style.module.less"
import { typeMap } from "@/utils"

interface IBillItemProps {
  bill: Record<string, any>
}

function BillItem(props: IBillItemProps) {
  const { bill } = props

  // 收入
  const [income, setIncome] = useState(0)
  // 支出
  const [expense, setExpense] = useState(0)

  const navigate = useNavigate()

  // 当添加账单时，bill.bills 长度变化，触发当日收支总和计算
  useEffect(() => {
    // 初始化将传入的 bill 内的 bills 数组数据项，过滤出支出和收入
    // pay_type：1 为支出，2 为收入
    const _income = bill.bills
      .filter((i: any) => i.pay_type === 2)
      .reduce((curr: any, item: any) => {
        curr += Number(item.amount)
        return curr
      }, 0)
    setIncome(_income)

    const _expense = bill.bills
      .filter((i: any) => i.pay_type === 1)
      .reduce((curr: any, item: any) => {
        curr += Number(item.amount)
        return curr
      }, 0)
    setExpense(_expense)
  }, [])

  // 前往账单详情
  const goToDetail = (item: any) => {
    navigate(`/detail?id=${item.id}`)
  }

  return (
    <div className={s.item}>
      <div className={s.headerDate}>
        <div className={s.date}>{bill.date}</div>

        <div className={s.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
            <span>￥{expense.toFixed(2)}</span>
          </span>

          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>￥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>

      {bill &&
        bill.bills.map((item: any) => (
          <Cell
            className={s.bill}
            key={item.id}
            onClick={() => goToDetail(item)}
            title={
              <>
                <CustomIcon
                  className={s.itemIcon}
                  type={item.type_id ? typeMap[item.type_id].icon : 1}
                />
                <span>{item.type_name}</span>
              </>
            }
            description={
              <span
                style={{ color: item.pay_type === 2 ? "red" : "#39be77" }}
              >{`${item.pay_type === 1 ? "-" : "+"}${item.amount}`}</span>
            }
            help={
              <div>
                {dayjs(Number(item.date)).format("HH:mm")}
                {item.remark ? `| ${item.remark}` : ""}
              </div>
            }
          />
        ))}
    </div>
  )
}

export default BillItem
