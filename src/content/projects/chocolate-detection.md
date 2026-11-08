---
title: Object Detection Competition
year: 2025
categories: [machine-learning]
order: 3
overview: Winner of the EPFL's Image Analysis and Pattern Recognition competition.
thumbnail:
  src: ../../assets/projects/chocolate/thumbnail.webp
  alt: Chocolates detected and classified with colored bounding boxes
github: https://github.com/MartinD-git/Object-Detection-Competition-IAPR-EE-451
report: /projects/chocolate/report.pdf
media:
  - type: image
    src: ../../assets/projects/chocolate/detections-1.webp
    alt: Model detections on a photograph of assorted chocolates
    caption: Detection outputs before thresholding.
  - type: image
    src: ../../assets/projects/chocolate/detections-2.webp
    alt: Chocolate predictions with classification scores and bounding boxes
  - type: image
    src: ../../assets/projects/chocolate/convolution.webp
    alt: Visualizations of the convolutional network’s responses
    caption: Inspecting the network’s convolutional outputs.
  - type: image
    src: ../../assets/projects/chocolate/feature-space.webp
    alt: PCA and t-SNE projections of the box predictor’s feature space
    caption: Exploring the representations learned by the box predictor.
---

## Goal

Build an accurate object detector using only 103 training images (initially non-annotated), without pretrained models and with a limit of 12 million parameters.

## Highlights

- Used data augmentation to address the small training set.
- Explored YOLO before moving to a customizable PyTorch architecture.
- Analyzed convolutional outputs and the box predictor’s feature space.

## Results

Our team placed third on the public test set and won the final competition on unseen data.
