'use strict';

function AdvancedTimeline() {
    this.timeline = null;
    this.timelineElement = null;
    this.timelineWrapperElement = null;
    this.activeSubDivion = null;
    this.pointEndElement = null;
}

AdvancedTimeline.prototype = {
    makeTimeline: createTimeline,
    makeNewPoint: createNewPoint,
    makeSubPoint: createSubPoint
}

class Timeline {
    constructor() {
        this.id = 'advanced-timeline-' + document.querySelectorAll('.advanced-timeline').length;
        this.wrapperId = 'wrapper-advanced-timeline-' + document.querySelectorAll('.wrapper-advanced-timeline').length;
        this.points = {};
        this.subDivisions = {};
    }
}

class Point {
    constructor(self, title = null) {
        this.id = 'point-' + (Object.keys(self.timeline.points).length + 1);
        this.title = title;
        this.infoCard = null;
        this.backgroundColor = null;
    }
}

class SubDivision {
    constructor(self) {
        this.id = 'sub-division-' + (Object.keys(self.timeline.subDivisions).length + 1);
        this.subPoints = {};
        this.height = '250px';
        this.marginBottom = '519px';
        this.backgroundColor = null;
    }
}

class SubPoint {
    constructor(self, subDivisionId) {
        this.id = 'sub-point-' + (Object.keys(self.timeline.subDivisions[subDivisionId].subPoints).length + 1);
        this.infoCard = null;
        this.backgroundColor = null;
        this.borderColor = null;
    }
}
class InfoCard {
    constructor(pointId, value='') {
        this.id = 'sub-info-card-' + pointId;
        this.value = value;
        this.backgroundColor = null;
        this.borderColor = null;
    }
}

class SubInfoCard {
    constructor(subPointId, frontValue='', backValue='') {
        this.id = 'sub-info-card-' + subPointId;
        this.frontValue = frontValue;
        this.backValue = backValue;
        this.frontBackgroundColor = null;
        this.frontBorderColor = null;
        this.backBackgroundColor = null;
        this.backBorderColor = null;
        this.elements = {}
    }
}

function createTimeline () {
    const self = this;
    if (self.timeline) return;
    self.timeline = new Timeline;
    const [point, pointHTML] = createPoint(self, 'Start');
    self.timeline.points[point.id] = point;
    const [pointEnd, pointEndHTML] = createPoint(self, 'End');
    self.timeline.points[pointEnd.id] = pointEnd;
    const [subDivision, subDivisionHtml] = createSubDivision(self);
    self.timeline.points[point.id] = point;
    self.timeline.subDivisions[subDivision.id] = subDivision;

    addTimelineToDocument(self.timeline.id, self.timeline.wrapperId, pointHTML, pointEndHTML, subDivisionHtml);

    self.timelineElement = document.querySelector(`#${self.timeline.id}`);
    self.timelineElement.addEventListener('change', (event) => {changeListener(self, event)});
    self.timelineElement.addEventListener('click', (event) => {clickListener(self, event)});

    self.timelineWrapperElement = document.querySelector(`#${self.timeline.wrapperId}`);
    self.pointEndElement = self.timelineElement.querySelector('#wrapper-point-2');
    self.pointEndElement.querySelector('.point').style.backgroundColor = "#e54646";
}

function createNewPoint(pointTitle='Point', info="N/A") {
    const self = this;
    if (!self.timeline || self.activeSubDivion) return;

    if(typeof pointTitle !== 'string') {
        pointTitle = 'Point'
    }
    const [point, pointHTML] = createPoint(self, pointTitle, info);
    const [subDivision, subDivisionHtml] = createSubDivision(self);
    self.timeline.points[point.id] = point;
    self.timeline.subDivisions[subDivision.id] = subDivision;

    addNewPointToTimeline(self, pointHTML, subDivisionHtml);
}

function createSubPoint(pointId = null, frontInfo="Click to see more information", backInfo="No information available") {
    const self = this;
    let subDivisionId;
    let active = false;

    if (self.timeline.points[pointId]) {
        subDivisionId = $(`#${self.timeline.id} #${pointId}`).parent().next()[0].id;
    }
    else {
        subDivisionId = self.activeSubDivion;
        active = true;
    }
    
    if (!subDivisionId) return;

    const subPoint = new SubPoint(self, subDivisionId);

    const [infoCard, infoCardHtml] = createSubInfoCard(subPoint.id, frontInfo, backInfo);

    subPoint.infoCard = infoCard;

    self.timeline.subDivisions[subDivisionId].subPoints[subPoint.id] = subPoint;

    const numSubPoints = Object.keys(self.timeline.subDivisions[subDivisionId].subPoints).length;

    if (numSubPoints > 6) {
        self.timeline.subDivisions[subDivisionId].height = 250 + ((numSubPoints-6) * 45);
        self.timeline.subDivisions[subDivisionId].marginBottom = 519 + ((numSubPoints-6) * 72);
        self.timelineWrapperElement.style.height = (990 + ((numSubPoints-6) * 118)) + 'px';
    }

    const overlay =`<div class='overlay'></div>`
    const subPointHtml = `<div class='wrapper-sub-point' id='wrapper-${subPoint.id}'><div class='sub-point' id='${subPoint.id}'>${overlay}${infoCardHtml}</div></div>`;

    addNewSubPointToTimeline(self, subPointHtml, subDivisionId, active);
}

