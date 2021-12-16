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
    constructor(backgroundColor='white') {
        this.id = 'advanced-timeline-' + document.querySelectorAll('.advanced-timeline').length;
        this.wrapperId = 'wrapper-advanced-timeline-' + document.querySelectorAll('.wrapper-advanced-timeline').length;
        this.points = {};
        this.subDivisions = {};
        this.backgroundColor = backgroundColor;
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
        this.marginBottom = '235px';
        this.backgroundColor = null;
    }
}

class SubPoint {
    constructor(self, subDivisionId) {
        this.id = 'sub-point-' + (Object.keys(self.timeline.subDivisions[subDivisionId].subPoints).length + 1) + '-' + subDivisionId;
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
/*https://stackoverflow.com/questions/48484767/javascript-check-if-string-is-valid-css-color*/
function isColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
  }

function createTimeline (domElement='body', backgroundColor='white', startTitle='Start', endTitle='End', startInfo="N/A", endInfo="N/A") {
    const self = this;
    if(!isColor(backgroundColor)) {
        backgroundColor = 'white';
    }

    if (self.timeline) return;
    self.timeline = new Timeline(backgroundColor);
    const [point, pointHTML] = createPoint(self, startTitle, startInfo);
    self.timeline.points[point.id] = point;
    const [pointEnd, pointEndHTML] = createPoint(self, endTitle, endInfo);
    self.timeline.points[pointEnd.id] = pointEnd;
    const [subDivision, subDivisionHtml] = createSubDivision(self);
    self.timeline.points[point.id] = point;
    self.timeline.subDivisions[subDivision.id] = subDivision;

    addTimelineToDocument(domElement, self.timeline.id, self.timeline.wrapperId, pointHTML, pointEndHTML, subDivisionHtml);

    self.timelineElement = document.querySelector(`#${self.timeline.id}`);
    self.timelineElement.addEventListener('change', (event) => {changeListener(self, event)});
    self.timelineElement.addEventListener('click', (event) => {clickListener(self, event)});

    self.timelineWrapperElement = document.querySelector(`#${self.timeline.wrapperId}`);
    self.pointEndElement = self.timelineElement.querySelector('#wrapper-point-2');
    self.pointEndElement.querySelector('.point').style.backgroundColor = "#e54646";
    self.timelineWrapperElement.style.backgroundColor = self.timeline.backgroundColor;

    return [point.id, pointEnd.id];
}

function createNewPoint(pointTitle='Point', info="No Information") {
    const self = this;
    if (!self.timeline || self.activeSubDivion) return;

    if(typeof pointTitle !== 'string') {
        pointTitle = 'Point';
    }
    const [point, pointHTML] = createPoint(self, pointTitle, info);
    const [subDivision, subDivisionHtml] = createSubDivision(self);
    self.timeline.points[point.id] = point;
    self.timeline.subDivisions[subDivision.id] = subDivision;

    addNewPointToTimeline(self, pointHTML, subDivisionHtml);

    return point.id;
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
        self.timeline.subDivisions[subDivisionId].marginBottom = 235 + ((numSubPoints-6) * 36);
        self.timelineWrapperElement.style.height = (653 + ((numSubPoints-6) * 118)) + 'px';
    }

    const overlay =`<div class='overlay' style="background-color: ${self.timeline.backgroundColor};"></div>`
    const subPointHtml = `<div class='wrapper-sub-point' id='wrapper-${subPoint.id}'><div class='sub-point' id='${subPoint.id}'>${overlay}${infoCardHtml}</div></div>`;

    addNewSubPointToTimeline(self, subPointHtml, subDivisionId, active);
}

