//global arrays
let timeline;
let timelineElement;
let timelineWrapperElement;
let activeSubDivion;
let pointEndElement;

//Object defintions
class Timeline {
    constructor() {
        this.id = 'advanced-timeline-' + document.querySelectorAll('.advanced-timeline').length;
        this.wrapperId = 'wrapper-advanced-timeline-' + document.querySelectorAll('.wrapper-advanced-timeline').length;
        this.points = {};
        this.subDivisions = {};
    }
}

class Point {
    constructor(title = null) {
        this.id = 'point-' + (Object.keys(timeline.points).length + 1);
        this.title = title;
        this.infoCard = null;
    }
}

class SubDivision {
    constructor() {
        this.id = 'sub-division-' + (Object.keys(timeline.subDivisions).length + 1);
        this.subPoints = {};
        this.height = '250px';
        this.marginBottom = '519px';
    }
}

class SubPoint {
    constructor(subDivisionId) {
        this.id = 'sub-point-' + (Object.keys(timeline.subDivisions[subDivisionId].subPoints).length + 1);
        this.infoCard = null;
    }
}
class InfoCard {
    constructor(pointId, value='') {
        this.id = 'sub-info-card-' + pointId;
        this.value = value;
    }
}

class SubInfoCard {
    constructor(subPointId, frontValue='', backValue='') {
        this.id = 'sub-info-card-' + subPointId;
        this.frontValue = frontValue;
        this.backValue = backValue;
    }
}


document.head.insertAdjacentHTML('beforeend', "<link rel='stylesheet' type='text/css' href='AdvancedTimeline.css'>");
//Event listeners for buttons
//move to example.js
document.querySelector('.create-point').addEventListener('click', createNewPoint);
document.getElementsByClassName('create-timeline')[0].addEventListener('click', createTimeline);


function createTimeline () {
    timeline = new Timeline;
    const [point, pointHTML] = createPoint('Start');
    timeline.points[point.id] = point;
    const [pointEnd, pointEndHTML] = createPoint('End');
    timeline.points[pointEnd.id] = pointEnd;
    const [subDivision, subDivisionHtml] = createSubDivision();
    timeline.points[point.id] = point;
    timeline.subDivisions[subDivision.id] = subDivision;

    addTimelineToDocument(timeline.id, timeline.wrapperId, pointHTML, pointEndHTML, subDivisionHtml);

    timelineElement = document.querySelector(`#${timeline.id}`);
    timelineElement.addEventListener('change', changeListener);
    timelineElement.addEventListener('click', clickListener);

    timelineWrapperElement = document.querySelector(`#${timeline.wrapperId}`);
    pointEndElement = timelineElement.querySelector('#wrapper-point-2');
    pointEndElement.querySelector('.point').style.backgroundColor = "#e54646";
}

function createNewPoint(pointTitle='point', info="N/A") {
    if (!timeline) return;
    const [point, pointHTML] = createPoint(pointTitle, info);
    const [subDivision, subDivisionHtml] = createSubDivision();
    timeline.points[point.id] = point;
    timeline.subDivisions[subDivision.id] = subDivision;

    addNewPointToTimeline(pointHTML, subDivisionHtml);
}

function createPoint(title = 'point', info="N/A") {
    const point = new Point(title);
    const [infoCard, infoCardHtml] = createInfoCard(point.id, info);
    point.infoCard = infoCard;
    const pointHtml = `<div class='wrapper-point' id='wrapper-${point.id}'><input type='text' id='${point.id}' class='point' value='${point.title}' readonly>${infoCardHtml}</div>`;
    return [point, pointHtml];
}

