import { forwardRef, useState } from "react"
import { Popup } from "zarm"

interface IPopupAddBillProps {}

const PopupAddBill = forwardRef((props: IPopupAddBillProps, ref) => {
  const [show, setShow] = useState(false)

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
      <div style={{ height: 200, background: "#fff" }}>弹窗</div>
    </Popup>
  )
})

export default PopupAddBill
