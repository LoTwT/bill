import { BrowserRouter, Routes, Route } from "react-router-dom"
import routes from "./router/index"

import { ConfigProvider } from "zarm"
import "zarm/dist/zarm.css"

function App() {
  return (
    <BrowserRouter>
      {/* @ts-ignore */}
      <ConfigProvider primaryColor={"#007fff"}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App
