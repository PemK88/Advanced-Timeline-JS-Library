//global arrays
const timelines = []

class Point {
    constructor(timelineId, title = null) {
        this.id = "point-" + timelineId + "-" + (timelines[0].points.length+1);
        this.title = title;
        this.timelineId = timelineId;
    }
}

class Timeline {
    constructor() {
        this.id = 'timeline-' + ((timelines.length === 0) ? 1 : timelines[timelines.length - 1].id + 1)
        this.points = [];
        this.subDivisions = [];
    }
}

class SubDivision {
    constructor(timelineId) {
        this.id = "subdivision-" + timelineId + "-" + (timelines[0].subDivisions.length+1);
        this.subPoints = [];
    }
}

class SubPoint {
    constructor(subDivisionId) {
        this.id = "subPoint" + subDivisionId + (timelines[0].subDivisions.length+1);
        this.subPoints = [];
    }
}


document.head.innerHTML += "<link rel='stylesheet' type='text/css' href='AdvancedTimeline.css'>";
//Event listeners for buttons
//move to example.js
document.querySelector('.create-point').addEventListener('click', createNewPoint);
document.getElementsByClassName('create-timeline')[0].addEventListener('click', createTimeline);



function createTimeline () {
    const timeline = new Timeline;
    timelines.push(timeline);
    const [point, pointHTML] = createPoint(timeline.id);
    const [subDivision, subDivisionHtml] = createSubDivision(timeline.id);
    timeline.points.push(point);
    timeline.subDivisions.push(subDivision)

    addTimelineToDocument(timeline.id, pointHTML, subDivisionHtml);
}

function createNewPoint() {
    debugger;
    if (!timelines.length) return;
    const timelineIdx = 0;
    const [point, pointHTML] = createPoint(timelines[timelineIdx].id);
    debugger;
    const [subDivision, subDivisionHtml] = createSubDivision(timelines[timelineIdx].id);
    timelines[timelineIdx].points.push(point);
    debugger;
    timelines[timelineIdx].subDivisions.push(subDivision)
    debugger;

    addNewPointToTimeline(timelines[timelineIdx].id, pointHTML, subDivisionHtml);
}

function createPoint(timelineId) {
    const point = new Point(timelineId,'hi');
    const pointHtml = `<div id='${point.id}' class='point' contentEditable='true'>${point.title}</div>`;
    return [point, pointHtml];
}

function createSubDivision(timelineId) {
    const subDivision = new SubDivision(timelineId);
    const subDivisionHtml = `<div id='${subDivision.id}' class='subdivision'></div>`;
    return [subDivision, subDivisionHtml];
}

function addTimelineToDocument(timelineId, pointHTML, subDivisionHtml) {
    const body = document.querySelector('body');
    const newTimeline = `<ul id='${timelineId}' class='timeline'>` + pointHTML + subDivisionHtml + '</ul>';
    body.innerHTML+= newTimeline;
}

function addNewPointToTimeline(timelineId, pointHTML, subDivisionHtml) {
    const timeline = document.querySelector(`#${timelineId}`);
    debugger;
    timeline.innerHTML += pointHTML;
    timeline.innerHTML += subDivisionHtml;
}

//creating a point isn't happening every single time

//How to get a change in value reflected in javascript
//I need to know the index of the object how do I go about that

//Does it make sense to ask the developer to add the index of the timeline

//Creating a new subpoint requires knowing the index of the parent
//How will that be passed by clicking on the button