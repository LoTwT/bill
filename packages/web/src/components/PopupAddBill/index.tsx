import { forwardRef, useRef, useState, useEffect } from "react"
import { Icon, Input, Keyboard, Popup } from "zarm"

import s from "./style.module.less"
import cx from "classnames"
import dayjs from "dayjs"
import PopupDate from "../PopupDate"
import { get } from "@/utils"
import CustomIcon from "../CustomIcon"
import { typeMap } from "../../utils/index"

interface IPopupAddBillProps {}

const PopupAddBill = forwardRef((props: IPopupAddBillProps, ref) => {
  const [show, setShow] = useState(false)
  // 支出或收入类型
  const [payType, setPayType] = useState("expense")
  // 日期
  const [date, setDate] = useState(new Date())
  // 账单金额
  const [amount, setAmount] = useState("")
  // 当前选中账单类型
  const [currentType, setCurrentType] = useState<Record<string, any>>({})
  // 支出类型数组
  const [expense, setExpense] = useState([])
  // 收入类型数组
  const [income, setIncome] = useState([])
  // 备注
  const [remark, setRemark] = useState("")
  // 备注输入框展示控制
  const [showRemark, setShowRemark] = useState(false)

  const dateRef = useRef<HTMLElement & { show: () => void; close: () => void }>(
    null,
  )

  if (ref) {
    ;(ref as any).current = {
      show: () => setShow(true),
      close: () => setShow(false),
    }
  }

  useEffect(() => {
    get("/type/list").then((res) => {
      const { list } = res.data
      // 支出类型
      const _expense = list.filter((i: any) => i.type === "1")
      // 收入类型
      const _income = list.filter((i: any) => i.type === "2")

      setExpense(_expense)
      setIncome(_income)
      setCurrentType(_expense[0]) // 新建账单，类型默认是支出类型数组的第一项
    })
  }, [])

  // 切换收入/支出
  const changeType = (type: string) => setPayType(type)

  // 日期选择回调
  const selectDate = (val: Date) => setDate(val)

  // 监听输入框改变值
  const handleMoney = (value: string | undefined) => {
    if (value == null) return

    // 删除
    if (value === "delete") {
      const _amount = amount.slice(0, amount.length - 1)
      setAmount(_amount)
      return
    }

    // 确认
    if (value === "ok") {
      return
    }

    // 当输入的值为 "." 且已经存在 "." 则不让其继续字符串相加
    if (value === "." && amount.includes(".")) return

    // 小数点后保留两位，当超过两位时，不让其字符串继续相加
    if (
      value !== "." &&
      amount &&
      amount.includes(".") &&
      amount.split(".")[1].length >= 2
    )
      return

    setAmount(amount + value)
  }

  return (
    // @ts-ignore
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        {/* 右上角关闭弹窗 */}
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}>
            <Icon type="wrong" />
          </span>
        </header>

        {/* 收入/支出类型切换 */}
        <div className={s.filter}>
          <div className={s.type}>
            <span
              onClick={() => changeType("expense")}
              className={cx({
                [s.expense]: true,
                [s.active]: payType === "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeType("income")}
              className={cx({
                [s.income]: true,
                [s.active]: payType === "income",
              })}
            >
              收入
            </span>
          </div>

          <div className={s.time} onClick={() => dateRef?.current?.show()}>
            {dayjs(date).format("MM-DD")}
            <Icon className={s.arrow} type="arrow-bottom" />
          </div>
        </div>

        <div className={s.money}>
          <span className={s.sufix}>￥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>

        <div className={s.typeWrap}>
          <div className={s.typeBody}>
            {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
            {(payType === "expense" ? expense : income).map((item: any) => (
              <div
                onClick={() => setCurrentType(item)}
                key={item.id}
                className={s.typeItem}
              >
                {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                <span
                  className={cx({
                    [s.iconfontWrap]: true,
                    [s.expense]: payType === "expense",
                    [s.income]: payType === "income",
                    [s.active]: currentType.id === item.id,
                  })}
                >
                  <CustomIcon
                    className={s.iconfont}
                    type={typeMap[item.id].icon}
                  />
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.remark}>
          {showRemark ? (
            <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(val: string | undefined) => setRemark(val ?? "")}
              onBlur={() => setShowRemark(false)}
            />
          ) : (
            <span onClick={() => setShowRemark(true)}>
              {remark || "添加备注"}
            </span>
          )}
        </div>

        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />

        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  )
})

export default PopupAddBill
