//global arrays
let timeline;
let timelineElement;

class Timeline {
    constructor() {
        this.id = 'advanced-timeline-' + document.querySelectorAll('.advanced-timeline').length;
        this.points = {};
        this.subDivisions = {};
    }
}

class Point {
    constructor(title = null) {
        this.id = 'point-' + (Object.keys(timeline.points).length + 1);
        this.title = title;
    }
}

class SubDivision {
    constructor() {
        this.id = 'sub-division-' + (Object.keys(timeline.subDivisions).length + 1);
        this.subPoints = [];
    }
}

class SubPoint {
    constructor(subDivisionId) {
        this.id = 'sub-point-' + (timeline.subDivisions[subDivisionId].subPoints.length === 0) ? 1 : timeline.subDivisions[subDivisionId].subPoints[timeline.subDivisions[subDivisionId].subPoints.length - 1].id + 1;
    }
}


document.head.insertAdjacentHTML('beforeend', "<link rel='stylesheet' type='text/css' href='AdvancedTimeline.css'>");
//Event listeners for buttons
//move to example.js
document.querySelector('.create-point').addEventListener('click', createNewPoint);
document.getElementsByClassName('create-timeline')[0].addEventListener('click', createTimeline);


//main func
function createTimeline () {
    timeline = new Timeline;
    const [point, pointHTML] = createPoint();
    const [subDivision, subDivisionHtml] = createSubDivision();
    timeline.points[point.id] = point;
    timeline.subDivisions[subDivision.id] = subDivision;

    addTimelineToDocument(timeline.id, pointHTML, subDivisionHtml);

    timelineElement = document.querySelector(`#${timeline.id}`);
    timelineElement.addEventListener('change', changeListener);
    timelineElement.addEventListener('click', clickListener);
}

//main func
function createNewPoint() {
    if (!timeline) return;
    const timelineIdx = 0;
    const [point, pointHTML] = createPoint();
    const [subDivision, subDivisionHtml] = createSubDivision();
    timeline.points[point.id] = point;
    timeline.subDivisions[subDivision.id] = subDivision;

    addNewPointToTimeline(pointHTML, subDivisionHtml);
}

function createPoint() {
    const point = new Point('hi');
    const pointHtml = `<div class='wrapper-point' id='wrapper-${point.id}'><input type='text' id='${point.id}' class='point' value='${point.title}'></div>`;
    //const pointHtml = `<div id='${point.id}' class='point' contentEditable='true'>${point.title}</div>`;
    return [point, pointHtml];
}

function createSubDivision() {
    const subDivision = new SubDivision();
    const subDivisionHtml = `<div id='${subDivision.id}' class='subdivision'></div>`;
    return [subDivision, subDivisionHtml];
}

//DOM manipulating funcs

function addTimelineToDocument(timelineId, pointHTML, subDivisionHtml) {
    const body = document.querySelector('body');
    const newTimeline = `<div class='wrapper'><ul id='${timelineId}' class='advanced-timeline'>` + pointHTML + subDivisionHtml + '</ul></div>';
    body.insertAdjacentHTML('beforeend', newTimeline);
}

function addNewPointToTimeline(pointHTML, subDivisionHtml) {
    timelineElement.insertAdjacentHTML('beforeend', pointHTML);
    timelineElement.insertAdjacentHTML('beforeend', subDivisionHtml);
}

function clickListener (event) {
    if(event.target.className === 'subdivision' && !$(`#${event.target.id}`).prop('disabled')) {  
        
        const prevDiv = $(`#${event.target.id}`).prev();
        const nextDiv = $(`#${event.target.id}`).next();

        console.log(prevDiv[0].id);
        console.log(nextDiv[0].id);
        $('.wrapper-point').not(`#${prevDiv[0].id} , #${nextDiv[0].id}`).css({opacity:'0'});
        $('.wrapper-point').prop("disabled", true);
        prevDiv.toggleClass('wrapper-point-visible', true);
        nextDiv.toggleClass('wrapper-point-visible-next', true);

        

        $(`.subdivision:not(#${event.target.id})`).css({opacity:'0'});
        $(`.subdivision:not(#${event.target.id})`).prop("disabled", true);
        //$(`#${event.target.id}`).css({opacity:'1'});
        $(`#${event.target.id}`).prop("disabled", false);

        timelineElement.querySelector(`#${event.target.id}`).className = 'subdivision subdivision-zoom';

    }
    else if(event.target.className === 'subdivision subdivision-zoom' && !$(`#${event.target.id}`).prop('disabled')) {
        timelineElement.querySelector(`#${event.target.id}`).className = 'subdivision';
        $('.wrapper-point').css({opacity:'1'});
        $(`#${event.target.id}`).prev().toggleClass('wrapper-point-visible', false);
        $(`#${event.target.id}`).next().toggleClass('wrapper-point-visible-next', false);
        $(`.subdivision:not(#${event.target.id})`).css({opacity:'1'});
        $('.subdivision').prop("disabled", false);
    }
    
}

function changeListener (event) {
    if(event.target.className === 'point') {
        timeline.points[event.target.id].title = event.target.value
    }
}


//creating a point isn't happening every single time

//How to get a change in value reflected in javascript
//I need to know the index of the object how do I go about that

//Does it make sense to ask the developer to add the index of the timeline
//classnames
//query select then save to a property

//Creating a new subpoint requires knowing the index of the parent
//How will that be passed by clicking on the button