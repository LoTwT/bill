import { Icon } from "zarm"

import style from "./style.module.less"

function Home() {
  return (
    <div className={style.home}>
      <div className={style.header}>
        <div className={style.dataWrap}>
          <div className={style.expense}>
            总支出：<b>￥ 200</b>
          </div>
          <div className={style.income}>
            总收入：<b>￥ 500</b>
          </div>
        </div>

        <div className={style.typeWrap}>
          <div className={style.left}>
            <span className={style.title}>
              类型 <Icon className={style.arrow} type="arrow-bottom" />
            </span>
          </div>

          <div className={style.right}>
            <span className={style.time}>
              2022-06 <Icon className={style.arrow} type="arrow-bottom" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