function createPoint(self, title = 'point', info="N/A") {
    const point = new Point(self, title);
    const [infoCard, infoCardHtml] = createInfoCard(point.id, info);
    point.infoCard = infoCard;
    const pointHtml = `<div class='wrapper-point' id='wrapper-${point.id}'><input type='text' id='${point.id}' class='point' value='${point.title}' readonly>${infoCardHtml}</div>`;
    return [point, pointHtml];
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
                                    <h2 class='back-header'>Sub Point Information</h2>
                                    <textarea class='info-textbox'>${backInfo}</textarea>
                                </div>
                            </div>
                        </div>`

    return [infoCard, infoCardHtml];

}

function createSubDivision(self) {
    const subDivision = new SubDivision(self);
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

function addNewPointToTimeline(self, pointHTML, subDivisionHtml) {
    self.pointEndElement.insertAdjacentHTML('beforebegin', pointHTML);
    self.pointEndElement.insertAdjacentHTML('beforebegin', subDivisionHtml);
}

function addNewSubPointToTimeline(self, subPointHTML, subDivisionId, active) {
    self.timelineElement.querySelector(`#${subDivisionId}`).insertAdjacentHTML('beforeend', subPointHTML);
    if (active) {
        $(`#${self.timeline.id} #${subDivisionId}`).css({'height': self.timeline.subDivisions[`${subDivisionId}`].height,
            'margin-bottom': self.timeline.subDivisions[`${subDivisionId}`].marginBottom});
        $(`#${self.timeline.id} #${subDivisionId} .wrapper-sub-point`).toggleClass('display-flex', true);
    }
}

function zoomDivision(self, event) {
    self.activeSubDivion = event.target.id;
    const prevDiv = $(`#${self.timeline.id} #${event.target.id}`).prev();
    const nextDiv = $(`#${self.timeline.id} #${event.target.id}`).next();
    let eventFired = 0;
    let newHeight = '800px'
    $(`#${self.timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', true);
    $(`#${self.timeline.id} .wrapper-point .info-card`).toggleClass('appear-info-card', false);
    $(`#${self.timeline.id} .wrapper-point`).prop("disabled", true);

    $(`#${self.timeline.id} .subdivision`).toggleClass('subdivision-zoom', true);
    $(`#${self.timeline.id} .subdivision`).prop("disabled", true);
    $(`#${self.timeline.id} .subdivision:not(#${event.target.id})`).toggleClass("cursor-not-allowed", true)
    $(`#${self.timeline.id} #${event.target.id}`).prop("disabled", false);
    $(`#${self.timeline.id} #${event.target.id}`).css({'height': self.timeline.subDivisions[`${event.target.id}`].height,
        'margin-bottom': self.timeline.subDivisions[`${event.target.id}`].marginBottom});
    $(`#${self.timeline.id} #${event.target.id} .wrapper-sub-point`).toggleClass('display-flex', true);

    $(`#${self.timeline.id} #${event.target.id}`).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
        () => {
            if(eventFired) {
                self.timelineWrapperElement.style.overflowY = 'hidden';
                self.timelineWrapperElement.style.height = newHeight;
                return;
            }

            self.timelineWrapperElement.scrollTop =  self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop;

            const startPoint = self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop;
            const startDiv = self.timelineElement.querySelector(`#${event.target.id}`).offsetTop;
            const endDiv = self.timelineElement.querySelector(`#${nextDiv[0].id}`).offsetTop

            newHeight = (startDiv + endDiv + 33 - 2*startPoint) + 'px';
            eventFired = 1;
        });

}


function clickListener (self, event) {
    if(!event.target.id) {
        return;
    }
    
    if ($(`#${event.target.id}`).prop('disabled')) {
        return;
    }
    else if(event.target.className === 'subdivision' ) {  
        zoomDivision(self, event); 
    }
    else if(event.target.className === 'subdivision subdivision-zoom') {
        self.activeSubDivion = null;
        $(`#${self.timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', false);
        $(`#${self.timeline.id} .subdivision`).toggleClass('subdivision-zoom', false);
        $(`#${self.timeline.id} .subdivision`).prop("disabled", false);
        $(`#${self.timeline.id} .wrapper-point`).prop("disabled", false);
        $(`#${self.timeline.id} #${event.target.id}`).removeAttr("style");
        $(`#${self.timeline.id} #${event.target.id} .wrapper-sub-point`).toggleClass('display-flex', false);
        $(`#${self.timeline.id} .subdivision:not(#${event.target.id})`).toggleClass("cursor-not-allowed", false)
        self.timelineWrapperElement.style = '';
    }
    else if(event.target.className === 'sub-point') {
        $(`#${self.timeline.id} #${event.target.id} .sub-info-card`).toggleClass('appear-sub-info-card');
    }
    else if(event.target.className === 'sub-info-card-front') {
        const pointIdx = $(`#${self.timeline.id} #${event.target.id}`).closest('.wrapper-sub-point').index()
        $(`#${self.timeline.id} #${event.target.id}`).next().css({'margin-top': (35-pointIdx*55)+'px'})
        $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').prev().css({'display': 'block'});
        $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').css({'z-index': '501'})
        $(`#${self.timeline.id} #${event.target.id}`).toggleClass('flip-180',true);
        $(`#${self.timeline.id} #${event.target.id}`).next().toggleClass('flip-0',true);

    }
    else if(event.target.className === 'sub-info-card-back focused-info-card flip-0') {
        $(`#${self.timeline.id} #${event.target.id}`).toggleClass('flip-0',false);
        $(`#${self.timeline.id} #${event.target.id}`).prev().toggleClass('flip-180',false);
        $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').removeAttr('style');
        $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').prev().removeAttr('style');
    }
    else if(event.target.className === 'point') {
        $(`#${self.timeline.id} #${event.target.id}`).next().toggleClass('appear-info-card');
    }
}

function changeListener (self, event) {
    if(event.target.className === 'point') {
        self.timeline.points[event.target.id].title = event.target.value
    }
}