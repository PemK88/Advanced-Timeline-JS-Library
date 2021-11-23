'use strict';

document.head.insertAdjacentHTML('beforeend', "<link rel='stylesheet' type='text/css' href='AdvancedTimeline.css'>");

const timeline1 = new AdvancedTimeline;
const timeline2 = new AdvancedTimeline;

document.getElementsByClassName('create-timeline')[0].addEventListener('click', () => {timeline1.makeTimeline.bind(timeline1)('#container1', 'gainsboro')});
document.querySelector('.create-point').addEventListener('click', timeline1.makeNewPoint.bind(timeline1));
document.querySelector('.create-sub-point').addEventListener('click', timeline1.makeSubPoint.bind(timeline1));


document.getElementsByClassName('create-timeline2')[0].addEventListener('click', () => {timeline2.makeTimeline.bind(timeline2)('#container2')});
document.querySelector('.create-point2').addEventListener('click', timeline2.makeNewPoint.bind(timeline2));
document.querySelector('.create-sub-point2').addEventListener('click', timeline2.makeSubPoint.bind(timeline2));