function createPoint(self, title = 'point', info="N/A") {
    const point = new Point(self, title);
    const [infoCard, infoCardHtml] = createInfoCard(point.id, info);
    point.infoCard = infoCard;
    const pointHtml = `<div class='wrapper-point' id='wrapper-${point.id}'><span class='zoomPopup'>Click Me!</span><input type='text' id='${point.id}' class='point' value='${point.title}' readonly>${infoCardHtml}</div>`;
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
                                    <h2 class='back-header'>Click me to go back</h2>
                                    <div class='close-btn' id='close-btn-back-${infoCard.id}'>X</div>
                                    <textarea class='info-textbox'>${backInfo}</textarea>
                                </div>
                            </div>
                        </div>`

    return [infoCard, infoCardHtml];

}

function createSubDivision(self) {
    const subDivision = new SubDivision(self);
    const subDivisionHtml = `<div id='${subDivision.id}' class='subdivision'><span class='zoomPopup'>Zoom In</span></div>`;
    return [subDivision, subDivisionHtml];
}

//DOM manipulating functions

function addTimelineToDocument(domElement, timelineId, wrapperId, pointHTML, pointEndHTML, subDivisionHtml) {
    const body = document.querySelector(`${domElement}`);
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

function zoomIntoDivision(self, event) {
    self.activeSubDivion = event.target.id;
    const prevDiv = $(`#${self.timeline.id} #${event.target.id}`).prev();
    const nextDiv = $(`#${self.timeline.id} #${event.target.id}`).next();
    let eventFired = 0;
    let newHeight = '800px'
    $(`#${self.timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', true);
    $(`#${self.timeline.id} .wrapper-point .info-card`).toggleClass('appear-info-card', false);
    $(`#${self.timeline.id} .wrapper-point .zoomPopup`).first().css({'visibility': 'hidden'});
    $(`#${self.timeline.id} .wrapper-point`).prop("disabled", true);

    $(`#${self.timeline.id} .subdivision`).toggleClass('subdivision-zoom', true);
    $(`#${self.timeline.id} .subdivision`).prop("disabled", true);
    $(`#${self.timeline.id} .subdivision`).css({'box-shadow': 'none'});
    $(`#${self.timeline.id} .subdivision:not(#${event.target.id})`).toggleClass("cursor-not-allowed", true)
    $(`#${self.timeline.id} #${event.target.id}`).prop("disabled", false);
    $(`#${self.timeline.id} #${event.target.id}`).css({'height': self.timeline.subDivisions[`${event.target.id}`].height,
        'margin-bottom': self.timeline.subDivisions[`${event.target.id}`].marginBottom});
    $(`#${self.timeline.id} #${event.target.id} .wrapper-sub-point`).toggleClass('display-flex', true);
    $(`#${self.timeline.id} #${event.target.id} .zoomPopup`).css({'display': 'none'});
    $(`#${self.timeline.id} #${event.target.id}`).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
        () => {
            if(eventFired) {
                self.timelineWrapperElement.style.overflow = 'hidden';
                self.timelineWrapperElement.style.height = newHeight;
                return;
            }
            self.timelineWrapperElement.scrollTo({top: self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop, behavior: 'smooth'});

            //self.timelineWrapperElement.scrollTop =  self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop;

            const startPoint = self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop;
            const startDiv = self.timelineElement.querySelector(`#${event.target.id}`).offsetTop;
            const endDiv = self.timelineElement.querySelector(`#${nextDiv[0].id}`).offsetTop

            newHeight = (startDiv + endDiv + 55 - 2*startPoint) + 'px';
            eventFired = 1;
        });

}

function zoomOutOfDivision(self, id) {
    self.activeSubDivion = null;
    let eventFired = 0;
    const prevDiv = $(`#${self.timeline.id} #${id}`).prev();
    $(`#${self.timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', false);
    $(`#${self.timeline.id} .subdivision`).toggleClass('subdivision-zoom', false);
    $(`#${self.timeline.id} .subdivision`).prop("disabled", false);
    $(`#${self.timeline.id} .wrapper-point`).prop("disabled", false);
    $(`#${self.timeline.id} #${id}`).removeAttr("style");
    $(`#${self.timeline.id} #${id} .wrapper-sub-point`).toggleClass('display-flex', false);
    $(`#${self.timeline.id} .subdivision:not(#${id})`).toggleClass("cursor-not-allowed", false);
    $(`#${self.timeline.id} .wrapper-point .zoomPopup`).first().css({'visibility': 'visible'});

    //remove height
    self.timelineWrapperElement.style = '';
    self.timelineWrapperElement.style.backgroundColor = self.timeline.backgroundColor;

    $(`#${self.timeline.id} #${id}`).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
        () => {
            if(eventFired) {
                self.timelineWrapperElement.scrollTo({top: self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop, behavior: 'smooth'});
                return;
            }
            eventFired = 1;
        });
}

