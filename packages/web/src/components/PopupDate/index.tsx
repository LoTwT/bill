import { forwardRef, useState } from "react"
import dayjs from "dayjs"

import s from "./style.module.less"
import { DatePicker, Popup } from "zarm"

interface IPopupDateProps {
  onSelect: (item: any) => void
  mode?: string
}

const PopupDate = forwardRef((props: IPopupDateProps, ref) => {
  const { onSelect, mode = "date" } = props

  const [show, setShow] = useState(false)
  const [now, setNow] = useState(new Date())

  const choseMonth = (item: any) => {
    setNow(item)
    setShow(false)

    if (mode === "month") onSelect(dayjs(item).format("YYYY-MM"))
    else if (mode === "date") onSelect(dayjs(item).format("YYYY-MM-DD"))
  }

  if (ref) {
    ;(ref as any).current = {
      show: () => setShow(true),
      close: () => setShow(false),
    }
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
      <div>
        <DatePicker
          visible={show}
          value={now}
          mode={mode}
          onOk={choseMonth}
          onCancel={() => setShow(false)}
        />
      </div>
    </Popup>
  )
})

export default PopupDate
