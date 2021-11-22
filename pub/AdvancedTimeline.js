//global arrays
let timeline;
let timelineElement;
let timelineWrapperElement;
let activeSubDivion;

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
    }
}

class SubDivision {
    constructor() {
        this.id = 'sub-division-' + (Object.keys(timeline.subDivisions).length + 1);
        this.subPoints = {};
        this.height = '250px';
        this.marginBottom = '533px';
    }
}

class SubPoint {
    constructor(subDivisionId) {
        this.id = 'sub-point-' + (Object.keys(timeline.subDivisions[subDivisionId].subPoints).length + 1);
        this.infoCard = null;
    }
}

class SubInfoCard {
    constructor(subPointId) {
        this.id = 'sub-info-card-' + subPointId;
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

    addTimelineToDocument(timeline.id, timeline.wrapperId, pointHTML, subDivisionHtml);

    timelineElement = document.querySelector(`#${timeline.id}`);
    timelineElement.addEventListener('change', changeListener);
    timelineElement.addEventListener('click', clickListener);

    timelineWrapperElement = document.querySelector(`#${timeline.wrapperId}`);
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
    const pointHtml = `<div class='wrapper-point' id='wrapper-${point.id}'><input type='text' id='${point.id}' class='point' value='${point.title}' readonly></div>`;
    //const pointHtml = `<div id='${point.id}' class='point' contentEditable='true'>${point.title}</div>`;
    return [point, pointHtml];
}

function createSubPoint(pointId = null) {
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

    const [infoCard, infoCardHtml] = createSubInfoCard(subPoint.id);

    subPoint.infoCard = infoCard;

    timeline.subDivisions[subDivisionId].subPoints[subPoint.id] = subPoint

    const numSubPoints = Object.keys(timeline.subDivisions[subDivisionId].subPoints).length

    if ( numSubPoints > 6) {
        timeline.subDivisions[subDivisionId].height = 250 + ((numSubPoints-6) * 45);
        timeline.subDivisions[subDivisionId].marginBottom = 533 + ((numSubPoints-6) * 72);
    }

    
    const subPointHtml = `<div class='wrapper-sub-point' id='wrapper-${subPoint.id}'><div class='sub-point' id='${subPoint.id}'>${infoCardHtml}</div></div>`;

    addNewSubPointToTimeline(subPointHtml, subDivisionId, active);
    // //const pointHtml = `<div id='${point.id}' class='point' contentEditable='true'>${point.title}</div>`;
    // return [point, pointHtml];
}

function createSubInfoCard(subPointId) {

    const infoCard = new SubInfoCard(subPointId);
    const infoCardHtml = `<div class='sub-info-card' id='${infoCard.id}'>
                            <div class='sub-info-card-inner' id='inner-${infoCard.id}'>
                                <div class='sub-info-card-front' id='front-${infoCard.id}'>
                                    <h2 class='info-card-front-text'>HI<h2>
                                </div>
                                <div class='sub-info-card-back' id='back-${infoCard.id}'>
                                </div>
                            </div>
                        </div>`

    //const infoCardHtml = `<div class='sub-info-card-front' id='${infoCard.id}-front'><h2 class='info-card-front-text'>HI<h2></div>`;

    return [infoCard, infoCardHtml];

}

function createSubDivision() {
    const subDivision = new SubDivision();
    const subDivisionHtml = `<div id='${subDivision.id}' class='subdivision'></div>`;
    return [subDivision, subDivisionHtml];
}

//DOM manipulating funcs

function addTimelineToDocument(timelineId, wrapperId, pointHTML, subDivisionHtml) {
    const body = document.querySelector('body');
    const newTimeline = `<div id='${wrapperId}' class='wrapper-advanced-timeline'><ul id='${timelineId}' class='advanced-timeline'>` + pointHTML + subDivisionHtml + '</ul></div>';
    body.insertAdjacentHTML('beforeend', newTimeline);
}

function addNewPointToTimeline(pointHTML, subDivisionHtml) {
    timelineElement.insertAdjacentHTML('beforeend', pointHTML);
    timelineElement.insertAdjacentHTML('beforeend', subDivisionHtml);
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
    let eventFired = 0;
    console.log(timelineWrapperElement.scrollTop + " old scroll top")
    const prevScrollTop = timelineWrapperElement.scrollTop;
    //console.log($(`#${prevDiv[0].id}`).position());
    $(`#${timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', true);
    $(`#${timeline.id} .wrapper-point`).prop("disabled", true);
    $(`#${timeline.id} .subdivision`).toggleClass('subdivision-zoom', true);
    $(`#${timeline.id} .subdivision`).prop("disabled", true);
    $(`#${timeline.id} .subdivision:not(#${event.target.id})`).toggleClass("cursor-not-allowed", true)
    $(`#${timeline.id} #${event.target.id}`).prop("disabled", false);
    $(`#${timeline.id} #${event.target.id}`).css({'height': timeline.subDivisions[`${event.target.id}`].height,
        'margin-bottom': timeline.subDivisions[`${event.target.id}`].marginBottom});
    $(`#${timeline.id} #${event.target.id} .wrapper-sub-point`).toggleClass('display-flex', true);
    // console.log(document.getElementById(`${prevDiv[0].id}`).offsetTop + " 1");
    // console.log(document.querySelector(`#${prevDiv[0].id}`).offsetTop);

    $(`#${timeline.id} #${event.target.id}`).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
        () => {
            if(eventFired) {
                return;
            }
            //sconsole.log(document.querySelector(`#${prevDiv[0].id}`).offsetTop + " target position");
            const curScrollTop = $('#wrapper-advanced-timeline-0').scrollTop();
            //debugger;
            const offSet = $('#wrapper-advanced-timeline-0').position().top;
            
            const newScrollTop = $(`#${prevDiv[0].id}`).position().top;
            //debugger;
            
            //console.log(timelineWrapperElement.scrollTop + " new scroll top 1")
            console.log('currrent scroll top ' + curScrollTop)
            console.log('new scroll top position' + newScrollTop)
            console.log('new scroll top offset' + document.querySelector(`#${prevDiv[0].id}`).offsetTop)
            console.log('offset ' + offSet)


            timelineWrapperElement.scrollTop =  timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop;
            // timelineWrapperElement.animate({
            //     scrollTop: document.querySelector(`#${prevDiv[0].id}`).offsetTop},
            //     'slow');
            //debugger;
            //timelineWrapperElement.scrollTo(0, document.querySelector(`#${prevDiv[0].id}`).offsetTop);
            console.log(timelineWrapperElement.scrollTop + " new scroll top")
            //console.log((prevScrollTop + newScrollTop - offSet) + " proposed scroll top")
            eventFired = 1;
            // timelineWrapperElement.scrollTo({
            //     top: document.querySelector(`#${prevDiv[0].id}`).offsetTop,
            //     left: 0,
            //     behavior: 'smooth'
            // });
        });
    //document.getElementById(`${event.target.id}`).addEventListener("transitionend", () => {console.log($(`#${prevDiv[0].id}`).position());}, true);


    // timelineWrapperElement.scrollTo({
    //     top: document.getElementById(`${prevDiv[0].id}`).offsetTop,
    //     left: 100,
    //     behavior: 'smooth'
    //   });


}

// var scrollyDiv = document.getElementById("container");
// scrollyDiv.scrollTop = scrollyDiv.scrollHeight

function clickListener (event) {
    if(!event.target.id) {
        return;
    }
    
    if ($(`#${event.target.id}`).prop('disabled')) {
        return;
    }
    else if(event.target.className === 'subdivision' ) {  
        
        // const prevDiv = $(`#${event.target.id}`).prev();
        // const nextDiv = $(`#${event.target.id}`).next();

        console.log(event.target.id);
        // console.log(nextDiv[0].id);
        // $('.wrapper-point').not(`#${prevDiv[0].id} , #${nextDiv[0].id}`).css({opacity:'0'});
        // $('.wrapper-point').prop("disabled", true);
        // prevDiv.toggleClass('wrapper-point-visible', true);
        // nextDiv.toggleClass('wrapper-point-visible-next', true);

        

        // $(`.subdivision:not(#${event.target.id})`).css({opacity:'0'});
        // $(`.subdivision:not(#${event.target.id})`).prop("disabled", true);
        // //$(`#${event.target.id}`).css({opacity:'1'});
        // $(`#${event.target.id}`).prop("disabled", false);

        //timelineElement.querySelector(`#${event.target.id}`).className = 'subdivision subdivision-zoom';
        
        // $('.wrapper-point').toggleClass('wrapper-point-visible', true);
        // $('.subdivision').toggleClass('subdivision-zoom', true);
        // $(`.subdivision:not(#${event.target.id})`).prop("disabled", true);
        // $(`#${event.target.id}`).prop("disabled", false);
        // console.log($(`#${event.target.id}`).position());
        // console.log($(`#${event.target.id}`)[0]);
        // $(`#${event.target.id}`)[0].scrollIntoView(true);
        zoomDivision(event);

        // zoomDivision(event).then(
        //     (event) => {console.log(document.getElementById(`${event.target.id}`).offsetTop);
        //     console.log(2);}

        // )


        
    }

    else if(event.target.className === 'subdivision subdivision-zoom') {
        activeSubDivion = null;
        const prevDiv = $(`#${event.target.id}`).prev();
        $(`#${timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', false);
        $(`#${timeline.id} .subdivision`).toggleClass('subdivision-zoom', false);
        //$('.subdivision').css({transform: scale(2, 2.5)'margin-top' : '25px', 'margin-bottom': '401px', 'z-index': '200'});
        $(`#${timeline.id} .subdivision`).prop("disabled", false);
        $(`#${timeline.id} .wrapper-point`).prop("disabled", false);
        $(`#${timeline.id} #${event.target.id}`).removeAttr("style");
        $(`#${timeline.id} #${event.target.id} .wrapper-sub-point`).toggleClass('display-flex', false);
        $(`#${timeline.id} .subdivision:not(#${event.target.id})`).toggleClass("cursor-not-allowed", false)
        // console.log($(`#${prevDiv[0].id}`).position());
        // console.log(document.getElementById(`${prevDiv[0].id}`).offsetTop + " 2");
        // console.log(document.querySelector(`#${prevDiv[0].id}`).offsetTop);
        
        // timelineElement.querySelector(`#${event.target.id}`).className = 'subdivision';
        // $('.wrapper-point').css({opacity:'1'});
        // $(`#${event.target.id}`).prev().toggleClass('wrapper-point-visible', false);
        // $(`#${event.target.id}`).next().toggleClass('wrapper-point-visible-next', false);
        // $(`.subdivision:not(#${event.target.id})`).css({opacity:'1'});
        // $('.subdivision').prop("disabled", false);
    }
    else if(event.target.className === 'sub-point') {
        $(`#${timeline.id} #${event.target.id} .sub-info-card`).toggleClass('display');
    }
    else if(event.target.className === 'sub-info-card-front') {
        $(`#${timeline.id} #${event.target.id}`).toggleClass('flip-180',true);
        $(`#${timeline.id} #${event.target.id}`).next().toggleClass('flip-0',true);
    }
    else if(event.target.className === 'sub-info-card-back flip-0') {
        $(`#${timeline.id} #${event.target.id}`).toggleClass('flip-0',false);
        $(`#${timeline.id} #${event.target.id}`).prev().toggleClass('flip-180',false);
    }

    console.log(event.target.id);
    
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