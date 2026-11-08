---
title: Adaptive control of a soft arm
year: 2026
categories: [robotics, mechanical]
order: 2
overview: Online, data-driven adaptive model predictive control for a tendon-driven soft arm. A research semester project at EPFL’s CREATE lab.
thumbnail:
  src: ../../assets/projects/soft-arm/thumbnail.webp
  alt: Tendon-driven soft arm with yellow segments, shown horizontally
  fit: contain
preview: /projects/soft-arm/eight-adaptive.mp4
github: https://github.com/MartinD-git/MPC_adaptative_soft_arm
report: /projects/soft-arm/report.pdf
media:
  - type: image
    src: ../../assets/projects/soft-arm/thumbnail.webp
    alt: The segmented soft arm and its tendons, rotated for a landscape view
  - type: video
    src: /projects/soft-arm/eight-adaptive.mp4
    alt: Simulation of a soft arm tracking a figure-eight trajectory
    poster: ../../assets/projects/soft-arm/eight-poster.webp
    caption: Figure-eight tracking without disturbances.
  - type: video
    src: /projects/soft-arm/square-adaptive.mp4
    alt: Simulation of the adaptive controller tracking a square despite disturbances
    poster: ../../assets/projects/soft-arm/square-poster.webp
    caption: Square tracking with disturbances.
  - type: image
    src: ../../assets/projects/soft-arm/arm.webp
    alt: The tendon-driven soft arm in the lab
    caption: The physical soft arm used as the basis for the model.
---

## Goal

Develop an MPC that adapts online to a change of environment e.g from air to water.

## Highlights

- Built a Python simulation and adaptive MPC controller with CasADi and acados.
- Estimated model parameters online using past MPC prediction and measured points.
- Tested trajectory tracking under disturbances.

## Results

Validated the method in simulation with different arm and tracking configurations (2/3 segments, loops, eights and more trajectories).
Hardware issues prevented physical validation.
