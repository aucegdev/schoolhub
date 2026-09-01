import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface ThreeCanvasProps {
  variant?: "hero" | "globe" | "trophy";
  className?: string;
}

export default function ThreeCanvas({ variant = "hero", className = "" }: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x6366f1, 2.5);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xa855f7, 2, 10);
    pointLight.position.set(-3, 2, 2);
    scene.add(pointLight);

    // Objects Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    if (variant === "hero") {
      // 3D School Building Base & Roof
      const buildingGeo = new THREE.BoxGeometry(2.4, 1.6, 1.8);
      const buildingMat = new THREE.MeshStandardMaterial({
        color: 0x4f46e5,
        roughness: 0.3,
        metalness: 0.2,
      });
      const building = new THREE.Mesh(buildingGeo, buildingMat);
      building.position.y = 0;
      mainGroup.add(building);

      // Roof (Pyramid / Cone)
      const roofGeo = new THREE.ConeGeometry(2.0, 1.0, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.2 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 1.3;
      roof.rotation.y = Math.PI / 4;
      mainGroup.add(roof);

      // Pillars / Columns
      for (let x of [-0.8, -0.27, 0.27, 0.8]) {
        const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(x, -0.2, 0.95);
        mainGroup.add(pillar);
      }

      // Floating Educational Objects: 3D Graduation Cap & Floating Books
      const capGroup = new THREE.Group();
      const capTopGeo = new THREE.BoxGeometry(1.0, 0.05, 1.0);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.1 });
      const capTop = new THREE.Mesh(capTopGeo, capMat);
      capTop.rotation.z = 0.1;
      capGroup.add(capTop);

      const capBaseGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16);
      const capBase = new THREE.Mesh(capBaseGeo, capMat);
      capBase.position.y = -0.15;
      capGroup.add(capBase);

      capGroup.position.set(2.2, 1.5, 0.5);
      mainGroup.add(capGroup);

      // Floating Particle Stars
      const particleGeo = new THREE.BufferGeometry();
      const particleCount = 45;
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xc084fc,
        transparent: true,
        opacity: 0.8,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);
    } else if (variant === "globe") {
      // 3D Wireframe / Particle Globe
      const sphereGeo = new THREE.SphereGeometry(1.6, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });
      const globe = new THREE.Mesh(sphereGeo, sphereMat);
      mainGroup.add(globe);

      // Ring Orbit
      const ringGeo = new THREE.TorusGeometry(2.3, 0.04, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      mainGroup.add(ring);
    }

    // Mouse tilt interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      mainGroup.rotation.y = elapsedTime * 0.4 + mouseX * 0.3;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1 - mouseY * 0.2;

      // Floating hover motion for building & objects
      mainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Handle Resize
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
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  return <div ref={mountRef} className={`w-full h-full min-h-[300px] ${className}`} />;
}
