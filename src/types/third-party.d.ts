// 第三方无类型 / 类型不完整的包,统一声明为 any 以满足 vue-tsc
// 这些模块在 SSR 不执行(仅 onMounted 内动态 import),运行时安全

declare module 'three' {
  const THREE: any
  export = THREE
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  const OrbitControls: any
  export { OrbitControls }
}

declare module 'three-spritetext' {
  const SpriteText: any
  export default SpriteText
}

declare module 'd3-force-3d' {
  const d3: any
  export = d3
}

declare module 'three/examples/jsm/postprocessing/EffectComposer.js' {
  const EffectComposer: any
  export default EffectComposer
}

declare module 'three/examples/jsm/postprocessing/RenderPass.js' {
  const RenderPass: any
  export default RenderPass
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass.js' {
  const UnrealBloomPass: any
  export default UnrealBloomPass
}

declare module 'three/examples/jsm/postprocessing/OutputPass.js' {
  const OutputPass: any
  export default OutputPass
}

declare module 'live2d-widget' {
  const L2Dwidget: any
  export default L2Dwidget
}
declare module 'live2d-widget/lib/css/live2d.css' {
  const css: string
  export default css
}
