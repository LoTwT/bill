import s from "./style.module.less"
import { useNavigate } from "react-router-dom"
import { Icon, NavBar } from "zarm"

interface IHeaderProps {
  title?: string
}

function Header(props: IHeaderProps) {
  const { title = "" } = props

  const navigate = useNavigate()

  return (
    <div className={s.headerWrap}>
      <div className={s.block}>
        <NavBar
          className={s.header}
          left={
            <Icon
              type="arrow-left"
              theme="primary"
              onClick={() => navigate(-1)}
            />
          }
          title={title}
        />
      </div>
    </div>
  )
}

export default Header
