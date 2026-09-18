import type { KnowledgeNote } from '@/types/content'

// any 是有意为之:第三方包无 .d.ts,运行时实际类型完整,此处仅为通过 vue-tsc
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
  scene.background = new THREE.Color('#f8fafc')

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

  const ambient = new THREE.AmbientLight(0xffffff, 0.85)
  scene.add(ambient)
  const directional = new THREE.DirectionalLight(0xffffff, 0.4)
  directional.position.set(100, 200, 100)
  scene.add(directional)

  const nodeMeshes: any[] = []
  for (const node of nodes) {
    const color = new THREE.Color(node.color)
    const geo = new THREE.SphereGeometry(node.size, 32, 32)
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.35,
      roughness: 0.4,
      metalness: 0.1,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.userData = { slug: node.id, url: node.url, title: node.title, domain: node.domain, difficulty: node.difficulty, status: node.status, content: '' } as KnowledgeNote
    scene.add(mesh)
    nodeMeshes.push(mesh)

    const label = new SpriteText(node.title, {
      fontSize: Math.max(7, node.size * 0.7),
      color: '#1e293b',
      background: false,
    } as any)
    label.position.set(0, node.size + 6, 0)
    mesh.add(label)
  }

  // 连线
  const linkPositions = new Float32Array(links.length * 2 * 3)
  const linkGeo = new THREE.BufferGeometry()
  linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3))
  const linkMat = new THREE.LineBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.55 })
  const linkLines = new THREE.LineSegments(linkGeo, linkMat)
  scene.add(linkLines)

  // 初始随机位置
  for (const n of nodes) {
    n.x = (Math.random() - 0.5) * 200
    n.y = (Math.random() - 0.5) * 200
    n.z = (Math.random() - 0.5) * 200
  }

  // Raycaster 节点交互
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let hoveredMesh: any = null

  function setHover(mesh: any | null) {
    if (hoveredMesh && hoveredMesh.material) {
      hoveredMesh.material.emissiveIntensity = 0.35
      hoveredMesh.scale.set(1, 1, 1)
    }
    hoveredMesh = mesh
    if (mesh && mesh.material) {
      mesh.material.emissiveIntensity = 0.85
      mesh.scale.set(1.15, 1.15, 1.15)
      renderer.domElement.style.cursor = 'pointer'
    } else {
      renderer.domElement.style.cursor = 'grab'
    }
  }

  function onPointerMove(e: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(nodeMeshes)
    setHover(intersects.length > 0 ? intersects[0].object : null)
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
  }

  window.addEventListener('resize', onResize)
  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('click', onClick)
  renderer.domElement.style.cursor = 'grab'

  // 主循环
  let animId = 0
  function animate() {
    animId = requestAnimationFrame(animate)
    controls.update()

    for (let i = 0; i < nodeMeshes.length; i++) {
      const mesh = nodeMeshes[i]
      const n = nodes[i]
      mesh.position.set(n.x || 0, n.y || 0, n.z || 0)
    }

    const pos = linkGeo.attributes.position.array as Float32Array
    for (let i = 0; i < links.length; i++) {
      const link = links[i]
      const source = typeof link.source === 'object' ? link.source : nodes.find((n) => n.id === link.source)
      const target = typeof link.target === 'object' ? link.target : nodes.find((n) => n.id === link.target)
      if (!source || !target) continue
      const i3 = i * 6
      pos[i3] = source.x || 0
      pos[i3 + 1] = source.y || 0
      pos[i3 + 2] = source.z || 0
      pos[i3 + 3] = target.x || 0
      pos[i3 + 4] = target.y || 0
      pos[i3 + 5] = target.z || 0
    }
    linkGeo.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }
  animate()

  // d3-force-3d 力导向(异步,稳定后接管节点位置)
  ;(async () => {
    try {
      const d3 = await import('d3-force-3d')
      const sim = (d3 as any).forceSimulation(nodes as any)
        .force('charge', (d3 as any).forceManyBody().strength(-260))
        .force('link', (d3 as any).forceLink(links).id((d: any) => d.id).distance(55).strength(0.5))
        .force('center', (d3 as any).forceCenter(0, 0, 0))
        .alphaDecay(0.025)
      // 让 simulation 自己驱动节点位置(animate 已经读 nodes[i].x/y/z)
      sim.on('tick', () => {})
      // 前 200 步手动跑(快速稳定)
      for (let i = 0; i < 200; i++) sim.tick()
    } catch (e) {
      console.warn('[KnowledgeMap3D] d3-force-3d failed, keeping random layout:', e)
    }
  })()

  return function dispose() {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', onResize)
    renderer.domElement.removeEventListener('pointermove', onPointerMove)
    renderer.domElement.removeEventListener('click', onClick)
    controls.dispose()
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