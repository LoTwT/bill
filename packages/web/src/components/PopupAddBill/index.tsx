import { forwardRef, useRef, useState } from "react"
import { Icon, Popup } from "zarm"

import s from "./style.module.less"
import cx from "classnames"
import dayjs from "dayjs"
import PopupDate from "../PopupDate"

interface IPopupAddBillProps {}

const PopupAddBill = forwardRef((props: IPopupAddBillProps, ref) => {
  const [show, setShow] = useState(false)
  // 支出或收入类型
  const [payType, setPayType] = useState("expense")
  // 日期
  const [date, setDate] = useState(new Date())

  const dateRef = useRef<HTMLElement & { show: () => void; close: () => void }>(
    null,
  )

  if (ref) {
    ;(ref as any).current = {
      show: () => setShow(true),
      close: () => setShow(false),
    }
  }

  // 切换收入/支出
  const changeType = (type: string) => setPayType(type)

  // 日期选择回调
  const selectDate = (val: Date) => setDate(val)

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

        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  )
})

export default PopupAddBill