function createSubPoint(pointId = null, frontInfo="Click to see more information", backInfo="No information available") {
    let subDivisionId;
    let active = false;

    if (timeline.points[pointId]) {
        subDivisionId = $(`#${pointId}`).parent().next()[0].id;
    }
    else {
        subDivisionId = activeSubDivion;
        active = true;
    }
    
    if (!subDivisionId) return;

    const subPoint = new SubPoint(subDivisionId);

    const [infoCard, infoCardHtml] = createSubInfoCard(subPoint.id, frontInfo, backInfo);

    subPoint.infoCard = infoCard;

    timeline.subDivisions[subDivisionId].subPoints[subPoint.id] = subPoint

    const numSubPoints = Object.keys(timeline.subDivisions[subDivisionId].subPoints).length

    if ( numSubPoints > 6) {
        timeline.subDivisions[subDivisionId].height = 250 + ((numSubPoints-6) * 45);
        timeline.subDivisions[subDivisionId].marginBottom = 519 + ((numSubPoints-6) * 72);
        timelineWrapperElement.style.height = (990 + ((numSubPoints-6) * 118)) + 'px';
    }

    const overlay =`<div class='overlay'></div>`
    const subPointHtml = `<div class='wrapper-sub-point' id='wrapper-${subPoint.id}'><div class='sub-point' id='${subPoint.id}'>${overlay}${infoCardHtml}</div></div>`;

    addNewSubPointToTimeline(subPointHtml, subDivisionId, active);
}

function createInfoCard(pointId, info="N/A") {

    const infoCard = new InfoCard(pointId, info);
    const infoCardHtml = `<div class='info-card' id='${infoCard.id}'><p class='info-card-front-text'>${infoCard.value}<p></div>`

    return [infoCard, infoCardHtml];

}

function createSubInfoCard(subPointId, frontInfo="Click to see more information", backInfo="No information available") {

    const infoCard = new SubInfoCard(subPointId, frontInfo, backInfo);
    const infoCardHtml = `<div class='sub-info-card' id='${infoCard.id}'>
                            <div class='sub-info-card-inner' id='inner-${infoCard.id}'>
                                <div class='sub-info-card-front' id='front-${infoCard.id}'>
                                    <p class='sub-info-card-front-text'>${infoCard.frontValue}<p>
                                </div>
                                <div class='sub-info-card-back focused-info-card' id='back-${infoCard.id}'>
                                </div>
                            </div>
                        </div>`

    return [infoCard, infoCardHtml];

}

function createSubDivision() {
    const subDivision = new SubDivision();
    const subDivisionHtml = `<div id='${subDivision.id}' class='subdivision'></div>`;
    return [subDivision, subDivisionHtml];
}

//DOM manipulating functions

function addTimelineToDocument(timelineId, wrapperId, pointHTML, pointEndHTML, subDivisionHtml) {
    const body = document.querySelector('body');
    const newTimeline = `<div id='${wrapperId}' class='wrapper-advanced-timeline'>
        <ul id='${timelineId}' class='advanced-timeline'>` + pointHTML + subDivisionHtml + pointEndHTML +'</ul></div>';
    body.insertAdjacentHTML('beforeend', newTimeline);
}

function addNewPointToTimeline(pointHTML, subDivisionHtml) {
    pointEndElement.insertAdjacentHTML('beforebegin', pointHTML);
    pointEndElement.insertAdjacentHTML('beforebegin', subDivisionHtml);
}

function addNewSubPointToTimeline(subPointHTML, subDivisionId, active) {
    timelineElement.querySelector(`#${subDivisionId}`).insertAdjacentHTML('beforeend', subPointHTML);
    if (active) {
        $(`#${timeline.id} #${subDivisionId}`).css({'height': timeline.subDivisions[`${subDivisionId}`].height,
            'margin-bottom': timeline.subDivisions[`${subDivisionId}`].marginBottom});
        $(`#${timeline.id} #${subDivisionId} .wrapper-sub-point`).toggleClass('display-flex', true);
    }
}

