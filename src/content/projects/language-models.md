---
title: Post-training small language models
year: 2026
categories: [machine-learning]
order: 6
overview: Improving Qwen3-1.7B through structured post-training and domain specialization. A group project for EPFL’s Modern Natural Language Processing course.
thumbnail:
  src: ../../assets/projects/language-models/multilingual-accuracy.webp
  alt: Multilingual accuracy compared across the base model, supervised fine-tuning, and GRPO
  fit: contain
report: /projects/language-models/report.pdf
media:
  - type: image
    src: ../../assets/projects/language-models/multilingual-accuracy.webp
    alt: Bar chart of model accuracy across six target languages
    caption: Comparing the base model, supervised fine-tuning, and GRPO.
  - type: image
    src: ../../assets/projects/language-models/generalization.webp
    alt: Evaluation of the models on validation and out-of-distribution multilingual benchmarks
    caption: Generalization to languages and data distributions beyond training.
---

## Goal

Improve a compact language model across mathematics, general knowledge, multilingual tasks, and safety.

## Highlights

- Combined supervised fine-tuning with GRPO where rewards could be verified.
- Compared LoRA and full fine-tuning with domain-specific data and reward design.
- Merged specialist models with TIES to balance performance across tasks.

## Results

Domain-matched training improved specialist performance. The merged model offered the best overall trade-off, with reward design and distribution shifts remaining key limitations.
