import React, { useRef, useEffect, useState } from 'react';
import './SkillGraph.css';

const SkillGraph = ({ skills }) => {
    const canvasRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [loadedImages, setLoadedImages] = useState({});
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0, isInContainer: false });
    const [adaptiveSizes, setAdaptiveSizes] = useState({
        objectRadius: 35.5,
        repelRadius: 55.5,
        cursorObjectRadius: 60,
        cursorRepelRadius: 100,
        imageSize: 50
    });
    const lastFrameTime = useRef(Date.now());

    // Constants for boundaries - now using adaptive sizes
    const MAX_ATTEMPTS = 100; // Maximum attempts per size iteration
    const FRAME_RATE = 30; // 30 FPS
    const FRAME_TIME = 1000 / FRAME_RATE; // Time between frames in ms
    const FORCE_SCALE = 20000; // Force scale for movement    // Check if two nodes overlap
    const checkOverlap = (node1, node2, objectRadius) => {
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < objectRadius * 2;
    };    // Calculate repulsion force between two nodes
    const calculateRepulsionForce = (node1, node2, repelRadius) => {
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If nodes are too far apart, no force
        if (distance > repelRadius * 2) {
            return { fx: 0, fy: 0 };
        }

        // Calculate force magnitude (inverse square law)
        const forceMagnitude = FORCE_SCALE / (distance * distance);

        // Calculate force components
        const fx = (dx / distance) * forceMagnitude;
        const fy = (dy / distance) * forceMagnitude;

        return { fx, fy };
    };

    // Calculate repulsion force from cursor to a node
    const calculateCursorRepulsionForce = (node, cursor, cursorRepelRadius, nodeRepelRadius) => {
        const dx = cursor.x - node.x;
        const dy = cursor.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If cursor and node are too far apart, no force
        // Check if cursor repel boundary overlaps with node repel boundary
        if (distance > cursorRepelRadius + nodeRepelRadius) {
            return { fx: 0, fy: 0 };
        }

        // Calculate force magnitude (inverse square law)
        const forceMagnitude = FORCE_SCALE / (distance * distance);

        // Calculate force components (repel away from cursor)
        const fx = (node.x - cursor.x) / distance * forceMagnitude;
        const fy = (node.y - cursor.y) / distance * forceMagnitude;

        return { fx, fy };
    };    // Handle wall collisions
    const handleWallCollisions = (node, canvas, objectRadius) => {
        const newVx = node.vx;
        const newVy = node.vy;
        const newX = node.x;
        const newY = node.y;

        // Left wall
        if (newX - objectRadius < 0) {
            return {
                ...node,
                x: objectRadius,
                vx: -newVx * 0.8, // Bounce with energy loss
                vy: newVy
            };
        }
        // Right wall
        if (newX + objectRadius > canvas.width) {
            return {
                ...node,
                x: canvas.width - objectRadius,
                vx: -newVx * 0.8,
                vy: newVy
            };
        }
        // Top wall
        if (newY - objectRadius < 0) {
            return {
                ...node,
                y: objectRadius,
                vx: newVx,
                vy: -newVy * 0.8
            };
        }
        // Bottom wall
        if (newY + objectRadius > canvas.height) {
            return {
                ...node,
                y: canvas.height - objectRadius,
                vx: newVx,
                vy: -newVy * 0.8
            };
        }

        return node;
    };    // Generate valid initial positions with adaptive sizing
    const generateValidPositions = (canvas) => {
        let currentSizes = { ...adaptiveSizes };
        let totalAttempts = 0;

        while (true) {
            const newNodes = [];
            let success = true;

            for (let i = 0; i < skills.length; i++) {
                let attempts = 0;
                let validPosition = false;
                let node;

                while (!validPosition && attempts < MAX_ATTEMPTS) {
                    node = {
                        id: skills[i].id,
                        name: skills[i].name,
                        img: skills[i].icon,
                        x: Math.random() * (canvas.width - currentSizes.objectRadius * 2) + currentSizes.objectRadius,
                        y: Math.random() * (canvas.height - currentSizes.objectRadius * 2) + currentSizes.objectRadius,
                        vx: 0,
                        vy: 0,
                        fx: 0,
                        fy: 0
                    };

                    // Check overlap with existing nodes
                    validPosition = true;
                    for (let j = 0; j < newNodes.length; j++) {
                        if (checkOverlap(node, newNodes[j], currentSizes.objectRadius)) {
                            validPosition = false;
                            break;
                        }
                    }

                    attempts++;
                }

                if (!validPosition) {
                    success = false;
                    break;
                }

                newNodes.push(node);
            }

            if (success) {
                // Update adaptive sizes if they changed
                if (currentSizes.objectRadius !== adaptiveSizes.objectRadius) {
                    setAdaptiveSizes(currentSizes);
                    // Also update CSS for image sizes
                    updateImageSizes(currentSizes.imageSize);
                }
                return newNodes;
            }

            // Reduce sizes and try again
            totalAttempts += MAX_ATTEMPTS;
            currentSizes.objectRadius = Math.max(10, currentSizes.objectRadius - 1);
            currentSizes.repelRadius = Math.max(15, currentSizes.repelRadius - 1);
            currentSizes.cursorObjectRadius = Math.max(10, currentSizes.cursorObjectRadius - 1);
            currentSizes.cursorRepelRadius = Math.max(15, currentSizes.cursorRepelRadius - 1);
            currentSizes.imageSize = Math.max(20, currentSizes.imageSize - 2);
        }
    };

    // Update image sizes in CSS
    const updateImageSizes = (newSize) => {
        const style = document.createElement('style');
        style.textContent = `
            .skills-container canvas {
                --dynamic-image-size: ${newSize}px;
            }
        `;
        document.head.appendChild(style);    };

    // Update node positions based on forces
    const updatePositions = () => {
        const canvas = canvasRef.current;
        setNodes(prevNodes => {
            const newNodes = prevNodes.map(node => ({ ...node, fx: 0, fy: 0 }));

            // Calculate forces between all pairs of nodes
            for (let i = 0; i < newNodes.length; i++) {
                for (let j = i + 1; j < newNodes.length; j++) {
                    const force = calculateRepulsionForce(newNodes[i], newNodes[j], adaptiveSizes.repelRadius);

                    // Apply forces to both nodes (equal and opposite)
                    newNodes[i].fx -= force.fx;
                    newNodes[i].fy -= force.fy;
                    newNodes[j].fx += force.fx;
                    newNodes[j].fy += force.fy;
                }

                // Calculate cursor forces if cursor is in container
                if (cursorPosition.isInContainer) {
                    const cursorForce = calculateCursorRepulsionForce(
                        newNodes[i],
                        cursorPosition,
                        adaptiveSizes.cursorRepelRadius,
                        adaptiveSizes.repelRadius
                    );
                    newNodes[i].fx += cursorForce.fx;
                    newNodes[i].fy += cursorForce.fy;
                }
            }

            // Update positions based on forces and handle wall collisions
            return newNodes.map(node => {
                const newVx = node.vx * 0.9 + node.fx * 0.1; // Add damping
                const newVy = node.vy * 0.9 + node.fy * 0.1;
                const newX = node.x + newVx;
                const newY = node.y + newVy;

                const updatedNode = {
                    ...node,
                    vx: newVx,
                    vy: newVy,
                    x: newX,
                    y: newY
                };

                // Handle wall collisions
                return handleWallCollisions(updatedNode, canvas, adaptiveSizes.objectRadius);
            });        });
    };

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const imageMap = {};
            const imagePromises = skills.map(skill => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        imageMap[skill.id] = img;
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = skill.icon;
                });
            });            try {
                await Promise.all(imagePromises);
                setLoadedImages(imageMap);
            } catch (error) {
                // Silently handle image loading errors
                console.error('Error loading images:', error);
            }
        };

        loadImages();
    }, [skills]);    // Initialize nodes and canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size to match container
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // Mouse event handlers
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setCursorPosition({ x, y, isInContainer: true });
        };

        const handleMouseEnter = () => {
            setCursorPosition(prev => ({ ...prev, isInContainer: true }));
        };

        const handleMouseLeave = () => {
            setCursorPosition(prev => ({ ...prev, isInContainer: false }));
        };        // Add event listeners
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseenter', handleMouseEnter);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        const newNodes = generateValidPositions(canvas);
        setNodes(newNodes);

        // Cleanup event listeners
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseenter', handleMouseEnter);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [skills]);

    // Draw function
    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);        // Draw each node
        nodes.forEach(node => {
            const img = loadedImages[node.id];
            if (img) {
                // Draw image
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, adaptiveSizes.objectRadius, 0, 2 * Math.PI);
                ctx.clip();
                ctx.filter = 'brightness(0) invert(1)';
                const halfSize = adaptiveSizes.imageSize / 2;
                ctx.drawImage(img, node.x - halfSize, node.y - halfSize, adaptiveSizes.imageSize, adaptiveSizes.imageSize);
                ctx.restore();
            }
        });
    };

    // Animation loop with frame rate control
    useEffect(() => {
        let animationFrameId;
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - lastFrameTime.current;            if (elapsed >= FRAME_TIME) {
                // console.log('Frame update at:', new Date().toISOString());
                updatePositions();
                draw();
                lastFrameTime.current = currentTime;
            }

            animationFrameId = requestAnimationFrame(animate);        };
        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [nodes, loadedImages, cursorPosition]);    return (
        <div className="skills-container">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default SkillGraph;
