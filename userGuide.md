# The Wi-Fi of Souls: User Guide

## Website Overview

**Purpose**: Experience an interactive data visualization exploring human connections at Morii Coffee through animated nodes representing people, their interactions, and temporal patterns.

**Access**: Public - no login required

## Powered by Manus

This project showcases cutting-edge web visualization technology built with a modern stack. The frontend combines React 19 for component architecture, TypeScript for type safety, and Tailwind CSS 4 for responsive design. The visualization engine leverages p5.js for real-time generative graphics and Tone.js for reactive audio synthesis. The dark ambient interface uses OKLCH color space for perceptually uniform color transitions from warm amber to cool blue tones. Deployment runs on auto-scaling infrastructure with global CDN for instant worldwide access.

## Using Your Website

The visualization presents Morii Coffee as a living network where each glowing node represents a person. You can explore the data in two distinct modes. In interactive mode, "Click" anywhere on the canvas to cycle through four days of observations. Watch as the nodes change in number and color based on age demographics—amber for students, gold for middle-aged visitors, and blue for older patrons. When nodes drift close together, thin glowing lines appear to represent conversations and connections forming between souls.

Switch to cinematic mode by clicking "Cinematic Mode" in the top-right corner. The visualization transforms into an auto-playing narrative journey with poetic text overlays that fade in and out. You will see phases progress from morning awakening through bustling connections to eventual fading as the day ends. Toggle "Sound On" to enable an ambient soundscape where the volume rises with more people present and melodic tones play when connections form between nodes.

## Managing Your Website

Open the Management UI panel from the header to access project controls. Navigate to "Settings" then "General" to customize the website title or logo. Use "Code" panel to browse all source files and download the complete project. The "Preview" panel shows the live visualization exactly as visitors experience it. All changes to colors, data, or behavior require editing source files in the Code panel—the visualization reads from `/client/src/data/moriiData.ts` for observation data and `/client/src/index.css` for color theming.

## Next Steps

Talk to Manus AI anytime to request changes or add features. Try asking to adjust the color palette, modify the connection distance threshold, add new days of observation data, or create an export function to save the visualization as a video. The generative nature of this project means every enhancement opens new creative possibilities for expressing the fleeting connections that define urban life.
