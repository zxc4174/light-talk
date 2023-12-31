import Chrome from "chrome"

// import * as WebExtensionPolyfill from 'webextension-polyfill'

// declare global {
//   const browser: typeof WebExtensionPolyfill
// }

declare namespace chrome {
  export default Chrome
}

declare module "*.svg" {
  import React = require("react")
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module "*.jpg" {
  const content: string
  export default content
}

declare module "*.png" {
  const content: string
  export default content
}

declare module "*.json" {
  const content: string
  export default content
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}