import { Icon, Progress } from "zarm"

import s from "./style.module.less"
import { useState, useRef, useEffect } from "react"
import dayjs from "dayjs"
import { CommonRef, Nullable } from "@/types"
import PopupDate from "@/components/PopupDate"
import { get } from "@/utils"
import cx from "classnames"
import CustomIcon from "@/components/CustomIcon"
import { typeMap } from "../../utils/index"

function Data() {
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"))
  // 收入/支出类型
  const [totalType, setTotalType] = useState("expense")
  // 总支出
  const [totalExpense, setTotalExpense] = useState(0)
  // 总收入
  const [totalIncome, setTotalIncome] = useState(0)
  // 支出数据
  const [expenseData, setExpenseData] = useState([])
  // 收入数据
  const [incomeData, setIncomeData] = useState([])

  const monthRef = useRef<Nullable<CommonRef>>(null)

  useEffect(() => {
    getData()
  }, [currentMonth])

  // 获取数据详情
  const getData = async () => {
    const { data } = await get(`/bill/data?date=${currentMonth}`)

    // 总收支
    setTotalExpense(data.total_expense)
    setTotalIncome(data.total_income)

    // 过滤支出和收入
    // 过滤出账单类型为支出的项
    const expense_data = data.total_data
      .filter((item: any) => item.pay_type == 1)
      .sort((a: any, b: any) => b.number - a.number)
    // 过滤出账单类型为收入的项
    const income_data = data.total_data
      .filter((item: any) => item.pay_type == 2)
      .sort((a: any, b: any) => b.number - a.number)

    setExpenseData(expense_data)
    setIncomeData(income_data)
  }

  // 月份弹窗开关
  const monthShow = () => monthRef?.current?.show()

  const selectMonth = (item: any) => setCurrentMonth(item)

  // 切换收支构成类型
  const changeTotalType = (type: any) => setTotalType(type)

  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={s.date} type="date" />
        </div>

        <div className={s.title}>共支出</div>
        <div className={s.expense}>￥1000</div>
        <div className={s.income}> 共收入￥200</div>
      </div>

      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span
              onClick={() => changeTotalType("expense")}
              className={cx({
                [s.expense]: true,
                [s.active]: totalType === "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeTotalType("income")}
              className={cx({
                [s.income]: true,
                [s.active]: totalType === "income",
              })}
            >
              收入
            </span>
          </div>
        </div>

        <div className={s.content}>
          {(totalType === "expense" ? expenseData : incomeData).map(
            (item: any) => (
              <div key={item.type_id} className={s.item}>
                <div className={s.left}>
                  <div className={s.type}>
                    <span
                      className={cx({
                        [s.expense]: totalType === "expense",
                        [s.income]: totalType === "income",
                      })}
                    >
                      <CustomIcon
                        type={item.type_id ? typeMap[item.type_id].icon : 1}
                      />
                    </span>

                    <span className={s.name}>{item.type_name}</span>
                  </div>

                  <div className={s.progress}>
                    ￥{Number(item.number).toFixed(2) ?? 0}
                  </div>
                </div>

                <div className={s.right}>
                  <div className={s.percent}>
                    <Progress
                      shape="line"
                      // @ts-ignore
                      percent={Number(
                        (item.number /
                          Number(
                            totalType === "expense"
                              ? totalExpense
                              : totalIncome,
                          )) *
                          100,
                      ).toFixed(2)}
                      theme="primary"
                    />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
  )
}

export default Data
