---
layout: page
title: Chocolate Detection Competition
description: Deep Learning contest from EE-461 EPFL
img: assets/img/projects/iapr/iapr_coverimg.png
importance: 1
category: Robotics Master
github: https://github.com/MartinD-git/Object-Detection-Competition-IAPR-EE-451
---

<p>
    <a class="btn btn-sm btn-outline-primary" href="/assets/pdf/Report_IAPR_group_52.pdf" target="_blank" rel="noopener noreferrer">PDF</a>
    <a class="btn btn-sm btn-outline-primary" href="https://github.com/MartinD-git/Object-Detection-Competition-IAPR-EE-451" target="_blank" rel="noopener noreferrer">GitHub</a>
</p>

I participated in the Deep Learning Chocolate Detection Competition organized by the EPFL course EE-461. The goal of the competition was to develop a deep learning model capable of accurately detecting and classifying different types of chocolates in images. 

The dataset provided was 103 unlabelled images for training and 181 unlabelled images for testing. (It was of course not allowed to use the test set for training).

The main constraints were the 12 millions parameters limit and the interdiction to use pretrained models.

Because of the small size of the dataset, data augmentation was crucial to prevent overfitting. 

We initially stared with a YOLO model but in the latest versions the YOLO library became more independent and did not allow much customization nor training from scratch. After too many hours and poor results we decided to stick to the classic PyTorch architectures that we could directly modify to fit in the parameter constraint!

We were 3rd on the public test set but the final leaderbeard was on unseen data which puts us on top!

Don't hesitate to check out our code (maybe made in a rush for the last adjustements :)) and report!

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/iapr/gallery1.png" title="Gallery Image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/iapr/gallery3.png" title="Gallery Image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Some detection images, before the thresholding.
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/iapr/Convolution_plot.png" title="Analysis Image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/iapr/pca_tsne.png" title="Analysis Image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Some model analysis, on the left the plot of the CNN output. On the right the t-sne projection of one of the ROI heads (the box predictor).
</div>