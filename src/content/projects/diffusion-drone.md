---
title: Diffusion policies for drone control
year: 2026
categories: [machine-learning, robotics]
order: 1
overview: Generating control trajectories for a morphing drone with diffusion policies. A semester project at EPFL’s Laboratory of Intelligent Systems.
thumbnail:
  src: ../../assets/projects/diffusion-drone/thumbnail.webp
  alt: Simulated drone and planned trajectories toward a target
preview: /projects/diffusion-drone/demo.mp4
media:
  - type: video
    src: /projects/diffusion-drone/demo.mp4
    alt: Animated drone control simulation with sampled trajectories
    poster: ../../assets/projects/diffusion-drone/thumbnail.webp
---

## Goal

Explore Diffusion/Flow matching based policies for a reconfigurable drone (7 inputs, 23 states) and improve the state-of-the-art.

## Highlights

- Paper submitted for ICLR 2027
- Designed and implemented policies based on DDPM, DDIM, score matching, and flow matching.
- Improved speed and performance utilizing a new flow matching path in combination with mean flows.
