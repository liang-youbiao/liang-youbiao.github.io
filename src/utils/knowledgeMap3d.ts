import type { KnowledgeNote } from '@/types/content'

// 第三方包无 .d.ts,运行时实际类型完整,此处 any 仅用于通过 vue-tsc
type AnyFn = (...args: any[]) => any

const DOMAIN_COLORS: Record<string, string> = {
  thinking: '#7c3aed',
  learning: '#2563eb',
  execution: '#0891b2',
  training: '#ea580c',
}

const DIFFICULTY_SIZE: Record<string, number> = {
  beginner: 7,
  intermediate: 9,
  advanced: 11,
}

interface GraphNode {
  id: string
  title: string
  domain: string
  difficulty?: string
  status?: string
  color: string
  size: number
  url: string
  connections: string[]
  x?: number
  y?: number
  z?: number
}

interface GraphLink {
  source: string | GraphNode
  target: string | GraphNode
}

export function buildGraph(notes: KnowledgeNote[]): { nodes: GraphNode[]; links: GraphLink[] } {
  const ids = new Set(notes.map((n) => n.slug))
  const nodes: GraphNode[] = notes.map((n) => ({
    id: n.slug,
    title: n.title,
    domain: n.domain,
    difficulty: n.difficulty,
    status: n.status,
    color: DOMAIN_COLORS[n.domain] || '#64748b',
    size: DIFFICULTY_SIZE[n.difficulty || 'beginner'] || 8,
    url: n.url,
    connections: n.connections || [],
  }))

  const linkSet = new Set<string>()
  const links: GraphLink[] = []
  for (const n of nodes) {
    for (const c of n.connections) {
      if (!ids.has(c)) continue
      const key = [n.id, c].sort().join('|')
      if (linkSet.has(key)) continue
      linkSet.add(key)
      links.push({ source: n.id, target: c })
    }
  }

  return { nodes, links }
}

/* ===== 特效辅助 ===== */

// 星空粒子背景(大球壳散布)
function createStarField(THREE: any, count = 1500) {
  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 600 + Math.random() * 400
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.0,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  })
  return new THREE.Points(geo, mat)
}

// 域色光晕(每个 domain 一个 SphereGeometry,半透明 additive)
function createDomainHalos(THREE: any, domains: string[]) {
  const halos: { domain: string; mesh: any }[] = []
  for (const domain of domains) {
    const color = new THREE.Color(DOMAIN_COLORS[domain] || '#64748b')
    const geo = new THREE.SphereGeometry(35, 32, 32)
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geo, mat)
    halos.push({ domain, mesh })
  }
  return halos
}

