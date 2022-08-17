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

// 存放 echart 初始化返回的实例
let proportionChart: any = null

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
  // 饼图的收入/支出控制
  const [pieType, setPieType] = useState("expense")

  const monthRef = useRef<Nullable<CommonRef>>(null)

  useEffect(() => {
    getData()

    return () => {
      // 每次组件销毁时，释放图表实例
      proportionChart?.dispose()
    }
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

    // 绘制饼图
    setPieChart(pieType === "expense" ? expense_data : income_data)
  }

  // 月份弹窗开关
  const monthShow = () => monthRef?.current?.show()

  const selectMonth = (item: any) => setCurrentMonth(item)

  // 切换收支构成类型
  const changeTotalType = (type: any) => setTotalType(type)

  // 切换饼图收支类型
  const changePieType = (type: any) => {
    setPieType(type)
    // 重绘饼图
    setPieChart(type === "expense" ? expenseData : incomeData)
  }

  // 绘制饼图方法
  const setPieChart = (data: any) => {
    // @ts-ignore
    if (echarts) {
      // 初始化饼图，返回实例
      // @ts-ignore
      proportionChart = echarts.init(document.getElementById("proportion"))
      proportionChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        // 图例
        legend: {
          data: data.map((item: any) => item.type_name),
        },
        series: [
          {
            name: "支出",
            type: "pie",
            radius: "55%",
            data: data.map((item: any) => ({
              value: item.number,
              name: item.type_name,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      })
    }
  }

  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={s.date} type="date" />
        </div>

        <div className={s.title}>共支出</div>
        <div className={s.expense}>￥{totalExpense}</div>
        <div className={s.income}> 共收入￥{totalIncome}</div>
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

        <div className={s.proportion}>
          <div className={s.head}>
            <span className={s.title}>收支构成</span>

            <div className={s.tab}>
              <span
                onClick={() => changePieType("expense")}
                className={cx({
                  [s.expense]: true,
                  [s.active]: pieType === "expense",
                })}
              >
                支出
              </span>
              <span
                onClick={() => changePieType("income")}
                className={cx({
                  [s.income]: true,
                  [s.active]: pieType === "income",
                })}
              >
                收入
              </span>
            </div>
          </div>

          {/* 放置饼图的 DOM 节点 */}
          <div id="proportion" />
        </div>
      </div>

      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
  )
}

export default Data
