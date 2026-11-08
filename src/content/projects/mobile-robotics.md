---
title: Mobile robot navigation
year: 2024
categories: [robotics]
order: 8
overview: A Thymio robot navigating an arena using computer vision, path planning, state estimation, and local obstacle avoidance. A group project for the course Basics of Mobile Robotics at EPFL.
thumbnail:
  src: ../../assets/projects/mobile-robotics/thumbnail.webp
  alt: Thymio mobile robot with illuminated onboard sensors
report: /projects/mobile-robotics/report.pdf
media:
  - type: image
    src: ../../assets/projects/mobile-robotics/thumbnail.webp
    alt: The Thymio mobile robot used for the navigation project
  - type: image
    src: ../../assets/projects/mobile-robotics/arena.webp
    alt: Overhead view of the Thymio robot and colored arena obstacles
    caption: The project’s arena, from the original presentation.
---

## Goal

Navigate to a detected goal while avoiding both mapped obstacles and smaller unplanned local obstacles. Bonus implementation of recovering from a kidnapping or blocked camera frames.

## Highlights

- Located the robot and goal with computer vision and a Kalman filter.
- Planned routes with A* and tracked them with a proportional controller.
- Used onboard sensors for local avoidance and lift detection.
