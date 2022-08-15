import { Button } from "zarm"
import style from "./style.module.less"

function Index() {
  return (
    <div className={style.index}>
      <span>样式</span>
      <Button theme="primary">按钮</Button>
    </div>
  )
}

export default Index