export function initScene(
  container: HTMLElement,
  notes: KnowledgeNote[],
  THREE: any,
  OrbitControls: any,
  SpriteText: any,
  onClickNode: (note: KnowledgeNote) => void,
): () => void {
  const { nodes, links } = buildGraph(notes)
  const W = container.clientWidth || 800
  const H = container.clientHeight || 480

  const scene = new THREE.Scene()
  // 深色背景(适配星空)
  scene.background = new THREE.Color('#0b1220')
  scene.fog = new THREE.Fog('#0b1220', 200, 800)

  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000)
  camera.position.set(0, 60, 180)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(W, H)
  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 40
  controls.maxDistance = 400
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.4

  // 灯光(柔和)
  const ambient = new THREE.AmbientLight(0xffffff, 0.85)
  scene.add(ambient)
  const directional = new THREE.DirectionalLight(0xffffff, 0.4)
  directional.position.set(100, 200, 100)
  scene.add(directional)

  // 星空粒子背景
  const stars = createStarField(THREE, 1500)
  scene.add(stars)

  // 节点 mesh + label
  const nodeMeshes: any[] = []
  let composer: any = null
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const color = new THREE.Color(node.color)
    const geo = new THREE.SphereGeometry(node.size, 32, 32)
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.4,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 1,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.userData = { slug: node.id, url: node.url, title: node.title, domain: node.domain, difficulty: node.difficulty, status: node.status, content: '' } as KnowledgeNote
    mesh.userData.phase = i * 0.7 // 呼吸相位差
    scene.add(mesh)
    nodeMeshes.push(mesh)

    const label = new SpriteText(node.title, {
      fontSize: Math.max(7, node.size * 0.7),
      color: '#e2e8f0',
      background: false,
    } as any)
    label.position.set(0, node.size + 6, 0)
    mesh.add(label)
  }

  // 连线:每条 link 独立 Line + CatmullRomCurve3 平滑样条(共享 LineDashedMaterial)
  const linkMat = new THREE.LineDashedMaterial({
    color: 0x94a3b8,
    dashSize: 3,
    gapSize: 1.5,
    transparent: true,
    opacity: 0.75,
  })
  const SAMPLE = 28
  const linkLines: { line: any; curve: any; getStart: () => any; getEnd: () => any }[] = []
  for (const link of links) {
    const start = typeof link.source === 'object' ? link.source : nodes.find((n) => n.id === link.source)!
    const end = typeof link.target === 'object' ? link.target : nodes.find((n) => n.id === link.target)!
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(start.x || 0, start.y || 0, start.z || 0),
      new THREE.Vector3(0, 0, 0), // 占位,animate 中更新
      new THREE.Vector3(end.x || 0, end.y || 0, end.z || 0),
    ], false, 'catmullrom', 0.5)
    const pts = curve.getPoints(SAMPLE)
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const line = new THREE.Line(geo, linkMat)
    line.computeLineDistances()
    scene.add(line)
    linkLines.push({ line, curve, getStart: () => (typeof link.source === 'object' ? link.source : nodes.find((n) => n.id === link.source)!), getEnd: () => (typeof link.target === 'object' ? link.target : nodes.find((n) => n.id === link.target)!) })
  }

  // 域色光晕(每域一个)
  const domainSet = new Set(nodes.map((n) => n.domain))
  const halos = createDomainHalos(THREE, [...domainSet])
  for (const h of halos) scene.add(h.mesh)

  // 初始随机位置
  for (const n of nodes) {
    n.x = (Math.random() - 0.5) * 200
    n.y = (Math.random() - 0.5) * 200
    n.z = (Math.random() - 0.5) * 200
  }

  // 关联索引(快速查邻居)
  const neighborMap = new Map<string, Set<string>>()
  for (const n of nodes) neighborMap.set(n.id, new Set(n.connections))
  for (const link of links) {
    const s = typeof link.source === 'object' ? link.source.id : link.source
    const t = typeof link.target === 'object' ? link.target.id : link.target
    neighborMap.get(s)?.add(t)
    neighborMap.get(t)?.add(s)
  }

  // Raycaster 交互 + focus 模式
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let hoveredId: string | null = null

  function clearFocus() {
    hoveredId = null
    for (const mesh of nodeMeshes) {
      mesh.material.opacity = 1
      mesh.material.emissiveIntensity = 0.4
    }
    linkMat.opacity = 0.7
  }

  function setFocus(id: string | null) {
    if (!id) {
      clearFocus()
      return
    }
    hoveredId = id
    const neighbors = neighborMap.get(id) || new Set()
    for (const mesh of nodeMeshes) {
      const isSelf = mesh.userData.slug === id
      const isNeighbor = neighbors.has(mesh.userData.slug)
      if (isSelf) {
        mesh.material.opacity = 1
        mesh.material.emissiveIntensity = 1.0
      } else if (isNeighbor) {
        mesh.material.opacity = 0.85
        mesh.material.emissiveIntensity = 0.7
      } else {
        mesh.material.opacity = 0.18
        mesh.material.emissiveIntensity = 0.15
      }
    }
    linkMat.opacity = 0.35
  }

  function onPointerMove(e: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(nodeMeshes)
    if (intersects.length > 0) {
      const id = intersects[0].object.userData.slug
      if (id !== hoveredId) setFocus(id)
      renderer.domElement.style.cursor = 'pointer'
    } else {
      if (hoveredId !== null) clearFocus()
      renderer.domElement.style.cursor = 'grab'
    }
  }

  function onClick(e: MouseEvent) {
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(nodeMeshes)
    if (intersects.length > 0) {
      const userData = intersects[0].object.userData as KnowledgeNote
      onClickNode(userData)
    }
  }

  function onResize() {
    const w = container.clientWidth
    const h = container.clientHeight
    if (w === 0 || h === 0) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    composer?.setSize(w, h)
  }

  window.addEventListener('resize', onResize)
  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('click', onClick)
  renderer.domElement.style.cursor = 'grab'

  // 主循环
  let animId = 0
  let dashOffset = 0
  const breathBase = performance.now() / 1000
  function animate() {
    animId = requestAnimationFrame(animate)
    const t = (performance.now() / 1000) - breathBase

    controls.update()

    // 节点呼吸 + 跟随
    for (let i = 0; i < nodeMeshes.length; i++) {
      const mesh = nodeMeshes[i]
      const n = nodes[i]
      mesh.position.set(n.x || 0, n.y || 0, n.z || 0)
      if (hoveredId === null) {
        const phase = mesh.userData.phase
        const breath = 1 + Math.sin(t * 1.2 + phase) * 0.04
        mesh.scale.setScalar(breath)
        mesh.material.emissiveIntensity = 0.35 + Math.sin(t * 1.0 + phase) * 0.15
      }
    }

    // 连线流动(dashed offset)
    dashOffset -= 0.018
    linkMat.dashOffset = dashOffset

    // 连线位置更新(CatmullRomCurve3 平滑样条:起点、中点向外偏移、终点)
    for (let i = 0; i < linkLines.length; i++) {
      const obj = linkLines[i]
      const start = obj.getStart()
      const end = obj.getEnd()
      const sx = start.x || 0, sy = start.y || 0, sz = start.z || 0
      const ex = end.x || 0, ey = end.y || 0, ez = end.z || 0
      const mx = (sx + ex) / 2, my = (sy + ey) / 2, mz = (sz + ez) / 2
      const len = Math.sqrt(mx * mx + my * my + mz * mz) || 1
      const arc = 12
      obj.curve.points[0].set(sx, sy, sz)
      obj.curve.points[1].set(mx + (mx / len) * arc, my + (my / len) * arc, mz + (mz / len) * arc)
      obj.curve.points[2].set(ex, ey, ez)
      const newPts = obj.curve.getPoints(SAMPLE)
      obj.line.geometry.setFromPoints(newPts)
      obj.line.geometry.computeBoundingSphere()
      obj.line.computeLineDistances()
    }

    // 星空缓慢旋转
    stars.rotation.y += 0.00008

    // 域色光晕跟随聚类中心
    const sumByDomain = new Map<string, { x: number; y: number; z: number; n: number }>()
    for (const n of nodes) {
      const acc = sumByDomain.get(n.domain) || { x: 0, y: 0, z: 0, n: 0 }
      acc.x += n.x || 0
      acc.y += n.y || 0
      acc.z += n.z || 0
      acc.n += 1
      sumByDomain.set(n.domain, acc)
    }
    for (const h of halos) {
      const acc = sumByDomain.get(h.domain)
      if (!acc) continue
      h.mesh.position.set(acc.x / acc.n, acc.y / acc.n, acc.z / acc.n)
      h.mesh.rotation.y += 0.001
    }

    if (composer) composer.render()
    else renderer.render(scene, camera)
  }
  animate()

  // d3-force-3d 力导向
  ;(async () => {
    try {
      const d3 = await import('d3-force-3d')
      const sim = (d3 as any).forceSimulation(nodes as any)
        .force('charge', (d3 as any).forceManyBody().strength(-280))
        .force('link', (d3 as any).forceLink(links).id((d: any) => d.id).distance(60).strength(0.45))
        .force('center', (d3 as any).forceCenter(0, 0, 0))
        .alphaDecay(0.025)
      for (let i = 0; i < 220; i++) sim.tick()
    } catch (e) {
      console.warn('[KnowledgeMap3D] d3-force-3d failed, keeping random layout:', e)
    }
  })()

  // Bloom 后期处理(异步初始化)
  ;(async () => {
    try {
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js')
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
      const { OutputPass } = await import('three/examples/jsm/postprocessing/OutputPass.js')
      composer = new EffectComposer(renderer)
      composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      composer.setSize(W, H)
      composer.addPass(new RenderPass(scene, camera))
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(W, H), 0.85, 0.6, 0.55)
      composer.addPass(bloomPass)
      composer.addPass(new OutputPass())
    } catch (e) {
      console.warn('[KnowledgeMap3D] Bloom init failed:', e)
    }
  })()

  // 清理
  return function dispose() {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', onResize)
    renderer.domElement.removeEventListener('pointermove', onPointerMove)
    renderer.domElement.removeEventListener('click', onClick)
    controls.dispose()
    composer?.dispose()
    scene.traverse((obj: any) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose())
        else obj.material.dispose()
      }
    })
    renderer.dispose()
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement)
    }
  }
}