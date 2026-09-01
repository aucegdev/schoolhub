import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeSchoolWorld() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // Scene setup with subtle fog for depth
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.05);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic Vibrant Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 4, 15);
    cyanLight.position.set(-4, 4, 4);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xec4899, 4, 15);
    magentaLight.position.set(4, -2, 4);
    scene.add(magentaLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 3, 12);
    goldLight.position.set(0, 5, -2);
    scene.add(goldLight);

    // Root Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Central 3D School Citadel / Main Building
    const baseGeo = new THREE.BoxGeometry(2.6, 1.8, 2.0);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.2,
      metalness: 0.4,
    });
    const buildingBase = new THREE.Mesh(baseGeo, baseMat);
    worldGroup.add(buildingBase);

    // Grand Dome Roof
    const domeGeo = new THREE.SphereGeometry(1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.1,
      metalness: 0.6,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.9;
    worldGroup.add(dome);

    // Golden Spire Flag Base
    const spireGeo = new THREE.CylinderGeometry(0.04, 0.08, 1.2, 16);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.1 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = 2.4;
    worldGroup.add(spire);

    // Waving Banner Flag
    const flagGeo = new THREE.BoxGeometry(0.6, 0.35, 0.02);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.3, 2.8, 0);
    worldGroup.add(flag);

    // 2. Floating 3D Graduation Cap (Left Orbit)
    const capGroup = new THREE.Group();
    const capTopGeo = new THREE.BoxGeometry(1.2, 0.06, 1.2);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.5, roughness: 0.2 });
    const capTop = new THREE.Mesh(capTopGeo, capMat);
    capGroup.add(capTop);

    const capBaseGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.35, 16);
    const capBase = new THREE.Mesh(capBaseGeo, capMat);
    capBase.position.y = -0.18;
    capGroup.add(capBase);

    // Tassel Button & Cord
    const buttonGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const button = new THREE.Mesh(buttonGeo, buttonMat);
    button.position.y = 0.05;
    capGroup.add(button);

    capGroup.position.set(-2.8, 1.4, 1.0);
    worldGroup.add(capGroup);

    // 3. Floating 3D Book (Right Orbit)
    const bookGroup = new THREE.Group();
    const coverGeo = new THREE.BoxGeometry(0.9, 1.2, 0.18);
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });
    const cover = new THREE.Mesh(coverGeo, coverMat);
    bookGroup.add(cover);

    const pagesGeo = new THREE.BoxGeometry(0.82, 1.12, 0.14);
    const pagesMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const pages = new THREE.Mesh(pagesGeo, pagesMat);
    pages.position.x = 0.02;
    bookGroup.add(pages);

    bookGroup.position.set(2.8, -0.6, 1.2);
    worldGroup.add(bookGroup);

    // 4. Floating 3D Globe with Rings
    const globeGeo = new THREE.SphereGeometry(0.65, 24, 24);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      wireframe: true,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(2.5, 1.8, -1.0);
    worldGroup.add(globe);

    const orbitRingGeo = new THREE.TorusGeometry(0.95, 0.03, 16, 60);
    const orbitRingMat = new THREE.MeshStandardMaterial({ color: 0xa855f7 });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 3;
    globe.add(orbitRing);

    // 5. Sparkling Glowing Particle Stars Field
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x6366f1),
      new THREE.Color(0xec4899),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0xf59e0b),
    ];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 12;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 10;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const c = palette[i % palette.length];
      colorsArray[i * 3] = c.r;
      colorsArray[i * 3 + 1] = c.g;
      colorsArray[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Cursor Movement Modulation
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      const t = clock.getElapsedTime();

      // World Group Motion
      worldGroup.rotation.y = t * 0.35 + mouseX * 0.25;
      worldGroup.rotation.x = Math.sin(t * 0.4) * 0.08 - mouseY * 0.15;
      worldGroup.position.y = Math.sin(t * 1.2) * 0.12;

      // Graduation Cap Orbit & Rotation
      capGroup.rotation.y = t * 0.8;
      capGroup.rotation.z = Math.sin(t * 1.5) * 0.2;
      capGroup.position.y = 1.4 + Math.sin(t * 2) * 0.2;

      // Book Orbit & Rotation
      bookGroup.rotation.y = -t * 0.7;
      bookGroup.rotation.x = Math.cos(t * 1.2) * 0.25;
      bookGroup.position.y = -0.6 + Math.cos(t * 1.8) * 0.18;

      // Globe Orbit & Ring Spin
      globe.rotation.y = t * 0.9;
      orbitRing.rotation.z = t * 1.2;

      // Flag Motion Waving
      flag.rotation.y = Math.sin(t * 4) * 0.15;

      // Particle Field Floating
      particleSystem.rotation.y = t * 0.08;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full min-h-[380px] rounded-3xl overflow-hidden" />;
}