function zoomDivision(event) {

    activeSubDivion = event.target.id;
    const prevDiv = $(`#${timeline.id} #${event.target.id}`).prev();
    const nextDiv = $(`#${timeline.id} #${event.target.id}`).next();
    let eventFired = 0;
    let newHeight = '800px'
    console.log(timelineWrapperElement.scrollTop + " old scroll top")
    $(`#${timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', true);
    $(`#${timeline.id} .wrapper-point .info-card`).toggleClass('appear-info-card', false);
    $(`#${timeline.id} .wrapper-point`).prop("disabled", true);

    $(`#${timeline.id} .subdivision`).toggleClass('subdivision-zoom', true);
    $(`#${timeline.id} .subdivision`).prop("disabled", true);
    $(`#${timeline.id} .subdivision:not(#${event.target.id})`).toggleClass("cursor-not-allowed", true)
    $(`#${timeline.id} #${event.target.id}`).prop("disabled", false);
    $(`#${timeline.id} #${event.target.id}`).css({'height': timeline.subDivisions[`${event.target.id}`].height,
        'margin-bottom': timeline.subDivisions[`${event.target.id}`].marginBottom});
    $(`#${timeline.id} #${event.target.id} .wrapper-sub-point`).toggleClass('display-flex', true);

    $(`#${timeline.id} #${event.target.id}`).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
        () => {
            if(eventFired) {
                console.log('event fired position' + timelineWrapperElement.scrollTop)
                timelineWrapperElement.style.overflowY = 'hidden';
                timelineWrapperElement.style.height = newHeight;
                return;
            }

            timelineWrapperElement.scrollTop =  timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop;

            const startPoint = timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop;
            const startDiv = timelineElement.querySelector(`#${event.target.id}`).offsetTop;
            const endDiv = timelineElement.querySelector(`#${nextDiv[0].id}`).offsetTop

            newHeight = (startDiv + endDiv + 33 - 2*startPoint) + 'px';
            eventFired = 1;
        });

}


function clickListener (event) {
    if(!event.target.id) {
        return;
    }
    
    if ($(`#${event.target.id}`).prop('disabled')) {
        return;
    }
    else if(event.target.className === 'subdivision' ) {  
        zoomDivision(event); 
    }
    else if(event.target.className === 'subdivision subdivision-zoom') {
        activeSubDivion = null;
        $(`#${timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', false);
        $(`#${timeline.id} .subdivision`).toggleClass('subdivision-zoom', false);
        $(`#${timeline.id} .subdivision`).prop("disabled", false);
        $(`#${timeline.id} .wrapper-point`).prop("disabled", false);
        $(`#${timeline.id} #${event.target.id}`).removeAttr("style");
        $(`#${timeline.id} #${event.target.id} .wrapper-sub-point`).toggleClass('display-flex', false);
        $(`#${timeline.id} .subdivision:not(#${event.target.id})`).toggleClass("cursor-not-allowed", false)
        timelineWrapperElement.style = '';
    }
    else if(event.target.className === 'sub-point') {
        $(`#${timeline.id} #${event.target.id} .sub-info-card`).toggleClass('appear-sub-info-card');
    }
    else if(event.target.className === 'sub-info-card-front') {
        const pointIdx = $(`#${timeline.id} #${event.target.id}`).closest('.wrapper-sub-point').index()
        $(`#${timeline.id} #${event.target.id}`).next().css({'margin-top': (35-pointIdx*55)+'px'})
        $(`#${timeline.id} #${event.target.id}`).closest('.sub-info-card').prev().css({'display': 'block'});
        $(`#${timeline.id} #${event.target.id}`).closest('.sub-info-card').css({'z-index': '501'})
        $(`#${timeline.id} #${event.target.id}`).toggleClass('flip-180',true);
        $(`#${timeline.id} #${event.target.id}`).next().toggleClass('flip-0',true);

    }
    else if(event.target.className === 'sub-info-card-back focused-info-card flip-0') {
        $(`#${timeline.id} #${event.target.id}`).toggleClass('flip-0',false);
        $(`#${timeline.id} #${event.target.id}`).prev().toggleClass('flip-180',false);
        $(`#${timeline.id} #${event.target.id}`).closest('.sub-info-card').removeAttr('style');
        $(`#${timeline.id} #${event.target.id}`).closest('.sub-info-card').prev().removeAttr('style');
    }
    else if(event.target.className === 'point') {
        $(`#${timeline.id} #${event.target.id}`).next().toggleClass('appear-info-card');
    }
}

function changeListener (event) {
    if(event.target.className === 'point') {
        timeline.points[event.target.id].title = event.target.value
    }
}