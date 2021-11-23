'use strict';

document.head.insertAdjacentHTML('beforeend', "<link rel='stylesheet' type='text/css' href='AdvancedTimeline.css'>");

const timeline1 = new AdvancedTimeline;

document.getElementsByClassName('create-timeline')[0].addEventListener('click', timeline1.makeTimeline.bind(timeline1));
document.querySelector('.create-point').addEventListener('click', timeline1.makeNewPoint.bind(timeline1));
document.querySelector('.create-sub-point').addEventListener('click', timeline1.makeSubPoint.bind(timeline1));

