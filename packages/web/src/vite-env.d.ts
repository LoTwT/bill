/// <reference types="vite/client" />

interface Window {
  echarts: any
}

declare module "rc-form" {
  const rcForm: any
  export default rcForm

  const createForm: any
  export { createForm }
}
