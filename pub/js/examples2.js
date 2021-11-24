'use strict';

document.head.insertAdjacentHTML('beforeend', "<link rel='stylesheet' type='text/css' href='AdvancedTimeline.css'>");

const timeline2 = new AdvancedTimeline;

document.getElementsByClassName('create-timeline2')[0].addEventListener('click', () => {timeline2.makeTimeline.bind(timeline2)('#container2')});
document.querySelector('.create-point2').addEventListener('click', timeline2.makeNewPoint.bind(timeline2));
document.querySelector('.create-sub-point2').addEventListener('click', timeline2.makeSubPoint.bind(timeline2));
