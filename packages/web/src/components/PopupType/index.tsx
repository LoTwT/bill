import { get } from "@/utils"
import cx from "classnames"
import { forwardRef, useState, useEffect } from "react"
import { Icon, Popup } from "zarm"

import s from "./style.module.less"

interface IPopupTypeProps {
  onSelect: (item: any) => void
}
// forwardRef 用于拿到父组件传入的 ref 属性，可以在父组件通过 ref 控制子组件
const PopupType = forwardRef((props: IPopupTypeProps, ref) => {
  const { onSelect } = props

  // 组件的显隐
  const [show, setShow] = useState(false)
  // 激活的 type
  const [active, setActive] = useState("all")
  // 支出标签类型
  const [expense, setExpense] = useState([])
  // 收入标签类型
  const [income, setIncome] = useState([])

  useEffect(() => {
    // 请求标签接口放在弹窗内，这个弹窗可能会被复用，请求放在外面，会造成代码冗余
    get("/type/list").then((res: any) => {
      const { list } = res.data
      setExpense(list.filter((i: any) => i.type === "1"))
      setIncome(list.filter((i: any) => i.type === "2"))
    })
  }, [])

  if (ref) {
    ;(ref as any).current = {
      // 外部可以通过 ref.current.show 来控制组件显示
      show: () => setShow(true),
      // 外部可以通过 ref.current.close 来控制组件隐藏
      close: () => setShow(false),
    }
  }

  // 选择类型回调
  const choseType = (item: any) => {
    setActive(item.id)
    setShow(false)
    // 父组件传入的 onSelect ，获取类型
    onSelect(item)
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
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon
            type="wrong"
            className={s.cross}
            onClick={() => setShow(false)}
          />
        </div>

        <div className={s.content}>
          <div
            onClick={() => choseType({ id: "all" })}
            className={cx({ [s.all]: true, [s.active]: active === "all" })}
          >
            全部类型
          </div>

          <div className={s.title}>支出</div>

          <div className={s.expenseWrap}>
            {expense.map((item: any, index: number) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={cx({ [s.active]: active === item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>

          <div className={s.title}>收入</div>

          <div className={s.incomeWrap}>
            {income.map((item: any, index) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={cx({ [s.active]: active === item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  )
})

export default PopupType
