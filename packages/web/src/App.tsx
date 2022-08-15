import { BrowserRouter, Routes, Route } from "react-router-dom"
import routes from "@/router"

import { ConfigProvider } from "zarm"
import NavBar from "./components/NavBar"

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

      {/* 导航栏 */}
      <NavBar showNav />
    </BrowserRouter>
  )
}

export default App
