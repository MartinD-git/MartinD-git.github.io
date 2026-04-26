---
layout: page
title: Research semester project
description: Online Adaptive MPC on Tendon-Driven Soft Arm
img: assets/img/projects/sp1/sp1_cover.png
importance: 2
category: Robotics Master
github: https://github.com/MartinD-git/MPC_adaptative_soft_arm
---

<p>
    <a class="btn btn-sm btn-outline-primary" href="assets/img/projects/sp1/sp1_report.pdf" target="_blank" rel="noopener noreferrer">PDF</a>
    <a class="btn btn-sm btn-outline-primary" href="https://github.com/MartinD-git/MPC_adaptative_soft_arm" target="_blank" rel="noopener noreferrer">GitHub</a>
</p>

A research project about online data-driven adaptive MPC. 

The goal was to control with an MPC a tendon-driven soft arm. <img src="assets/img/projects/sp1/soft arm.png" alt="drawing" width="200"/>

But only model the arm in air and find a way for it to adapt by itself when entering another medium such as water.

To achieve this, our approach was to have add additional parameters to the model we optimize by minimizing the models past prediction with its actual recorded position.

The complex modelling of such arm made the simulation sensitive and sometimes unstables but our implementation worked even with disturbances, with the arm having a stable position (pointing downwards) or no stable position (pointing upwards).

Different trajectories have been tried, you can find some below.

Unfortunately the hardware was not working properly and we could not try the adaptive MPC in real conditions

Don't hesitate to check out the code and report!

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/sp1/eightadaptive.gif" title="Gallery Image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/sp1/squareadaptive.gif" title="Gallery Image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    On the left, tracking an eight shape, without disturbances. On the right, tracking a square shape, with disturbances
</div>