function displayBackSubInfoCard(self, event) {
    const pointIdx = $(`#${self.timeline.id} #${event.target.id}`).closest('.wrapper-sub-point').index();
    const parentDivId = $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').parent().parent().parent()[0].id;
    $(`#${self.timeline.id} #${event.target.id}`).next().css({'margin-top': ((-(pointIdx+1)*30) + 10)+'px'});

    //display overlay
    $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').prev().css({'display': 'block'});
    $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').css({'z-index': '501'})
    $(`#${self.timeline.id} #${event.target.id}`).toggleClass('flip-180',true);
    $(`#${self.timeline.id} #${event.target.id}`).next().toggleClass('flip-0',true);
    $(`#${self.timeline.id} .subdivision`).toggleClass("disappear", true);
    $(`#${self.timeline.id} #${parentDivId}`).toggleClass("disappear", false);
    $(`#${self.timeline.id} .wrapper-point`).toggleClass("disappear", true);
}

function displayFrontSubInfoCard(self, id) {
    const parentDivId = $(`#${self.timeline.id} #${id}`).closest('.sub-info-card').parent().parent().parent()[0].id;
        
    $(`#${self.timeline.id} #${id}`).toggleClass('flip-0',false);
    $(`#${self.timeline.id} #${id}`).prev().toggleClass('flip-180',false);
    $(`#${self.timeline.id} #${id}`).closest('.sub-info-card').removeAttr('style');
    //remove overlay
    $(`#${self.timeline.id} #${id}`).closest('.sub-info-card').prev().css({'display': 'none'});
    $(`#${self.timeline.id} .subdivision`).toggleClass("disappear", false);
    $(`#${self.timeline.id} .wrapper-point`).toggleClass("disappear", false);
}



function clickListener (self, event) {
    if(!event.target.id) {
        return;
    }
    
    if ($(`#${self.timeline.id} #${event.target.id}`).prop('disabled')) {
        return;
    }
    else if(event.target.className === 'subdivision' ) {  
        zoomIntoDivision(self, event); 
    }
    // else if(event.target.className === 'subdivision subdivision-zoom') {
    //     zoomOutOfDivision(self, event.target.id);
    // }
    else if(self.activeSubDivion && event.target.id === self.timeline.id){
        zoomOutOfDivision(self, self.activeSubDivion);
    }
    else if(event.target.className === 'sub-point') {
        $(`#${self.timeline.id} #${event.target.id} .sub-info-card`).toggleClass('appear-sub-info-card');
    }
    else if(event.target.className === 'sub-info-card-front') {
        displayBackSubInfoCard(self, event)
    }
    // else if(event.target.className === 'sub-info-card-back focused-info-card flip-0') {
    //     displayFrontSubInfoCard(self, event.target.id)
    // }
    else if(event.target.className === 'close-btn') {
        const parentDivId = $(`#${self.timeline.id} #${event.target.id}`).parent()[0].id;
        displayFrontSubInfoCard(self, parentDivId);
    }
    else if(event.target.className === 'point') {
        $(`#${self.timeline.id} #${event.target.id}`).next().toggleClass('appear-info-card');
        $(`#${self.timeline.id} #${event.target.id}`).prev().css({'display': 'none'});
    }
}

function changeListener (self, event) {
    if(event.target.className === 'point') {
        self.timeline.points[event.target.id].title = event.target.value
    }
}