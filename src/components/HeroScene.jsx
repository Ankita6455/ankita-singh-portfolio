import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroScene component - Renders an interactive Three.js 3D signal core with
 * glowing geometric shell, inner particle field, orbital ring, drag interaction,
 * mouse parallax, viewport visibility pause, and comprehensive resource cleanup.
 */
export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 7;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Root 3D Group
    const group = new THREE.Group();

    // 1. Outer Shell: Edges of Icosahedron in signal orange
    const outerBaseGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const outerEdgesGeo = new THREE.EdgesGeometry(outerBaseGeo);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: prefersReducedMotion ? 0.9 : 0,
    });
    const outerMesh = new THREE.LineSegments(outerEdgesGeo, outerMat);
    group.add(outerMesh);

    // 2. Inner Core: Points of dense Icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(1.15, 4);
    const innerMat = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    });
    const innerPoints = new THREE.Points(innerGeo, innerMat);
    group.add(innerPoints);

    // 3. Orbit Ring: Tilted EllipseCurve LineLoop
    const ellipseCurve = new THREE.EllipseCurve(0, 0, 2.7, 2.7, 0, 2 * Math.PI, false, 0);
    const ringPoints = ellipseCurve.getPoints(128);
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    });
    const orbitRing = new THREE.LineLoop(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2.4;
    group.add(orbitRing);

    scene.add(group);

    // Initial scale
    if (prefersReducedMotion) {
      group.scale.set(1, 1, 1);
    } else {
      group.scale.set(0.6, 0.6, 0.6);
    }

    // Interaction variables
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let dragRotationX = 0;
    let dragRotationY = 0;
    let autoSpinY = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    const startTime = performance.now();

    // Mouse tilt tracking
    const handlePointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseTargetY = normX * 0.4;
      mouseTargetX = normY * 0.25;

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        dragRotationY += deltaX * 0.01;
        dragRotationX += deltaY * 0.01;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      }
    };

    // Drag start
    const handlePointerDown = (e) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    // Drag end
    const handlePointerUp = () => {
      isDragging = false;
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    // Window / container resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation loop & off-screen pausing via IntersectionObserver
    let animationFrameId = null;
    let isVisible = true;

    const animate = () => {
      if (!isVisible) return;

      const now = performance.now();

      if (!prefersReducedMotion) {
        // Intro materialization over 1 second
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / 1000, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentScale = 0.6 + 0.4 * easeOut;
        group.scale.set(currentScale, currentScale, currentScale);
        outerMat.opacity = 0.9 * easeOut;

        // Auto spin
        autoSpinY += 0.0025;

        // Inner core rotates the opposite way
        innerPoints.rotation.y = -now * 0.001 * 0.15;
      }

      // Smooth easing toward combined target rotation (mouse tilt + drag + auto-spin)
      const targetY = mouseTargetY + dragRotationY + autoSpinY;
      const targetX = mouseTargetX + dragRotationX;

      group.rotation.y += (targetY - group.rotation.y) * 0.06;
      group.rotation.x += (targetX - group.rotation.x) * 0.06;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Start rendering loop
    animationFrameId = requestAnimationFrame(animate);

    // Comprehensive cleanup on unmount
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('pointerdown', handlePointerDown);

      outerBaseGeo.dispose();
      outerEdgesGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();

      renderer.dispose();
      renderer.forceContextLoss();

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
      className="h-full w-full cursor-grab active:cursor-grabbing relative overflow-hidden"
    />
  );
}

