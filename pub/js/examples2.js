'use strict';

document.head.insertAdjacentHTML('beforeend', "<link rel='stylesheet' type='text/css' href='AdvancedTimeline.css'>");

const timeline2 = new AdvancedTimeline();
//timeline2.makeTimeline('#container2', false)

document.getElementsByClassName('create-timeline2')[0].addEventListener('click', () => {timeline2.makeTimeline.bind(timeline2)('#container2', false)});
document.querySelector('.create-point2').addEventListener('click', timeline2.makeNewPoint.bind(timeline2));
document.querySelector('.create-sub-point2').addEventListener('click', timeline2.makeSubPoint.bind(timeline2));
