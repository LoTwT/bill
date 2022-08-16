import { Icon, Pull } from "zarm"

import style from "./style.module.less"
import { useState, useEffect } from "react"
import BillItem from "@/components/BillItem"
import dayjs from "dayjs"
import { get, LOAD_STATE, REFRESH_STATE } from "@/utils"

function Home() {
  // 当前筛选时间
  const [currentTime, setCurrentTime] = useState(dayjs().format("YYYY-MM"))
  // 分页
  const [page, setPage] = useState(1)
  // 账单列表
  const [list, setList] = useState([])
  // 分页总数
  const [totalPage, setTotalPage] = useState(0)
  // 下拉刷新状态
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal)
  // 上拉加载状态
  const [loading, setLoading] = useState(LOAD_STATE.normal)

  useEffect(() => {
    // 初始化
    getBillList()
  }, [page])

  // 获取账单方法
  const getBillList = async () => {
    const { data } = await get(
      `/bill/list?page=${page}&page_size=5&date=${currentTime}`,
    )

    // 下拉刷新，重置数据
    if (page === 1) setList(data.list)
    else setList(list.concat(data.list))

    setTotalPage(data.totalPage)

    // 上滑加载状态
    setLoading(LOAD_STATE.success)
    setRefreshing(REFRESH_STATE.success)
  }

  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if (page != 1) setPage(1)
    else getBillList()
  }

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page + 1)
    }
  }

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

      <div className={style.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData,
            }}
          >
            {list.map((item, index) => (
              <BillItem bill={item} key={index} />
            ))}
          </Pull>
        ) : null}
      </div>
    </div>
  )
}

export default Home
