import { useEffect, useRef } from 'react';
import p5 from 'p5';
import * as Tone from 'tone';
import { moriiData } from '@/data/moriiData';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  color: p5.Color;
  ageGroup: 'student' | 'middle' | 'older';
  alpha: number;
  fadeRate: number;
  stainShape: { x: number; y: number }[]; // Irregular coffee stain shape
  rotation: number;
  rotationSpeed: number;
}

interface WifiVisualizationProps {
  mode: 'interactive' | 'cinematic';
  dayIndex?: number;
  onNodeCountChange?: (count: number) => void;
  onConnectionCountChange?: (count: number) => void;
}

export default function WifiVisualization({ mode, dayIndex: propDayIndex, onNodeCountChange, onConnectionCountChange }: WifiVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const synthsRef = useRef<{ [key: string]: Tone.Synth }>({});
  const audioInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let nodes: Node[] = [];
      let time = 0;
      let dayIndex = propDayIndex !== undefined ? propDayIndex : 0;
      const dayDuration = mode === 'cinematic' ? 400 : 600;
      let showOverlayText = true;
      
      // Color palette - distinct and vibrant
      const studentColor = { h: 25, s: 75, b: 65 }; // Warm amber/orange
      const middleAgeColor = { h: 45, s: 60, b: 55 }; // Golden brown
      const olderColor = { h: 200, s: 55, b: 60 }; // Cool blue

      // Initialize audio
      const initAudio = async () => {
        if (audioInitialized.current) return;
        await Tone.start();
        
        // Create synths for different collision types
        synthsRef.current = {
          sameColor: new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.05, decay: 0.3, sustain: 0.1, release: 0.5 }
          }).toDestination(),
          differentColor: new Tone.Synth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.08, decay: 0.4, sustain: 0.15, release: 0.7 }
          }).toDestination()
        };
        
        synthsRef.current.sameColor.volume.value = -15;
        synthsRef.current.differentColor.volume.value = -12;
        
        audioInitialized.current = true;
      };

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.frameRate(30);
        initializeNodes();
        console.log('P5 setup complete, nodes:', nodes.length);
        initAudio();
      };

      const createStainShape = (size: number): { x: number; y: number }[] => {
        const points: { x: number; y: number }[] = [];
        const numPoints = 20;
        
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * p.TWO_PI;
          const radiusVariation = p.random(0.7, 1.3);
          const noiseOffset = p.noise(i * 0.5) * 0.3;
          const radius = (size / 2) * radiusVariation + noiseOffset * size;
          
          points.push({
            x: p.cos(angle) * radius,
            y: p.sin(angle) * radius
          });
        }
        
        return points;
      };

      const initializeNodes = () => {
        nodes = [];
        const currentDay = moriiData[dayIndex];
        const totalPeople = currentDay.students + currentDay.middleAge + currentDay.older;
        
        for (let i = 0; i < currentDay.students; i++) {
          nodes.push(createNode(studentColor, totalPeople, 'student'));
        }
        
        for (let i = 0; i < currentDay.middleAge; i++) {
          nodes.push(createNode(middleAgeColor, totalPeople, 'middle'));
        }
        
        for (let i = 0; i < currentDay.older; i++) {
          nodes.push(createNode(olderColor, totalPeople, 'older'));
        }
      };

      const createNode = (
        colorData: { h: number; s: number; b: number }, 
        totalPeople: number, 
        ageGroup: 'student' | 'middle' | 'older'
      ): Node => {
        const margin = 100;
        const baseSize = p.map(totalPeople, 10, 40, 25, 50);
        
        return {
          x: p.random(margin, p.width - margin),
          y: p.random(margin, p.height - margin),
          vx: p.random(-1.5, 1.5),
          vy: p.random(-1.5, 1.5),
          size: baseSize,
          baseSize: baseSize,
          color: p.color(colorData.h, colorData.s, colorData.b),
          ageGroup: ageGroup,
          alpha: 1,
          fadeRate: p.random(0.001, 0.003),
          stainShape: createStainShape(baseSize),
          rotation: p.random(p.TWO_PI),
          rotationSpeed: p.random(-0.01, 0.01)
        };
      };

      const checkCollision = (node1: Node, node2: Node): boolean => {
        const d = p.dist(node1.x, node1.y, node2.x, node2.y);
        return d < (node1.size + node2.size) / 2;
      };

      const handleCollision = (node1: Node, node2: Node) => {
        // Calculate collision response
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;
        
        // Normalize
        const nx = dx / distance;
        const ny = dy / distance;
        
        // Relative velocity
        const dvx = node2.vx - node1.vx;
        const dvy = node2.vy - node1.vy;
        
        // Relative velocity in collision normal direction
        const dvn = dvx * nx + dvy * ny;
        
        // Don't resolve if velocities are separating
        if (dvn > 0) return;
        
        // Collision impulse
        const impulse = -1.5 * dvn;
        
        // Update velocities
        node1.vx -= impulse * nx;
        node1.vy -= impulse * ny;
        node2.vx += impulse * nx;
        node2.vy += impulse * ny;
        
        // Separate overlapping nodes
        const overlap = (node1.size + node2.size) / 2 - distance;
        const separationX = (overlap / 2) * nx;
        const separationY = (overlap / 2) * ny;
        
        node1.x -= separationX;
        node1.y -= separationY;
        node2.x += separationX;
        node2.y += separationY;
        
        // Play collision sound
        playCollisionSound(node1, node2);
        
        // Visual feedback - briefly expand
        node1.size = node1.baseSize * 1.2;
        node2.size = node2.baseSize * 1.2;
      };

      const playCollisionSound = (node1: Node, node2: Node) => {
        if (!audioInitialized.current || !synthsRef.current) return;
        
        const sameColor = node1.ageGroup === node2.ageGroup;
        const synth = sameColor ? synthsRef.current.sameColor : synthsRef.current.differentColor;
        
        if (sameColor) {
          // Same age group - harmonious, resonant tones
          const notes = ['C4', 'E4', 'G4', 'C5'];
          const note = notes[Math.floor(Math.random() * notes.length)];
          synth?.triggerAttackRelease(note, '8n');
        } else {
          // Different age groups - more complex, interesting harmonies
          const notes = ['D4', 'F#4', 'A4', 'B4', 'D5'];
          const note = notes[Math.floor(Math.random() * notes.length)];
          synth?.triggerAttackRelease(note, '8n');
        }
      };

      const drawCoffeeStain = (node: Node) => {
        p.push();
        p.translate(node.x, node.y);
        p.rotate(node.rotation);
        
        // Draw multiple layers for coffee stain effect
        // Outer halo (very light)
        p.noStroke();
        const h = p.hue(node.color);
        const s = p.saturation(node.color);
        const b = p.brightness(node.color);
        
        p.fill(h, s * 0.4, b * 1.2, node.alpha * 0.2);
        p.beginShape();
        for (let i = 0; i < node.stainShape.length; i++) {
          const point = node.stainShape[i];
          p.vertex(point.x * 1.5, point.y * 1.5);
        }
        p.endShape(p.CLOSE);
        
        // Middle stain
        p.fill(h, s * 0.7, b * 0.85, node.alpha * 0.5);
        p.beginShape();
        for (let i = 0; i < node.stainShape.length; i++) {
          const point = node.stainShape[i];
          p.vertex(point.x, point.y);
        }
        p.endShape(p.CLOSE);
        
        // Inner ring (darker)
        p.fill(h, s * 0.85, b * 0.6, node.alpha * 0.7);
        p.beginShape();
        for (let i = 0; i < node.stainShape.length; i++) {
          const point = node.stainShape[i];
          p.vertex(point.x * 0.5, point.y * 0.5);
        }
        p.endShape(p.CLOSE);
        
        // Center spot
        p.fill(h, s * 0.9, b * 0.4, node.alpha * 0.85);
        p.circle(0, 0, node.size * 0.2);
        
        p.pop();
      };

      p.draw = () => {
        // Lighter background (like paper/table) - warmer beige tone
        p.background(40, 20, 95);
        
        time++;
        
        if (mode === 'cinematic' && time % dayDuration === 0) {
          dayIndex = (dayIndex + 1) % moriiData.length;
          initializeNodes();
        }

        if (onNodeCountChange) {
          onNodeCountChange(nodes.length);
        }
        
        let connectionCount = 0;
        
        // Update physics
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          
          // Apply velocity with slight drag
          node.x += node.vx;
          node.y += node.vy;
          node.vx *= 0.995;
          node.vy *= 0.995;
          
          // Add slight random movement to keep things interesting
          node.vx += p.random(-0.05, 0.05);
          node.vy += p.random(-0.05, 0.05);
          
          // Limit max speed
          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
          if (speed > 2) {
            node.vx = (node.vx / speed) * 2;
            node.vy = (node.vy / speed) * 2;
          }
          
          // Bounce off edges with damping
          if (node.x < node.size || node.x > p.width - node.size) {
            node.vx *= -0.8;
            node.x = p.constrain(node.x, node.size, p.width - node.size);
          }
          if (node.y < node.size || node.y > p.height - node.size) {
            node.vy *= -0.8;
            node.y = p.constrain(node.y, node.size, p.height - node.size);
          }
          
          // Slight rotation
          node.rotation += node.rotationSpeed;
          
          // Return size to normal
          if (node.size > node.baseSize) {
            node.size = p.lerp(node.size, node.baseSize, 0.1);
          }
          
          // Fade in cinematic mode
          if (mode === 'cinematic') {
            const phase = Math.floor(time / dayDuration);
            if (phase >= 2) {
              node.alpha -= node.fadeRate;
              if (node.alpha < 0) node.alpha = 0;
            }
          }
          
          // Check collisions
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j];
            
            if (checkCollision(node, other)) {
              handleCollision(node, other);
              connectionCount++;
            }
            
            // Draw faint connection lines for nearby nodes
            const d = p.dist(node.x, node.y, other.x, other.y);
            if (d < 120 && d > (node.size + other.size) / 2) {
              const alpha = p.map(d, (node.size + other.size) / 2, 120, 0.15, 0) * node.alpha * other.alpha;
              p.stroke(35, 20, 50, alpha);
              p.strokeWeight(1);
              p.line(node.x, node.y, other.x, other.y);
            }
          }
        }
        
        // Draw all nodes with isolation indicators
        for (const node of nodes) {
          // Check if node is isolated (no one within 200px)
          let isIsolated = true;
          for (const other of nodes) {
            if (other === node) continue;
            const d = p.dist(node.x, node.y, other.x, other.y);
            if (d < 200) {
              isIsolated = false;
              break;
            }
          }
          
          // Draw isolation ring if alone
          if (isIsolated) {
            p.push();
            p.noFill();
            p.stroke(p.hue(node.color), p.saturation(node.color) * 0.6, p.brightness(node.color) * 0.8, node.alpha * 0.4);
            p.strokeWeight(2);
            p.circle(node.x, node.y, node.size * 2.5);
            p.pop();
          }
          
          drawCoffeeStain(node);
        }
        
        if (onConnectionCountChange) {
          onConnectionCountChange(connectionCount);
        }
        
        drawOverlay();
      };

      const drawOverlay = () => {
        const currentDay = moriiData[dayIndex];
        
        if (mode === 'cinematic') {
          const phase = Math.floor(time / dayDuration);
          const phaseTime = time % dayDuration;
          
          if (phaseTime < 100) {
            const alpha = phaseTime < 50 ? p.map(phaseTime, 0, 50, 0, 1) : p.map(phaseTime, 50, 100, 1, 0);
            p.fill(30, 50, 30, alpha);
            p.textSize(24);
            p.textAlign(p.CENTER, p.CENTER);
            
            if (phase === 0) {
              p.text('Morii — the desire to capture\na fleeting moment', p.width / 2, p.height / 2);
            } else if (phase === 1) {
              p.text('Collisions create harmony', p.width / 2, p.height / 2);
            } else if (phase === 2) {
              p.text('Stains fade, memories remain', p.width / 2, p.height / 2);
            } else if (phase === 3) {
              p.text('Every encounter leaves a mark', p.width / 2, p.height / 2);
            }
          }
        }
        
        if (!showOverlayText && mode === 'cinematic') return;
        
        // Data overlay with coffee stain aesthetic
        p.fill(35, 25, 85, 0.85);
        p.noStroke();
        p.rect(20, 20, 300, 120, 10);
        
        p.fill(30, 50, 25);
        p.textSize(14);
        p.textAlign(p.LEFT, p.TOP);
        p.text(`Day ${currentDay.day} (${currentDay.timeRange})`, 35, 35);
        p.text(`People: ${currentDay.startCount} → ${currentDay.endCount}`, 35, 60);
        
        p.textSize(12);
        p.fill(30, 65, 70);
        p.circle(35, 95, 10);
        p.fill(30, 50, 25);
        p.text(`Students: ${currentDay.students}`, 50, 90);
        
        p.fill(35, 50, 60);
        p.circle(180, 95, 10);
        p.fill(30, 50, 25);
        p.text(`Middle: ${currentDay.middleAge}`, 195, 90);
        
        p.fill(200, 35, 55);
        p.circle(35, 120, 10);
        p.fill(30, 50, 25);
        p.text(`Older: ${currentDay.older}`, 50, 115);
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    p5Instance.current = new p5(sketch, containerRef.current);

    return () => {
      p5Instance.current?.remove();
      // Clean up audio
      if (synthsRef.current) {
        Object.values(synthsRef.current).forEach(synth => synth?.dispose());
      }
    };
  }, [mode, onNodeCountChange, onConnectionCountChange]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    />
  );
}
