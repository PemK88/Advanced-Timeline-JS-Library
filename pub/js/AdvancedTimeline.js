'use strict';

(function(global, document, $) { 

    function AdvancedTimeline() {
        this.timeline = null;
        this.timelineElement = null;
        this.timelineWrapperElement = null;
        this.activeSubDivion = null;
        this.pointEndElement = null;
        this.horizontal = false;
    }

    AdvancedTimeline.prototype = {
        makeTimeline: createTimeline,
        makeNewPoint: createNewPoint,
        makeSubPoint: createSubPoint,
        addAudioToSubPoint: createAudioelement,
        addTextElementToSubPoint: createTextElement,
        addImageElementToSubPoint: createImageElement,
        addVideoElementToSubPoint: createVideoElement
    }

    class Timeline {
        constructor(backgroundColor='white') {
            this.id = 'advanced-timeline-' + (document.querySelectorAll('.advanced-timeline').length + document.querySelectorAll('.horizontal-advanced-timeline').length);
            this.wrapperId = 'wrapper-advanced-timeline-' + (document.querySelectorAll('.wrapper-advanced-timeline').length + document.querySelectorAll('.horizontal-wrapper-advanced-timeline').length);
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
            this.width = '250px';
            this.marginBottom = '235px';
            this.marginRight = '140px'
            this.marginLeft = '155px'
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

    function createTimeline (domElement='body', horizontal=false, backgroundColor='white', startTitle='Start', endTitle='End', startInfo="N/A", endInfo="N/A") {
        const self = this;
        if(!isColor(backgroundColor)) {
            backgroundColor = 'white';
        }

        if (self.timeline) return;
        self.timeline = new Timeline(backgroundColor);
        self.horizontal = (horizontal === true) ? true : false;
        const [point, pointHTML] = createPoint(self, startTitle, startInfo);
        self.timeline.points[point.id] = point;
        const [pointEnd, pointEndHTML] = createPoint(self, endTitle, endInfo, true);
        self.timeline.points[pointEnd.id] = pointEnd;
        const [subDivision, subDivisionHtml] = createSubDivision(self);
        self.timeline.points[point.id] = point;
        self.timeline.subDivisions[subDivision.id] = subDivision;
        

        addTimelineToDocument(self, domElement, self.timeline.id, self.timeline.wrapperId, pointHTML, pointEndHTML, subDivisionHtml);

        self.timelineElement = document.querySelector(`#${self.timeline.id}`);
        self.timelineElement.addEventListener('click', (event) => {clickListener(self, event)});

        self.timelineWrapperElement = document.querySelector(`#${self.timeline.wrapperId}`);
        self.pointEndElement = self.timelineElement.querySelector('#wrapper-point-2');
        self.pointEndElement.querySelector('.point').style.backgroundColor = "#e54646";
        self.timelineWrapperElement.style.backgroundColor = self.timeline.backgroundColor;

        return [point.id, pointEnd.id];
    }

    function createNewPoint(pointTitle='Point', info="No Information", pointStyle={}, divisionStyle={}) {
        const self = this;
        if (!self.timeline || self.activeSubDivion) return;

        if(typeof pointTitle !== 'string') {
            pointTitle = 'Point';
        }
        const [point, pointHTML] = createPoint(self, pointTitle, info);
        const [subDivision, subDivisionHtml] = createSubDivision(self);
        self.timeline.points[point.id] = point;
        self.timeline.subDivisions[subDivision.id] = subDivision;

        addNewPointToTimeline(self, pointHTML, subDivisionHtml, point.id, subDivision.id, pointStyle, divisionStyle);

        return point.id;
    }

    function createSubPoint(pointId = null, frontInfo="Click to see more information", backHeader="", style={}) {
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

        const [infoCard, infoCardHtml] = createSubInfoCard(subPoint.id, frontInfo, backHeader);

        subPoint.infoCard = infoCard;

        self.timeline.subDivisions[subDivisionId].subPoints[subPoint.id] = subPoint;

        const numSubPoints = Object.keys(self.timeline.subDivisions[subDivisionId].subPoints).length;

        if (!self.horizontal && numSubPoints > 6) {
            self.timeline.subDivisions[subDivisionId].height = 250 + ((numSubPoints-6) * 45);
            self.timeline.subDivisions[subDivisionId].marginBottom = 235 + ((numSubPoints-6) * 36);
            //only needed for dynamic timeline creation
            //self.timelineWrapperElement.style.height = (653 + ((numSubPoints-6) * 118)) + 'px';
        }
        else if(self.horizontal && numSubPoints > 3) {
            self.timeline.subDivisions[subDivisionId].width = 250 + ((numSubPoints-3) * 100);
            self.timeline.subDivisions[subDivisionId].marginRight = 140 + ((numSubPoints-3) * 43) - 2*(numSubPoints-2);
            self.timeline.subDivisions[subDivisionId].marginLeft = 155 + ((numSubPoints-3) * 40);
            //only needed for dynamic timeline creation
            //self.timelineWrapperElement.style.width = (1058 + ((numSubPoints-3) * 200)) + 'px';
        }

        const overlay =`<div class='overlay' style="background-color: ${self.timeline.backgroundColor};"></div>`
        const subPointHtml = `<div class='wrapper-sub-point' id='wrapper-${subPoint.id}'><div class='sub-point' id='${subPoint.id}'>${overlay}${infoCardHtml}</div></div>`;

        addNewSubPointToTimeline(self, subPointHtml, subDivisionId, active, subPoint.id, style);

        return subPoint.id;
    }

    function createPoint(self, title = 'point', info="N/A", end=false) {
        const point = new Point(self, title);
        const [infoCard, infoCardHtml] = createInfoCard(point.id, info);
        point.infoCard = infoCard;
        let pointHtml;

        if(end){
            pointHtml = `<div class='wrapper-point' id='wrapper-${point.id}' style='box-shadow: none;'><span class='zoomPopup'>Click Me!</span><input type='text' id='${point.id}' class='point' value='${point.title}' readonly>${infoCardHtml}</div>`;
        
        }
        else {
            pointHtml = `<div class='wrapper-point' id='wrapper-${point.id}'><span class='zoomPopup'>Click Me!</span><input type='text' id='${point.id}' class='point' value='${point.title}' readonly>${infoCardHtml}</div>`;
        }
        return [point, pointHtml];
    }

    function createInfoCard(pointId, info="N/A") {
        const infoCard = new InfoCard(pointId, info);
        const infoCardHtml = `<div class='info-card' id='${infoCard.id}'><p class='info-card-front-text'>${infoCard.value}<p></div>`

        return [infoCard, infoCardHtml];
    }

    function createSubInfoCard(subPointId, frontInfo="Click to see more information", backHeader="") {
        const infoCard = new SubInfoCard(subPointId, frontInfo, backHeader);
        const infoCardHtml = `<div class='sub-info-card' id='${infoCard.id}'>
                                <div class='sub-info-card-inner' id='inner-${infoCard.id}'>
                                    <div class='sub-info-card-front' id='front-${infoCard.id}'>
                                        <p class='sub-info-card-front-text'>${infoCard.frontValue}<p>
                                    </div>
                                    <div class='sub-info-card-back focused-info-card' id='back-${infoCard.id}'>
                                        <h2 class='back-header'>${backHeader}</h2>
                                        <div class='close-btn' id='close-btn-back-${infoCard.id}'>X</div>
                                        <div class='info-textbox' id='elements-${infoCard.id}'></div>
                                    </div>
                                </div>
                            </div>`

        return [infoCard, infoCardHtml];

    }

    function createSubDivision(self) {
        const subDivision = new SubDivision(self);
        let subDivisionHtml;
        if(self.horizontal){
            subDivisionHtml = `<div id='${subDivision.id}' class='horizontal-subdivision'><span class='zoomPopup'>Zoom In</span></div>`;
        }
        else{
            subDivisionHtml = `<div id='${subDivision.id}' class='subdivision'><span class='zoomPopup'>Zoom In</span></div>`;
        }
        return [subDivision, subDivisionHtml];
    }

    function createAudioelement(subPointId, audioSrc, audioTitle="", top='', left='', right='', bottom='', styles={}) {
        if(!audioSrc || !subPointId){
            return;
        }
        const self = this;
        const division = self.horizontal ? '.horizontal-subdivision' : '.subdivision';
        const subDivisionId = $(`#${self.timeline.id} #${subPointId}`).closest(`${division}`)[0].id;
        const subInfoCardId = $(`#${self.timeline.id} #${subPointId} .sub-info-card`)[0].id;
        const elementsLength = (Object.keys(self.timeline.subDivisions[subDivisionId].subPoints[subPointId].infoCard.elements).length + 1)
        const elementDivId = $(`#${self.timeline.id} #${subPointId} .sub-info-card-back .info-textbox`)[0].id;

        const audio = {
            id: 'element-' + elementsLength + '-' + subInfoCardId,
            src: audioSrc,
            title: audioTitle
        };

        self.timeline.subDivisions[subDivisionId].subPoints[subPointId].infoCard.elements[audio.id] = audio;

        let positions = '';

        if(typeof top === 'number'){
            positions += ('top: ' + top + 'px;')
        }
        if(typeof left === 'number'){
            positions += ('left: ' + left + 'px;')
        }
        if(typeof right === 'number'){
            positions += ('right: ' + right + 'px;')
        }
        if(typeof bottom === 'number'){
            positions += ('bottom: ' + bottom + 'px;')
        }

        addAudioElement(self, audio, elementDivId, positions, styles);

    }

    function createTextElement(subPointId, text='', top='', left='', right='', bottom='', styles={}) {
        if(!subPointId){
            return;
        }
        const self = this;
        const division = self.horizontal ? '.horizontal-subdivision' : '.subdivision';
        const subDivisionId = $(`#${self.timeline.id} #${subPointId}`).closest(`${division}`)[0].id;
        const subInfoCardId = $(`#${self.timeline.id} #${subPointId} .sub-info-card`)[0].id;
        const elementsLength = (Object.keys(self.timeline.subDivisions[subDivisionId].subPoints[subPointId].infoCard.elements).length + 1)
        const elementDivId = $(`#${self.timeline.id} #${subPointId} .sub-info-card-back .info-textbox`)[0].id;

        const textEl = {
            id: 'element-' + elementsLength + '-' + subInfoCardId,
            value: text
        };

        self.timeline.subDivisions[subDivisionId].subPoints[subPointId].infoCard.elements[textEl.id] = textEl;

        let positions = '';

        if(typeof top === 'number'){
            positions += ('top: ' + top + 'px;')
        }
        if(typeof left === 'number'){
            positions += ('left: ' + left + 'px;')
        }
        if(typeof right === 'number'){
            positions += ('right: ' + right + 'px;')
        }
        if(typeof bottom === 'number'){
            positions += ('bottom: ' + bottom + 'px;')
        }



        addTextElement(self, textEl, elementDivId, positions, styles);

    }

    function createImageElement(subPointId, imageSrc, top='', left='', right='', bottom='', styles={}) {
        if(!imageSrc || !subPointId){
            return;
        }

        const self = this;
        const division = self.horizontal ? '.horizontal-subdivision' : '.subdivision';
        const subDivisionId = $(`#${self.timeline.id} #${subPointId}`).closest(`${division}`)[0].id;
        const subInfoCardId = $(`#${self.timeline.id} #${subPointId} .sub-info-card`)[0].id;
        const elementsLength = (Object.keys(self.timeline.subDivisions[subDivisionId].subPoints[subPointId].infoCard.elements).length + 1)
        const elementDivId = $(`#${self.timeline.id} #${subPointId} .sub-info-card-back .info-textbox`)[0].id;

        const image = {
            id: 'element-' + elementsLength + '-' + subInfoCardId,
            src: imageSrc
        };

        self.timeline.subDivisions[subDivisionId].subPoints[subPointId].infoCard.elements[image.id] = image;

        let positions = '';

        if(typeof top === 'number'){
            positions += ('top: ' + top + 'px;')
        }
        if(typeof left === 'number'){
            positions += ('left: ' + left + 'px;')
        }
        if(typeof right === 'number'){
            positions += ('right: ' + right + 'px;')
        }
        if(typeof bottom === 'number'){
            positions += ('bottom: ' + bottom + 'px;')
        }



        addImageElement(self, image, elementDivId, positions, styles);

    }

    function createVideoElement(subPointId, videoSrc, webpageSrc=false, top='', left='', right='', bottom='', styles={}) {
        if(!videoSrc || !subPointId){
            return;
        }

        const self = this;
        const division = self.horizontal ? '.horizontal-subdivision' : '.subdivision';
        const subDivisionId = $(`#${self.timeline.id} #${subPointId}`).closest(`${division}`)[0].id;
        const subInfoCardId = $(`#${self.timeline.id} #${subPointId} .sub-info-card`)[0].id;
        const elementsLength = (Object.keys(self.timeline.subDivisions[subDivisionId].subPoints[subPointId].infoCard.elements).length + 1)
        const elementDivId = $(`#${self.timeline.id} #${subPointId} .sub-info-card-back .info-textbox`)[0].id;

        const video = {
            id: 'element-' + elementsLength + '-' + subInfoCardId,
            src: videoSrc
        };

        self.timeline.subDivisions[subDivisionId].subPoints[subPointId].infoCard.elements[video.id] = video;

        let positions = '';

        if(typeof top === 'number'){
            positions += ('top: ' + top + 'px;')
        }
        if(typeof left === 'number'){
            positions += ('left: ' + left + 'px;')
        }
        if(typeof right === 'number'){
            positions += ('right: ' + right + 'px;')
        }
        if(typeof bottom === 'number'){
            positions += ('bottom: ' + bottom + 'px;')
        }



        addVideoElement(self, video, elementDivId, positions, styles, webpageSrc);

    }

    //DOM manipulating functions
    function addAudioElement(self, audio, elementDivId, positions, styles) {
        const audioHTML = `<div style='display: inline-flex;height: fit-content;${(positions ? 'position: absolute;' + positions : '')}'>
            <h3 class='audio-title'  id='title-${audio.id}'>${audio.title}</h3>
            <div class='audio-icon' id='${audio.id}'>
                <div class='audio-icon-square' id='square-${audio.id}'></div>
                <div class='audio-icon-triangle' id='triangle-${audio.id}'></div>
            </div>
            <audio id='audio-${audio.id}' hidden>
                <source src='${audio.src}' type="audio/mp3">
            </audio>
            
        </div>`
        
        self.timelineElement.querySelector(`#${elementDivId}`).insertAdjacentHTML('beforeend', audioHTML);

        if(styles !== {} && (typeof styles === 'object')) {
            $(`#${self.timeline.id} #${elementDivId} #title-${audio.id}`).css(styles)
        }
    }

    function addTextElement(self, text, elementDivId, positions, styles) {
        const textHTML = `<div class='text' id='${text.id}' style='${(positions ? 'position: absolute;' + positions : '')}'>${text.value}</div>`

        self.timelineElement.querySelector(`#${elementDivId}`).insertAdjacentHTML('beforeend', textHTML);

        if((typeof styles === 'object') && (Object.keys(styles).length !== 0)) {
            $(`#${self.timeline.id} #${elementDivId} #${text.id}`).css(styles)
        }
    }

    function addImageElement(self, image, elementDivId, positions, styles) {
        const imageHTML = `<img src='${image.src}' alt='element' id='${image.id}' style='${(positions ? 'position: absolute;' + positions : '')}'/>`

        self.timelineElement.querySelector(`#${elementDivId}`).insertAdjacentHTML('beforeend', imageHTML);

        if((typeof styles === 'object') && (Object.keys(styles).length !== 0)) {
            $(`#${self.timeline.id} #${elementDivId} #${image.id}`).css(styles)
        }
    }

    function addVideoElement(self, video, elementDivId, positions, styles, webpageSrc) {

        let videoHTML;

        if(webpageSrc === true) {
            videoHTML = `<iframe id='${video.id}' src='${video.src}' style='${(positions ? 'position: absolute;' + positions : '')}' frameborder='0' allowfullscreen>`
        }
        else {
            videoHTML = `<video id='${video.id}' style='${(positions ? 'position: absolute;' + positions : '')}' controls>
                <source src='${video.src}' type="video/mp4">
            </video>`
        }

        self.timelineElement.querySelector(`#${elementDivId}`).insertAdjacentHTML('beforeend', videoHTML);
        $(`#${self.timeline.id} #${elementDivId} #${video.id}`).css({ width: '140px', height: '100px'})
    

        if((typeof styles === 'object') && (Object.keys(styles).length !== 0)) {
            $(`#${self.timeline.id} #${elementDivId} #${video.id}`).css(styles)
        }
    }

    function addTimelineToDocument(self, domElement, timelineId, wrapperId, pointHTML, pointEndHTML, subDivisionHtml) {
        const body = document.querySelector(`${domElement}`);
        let newTimeline;

        if(self.horizontal){
            newTimeline = `<div id='${wrapperId}' class='horizontal-wrapper-advanced-timeline'>
            <ul id='${timelineId}' class='horizontal-advanced-timeline'>` + pointHTML + subDivisionHtml + pointEndHTML +'</ul></div>';
        }
        else {
            newTimeline = `<div id='${wrapperId}' class='wrapper-advanced-timeline'>
            <ul id='${timelineId}' class='advanced-timeline'>` + pointHTML + subDivisionHtml + pointEndHTML +'</ul></div>';
        
        }
    
        body.insertAdjacentHTML('beforeend', newTimeline);
    }

    function addNewPointToTimeline(self, pointHTML, subDivisionHtml, pointID, divisionID, pointStyle={}, divisionStyle={}) {
        self.pointEndElement.insertAdjacentHTML('beforebegin', pointHTML);
        self.pointEndElement.insertAdjacentHTML('beforebegin', subDivisionHtml);
        if((typeof pointStyle === 'object') && (Object.keys(pointStyle).length !== 0)) {
            $(`#${self.timeline.id} #${pointID} `).css(pointStyle)
        }
        if((typeof divisionStyle === 'object') && (Object.keys(divisionStyle).length !== 0)) {
            $(`#${self.timeline.id} #${divisionID} `).css(divisionStyle);
        }
    }

    function addNewSubPointToTimeline(self, subPointHTML, subDivisionId, active, subPointId, style={}) {
        self.timelineElement.querySelector(`#${subDivisionId}`).insertAdjacentHTML('beforeend', subPointHTML);
        if (active) {
            if(self.horizontal){
                $(`#${self.timeline.id} #${subDivisionId}`).css({'width': self.timeline.subDivisions[`${subDivisionId}`].width,
                'margin-right': self.timeline.subDivisions[`${subDivisionId}`].marginRight});
                $(`#${self.timeline.id} #${subDivisionId} .wrapper-sub-point`).toggleClass('display-flex', true);
                $(`#${self.timeline.id} #${subDivisionId}`).prev().css({'margin-right': self.timeline.subDivisions[`${subDivisionId}`].marginLeft});
            }
            else{
                $(`#${self.timeline.id} #${subDivisionId}`).css({'height': self.timeline.subDivisions[`${subDivisionId}`].height,
                'margin-bottom': self.timeline.subDivisions[`${subDivisionId}`].marginBottom});
                $(`#${self.timeline.id} #${subDivisionId} .wrapper-sub-point`).toggleClass('display-flex', true);
            }
        }
        if((typeof style === 'object') && (Object.keys(style).length !== 0)) {
            $(`#${self.timeline.id} #${subDivisionId} #${subPointId} `).css(style);
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

        $(`#${self.timeline.id} .subdivision`).css({'box-shadow': 'none'});
        $(`#${self.timeline.id} .subdivision`).toggleClass('subdivision-zoom', true);
        $(`#${self.timeline.id} .subdivision`).prop("disabled", true);
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

                const startPoint = self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetTop;
                const startDiv = self.timelineElement.querySelector(`#${event.target.id}`).offsetTop;
                const endDiv = self.timelineElement.querySelector(`#${nextDiv[0].id}`).offsetTop

                newHeight = (startDiv + endDiv + 55 - 2*startPoint) + 'px';
                eventFired = 1;
            });

    }


    function zoomIntoDivisionHorizontal(self, event) {
        self.activeSubDivion = event.target.id;
        const prevDiv = $(`#${self.timeline.id} #${event.target.id}`).prev();
        const nextDiv = $(`#${self.timeline.id} #${event.target.id}`).next();
        let eventFired = 0;
        let newWidth = '800px'
        $(`#${self.timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', true);
        $(`#${self.timeline.id} .wrapper-point .info-card`).toggleClass('appear-info-card', false);
        $(`#${self.timeline.id} .wrapper-point .zoomPopup`).first().css({'visibility': 'hidden'});
        $(`#${self.timeline.id} .wrapper-point`).prop("disabled", true);
        $(`#${self.timeline.id} .horizontal-subdivision`).css({'box-shadow': 'none'});
        $(`#${self.timeline.id} .horizontal-subdivision`).toggleClass('horizontal-subdivision-zoom', true);
        $(`#${self.timeline.id} .horizontal-subdivision`).prop("disabled", true);
        $(`#${self.timeline.id} .horizontal-subdivision:not(#${event.target.id})`).toggleClass("cursor-not-allowed", true)
        $(`#${self.timeline.id} #${event.target.id}`).prop("disabled", false);
        $(`#${self.timeline.id} #${event.target.id}`).css({'width': self.timeline.subDivisions[`${event.target.id}`].width,
            'margin-right': self.timeline.subDivisions[`${event.target.id}`].marginRight,  'margin-left': '0px'});
        prevDiv.css({'margin-right': self.timeline.subDivisions[`${event.target.id}`].marginLeft});
        $(`#${self.timeline.id} #${event.target.id} .wrapper-sub-point`).toggleClass('display-flex', true);
        $(`#${self.timeline.id} #${event.target.id} .zoomPopup`).css({'display': 'none'});
        $(`#${self.timeline.id} #${event.target.id}`).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
            () => {
                if(eventFired) {
                    self.timelineWrapperElement.style.overflow = 'hidden';
                    self.timelineWrapperElement.style.width = newWidth;
                    return;
                }
                self.timelineWrapperElement.scrollTo({left: (self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetLeft - 20), behavior: 'smooth'});

                const startPoint = self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetLeft;
                const startDiv = self.timelineElement.querySelector(`#${event.target.id}`).offsetLeft;
                const endDiv = self.timelineElement.querySelector(`#${nextDiv[0].id}`).offsetLeft

                newWidth = (startDiv + endDiv - 2*startPoint) + 'px';
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
        $(`#${self.timeline.id} #${id}`).css({'height': '', 'margin-bottom':''})
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
                    $(`#${self.timeline.id} .subdivision`).css({'box-shadow': ''});
                    return;
                }
                eventFired = 1;
            });
    }

    function zoomOutOfDivisionHorizontal(self, id) {
        self.activeSubDivion = null;
        let eventFired = 0;
        const prevDiv = $(`#${self.timeline.id} #${id}`).prev();
        $(`#${self.timeline.id} .horizontal-subdivision`).css({'box-shadow': ''});
        $(`#${self.timeline.id} .wrapper-point`).toggleClass('wrapper-point-visible', false);
        $(`#${self.timeline.id} .horizontal-subdivision`).toggleClass('horizontal-subdivision-zoom', false);
        $(`#${self.timeline.id} .horizontal-subdivision`).prop("disabled", false);
        $(`#${self.timeline.id} .wrapper-point`).prop("disabled", false);
        $(`#${self.timeline.id} #${id}`).css({'width': '', 'margin-right':'', 'margin-left': ''});
        prevDiv.css({'margin-right': ''})
        $(`#${self.timeline.id} #${id} .wrapper-sub-point`).toggleClass('display-flex', false);
        $(`#${self.timeline.id} .horizontal-subdivision:not(#${id})`).toggleClass("cursor-not-allowed", false);
        $(`#${self.timeline.id} .wrapper-point .zoomPopup`).first().css({'visibility': 'visible'});

        //remove height
        self.timelineWrapperElement.style = '';
        self.timelineWrapperElement.style.backgroundColor = self.timeline.backgroundColor;

        $(`#${self.timeline.id} #${id}`).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
            () => {
                if(eventFired) {
                    self.timelineWrapperElement.scrollTo({left: self.timelineElement.querySelector(`#${prevDiv[0].id}`).offsetLeft - 10, behavior: 'smooth'});
                    $(`#${self.timeline.id} .horizontal-subdivision`).css({'box-shadow': ''});
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
        const audios = self.timelineElement.querySelector(`#${id}`).querySelector('.info-textbox').querySelectorAll('audio')
        
        audios.forEach((audio,i) => {
            audio.pause();
            audio.currentTime = 0;
        })

        $(`#${self.timeline.id} #${id} .info-textbox .audio-icon-triangle`).css({'border-right-color': ''})
        $(`#${self.timeline.id} #${id} .info-textbox  .audio-icon-square`).css({'background': ''})
            
        $(`#${self.timeline.id} #${id}`).toggleClass('flip-0',false);
        $(`#${self.timeline.id} #${id}`).prev().toggleClass('flip-180',false);
        $(`#${self.timeline.id} #${id}`).closest('.sub-info-card').removeAttr('style');
        //remove overlay
        $(`#${self.timeline.id} #${id}`).closest('.sub-info-card').prev().css({'display': 'none'});
        $(`#${self.timeline.id} .subdivision`).toggleClass("disappear", false);
        $(`#${self.timeline.id} .wrapper-point`).toggleClass("disappear", false);
    }

    function displayBackSubInfoCardHorizontal(self, event) {
        const pointIdx = $(`#${self.timeline.id} #${event.target.id}`).closest('.wrapper-sub-point').index();
        const parentDivId = $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').parent().parent().parent()[0].id;
        $(`#${self.timeline.id} #${event.target.id}`).next().css({'margin-left': ((pointIdx-1)*(-67)) +'px'});

        //display overlay
        $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').prev().css({'display': 'block',
            'width': `${self.timelineWrapperElement.offsetWidth}px`, 'height': `${self.timelineWrapperElement.offsetHeight}px`});
        $(`#${self.timeline.id} #${event.target.id}`).closest('.sub-info-card').css({'z-index': '501'})
        $(`#${self.timeline.id} #${event.target.id}`).toggleClass('flip-180',true);
        $(`#${self.timeline.id} #${event.target.id}`).next().toggleClass('flip-0',true);
        $(`#${self.timeline.id} .horizontal-subdivision`).toggleClass("disappear", true);
        $(`#${self.timeline.id} #${parentDivId}`).toggleClass("disappear", false);
        $(`#${self.timeline.id} .wrapper-point`).toggleClass("disappear", true);

    }

    function displayFrontSubInfoCardHorizontal(self, id) {
        const audios = self.timelineElement.querySelector(`#${id}`).querySelector('.info-textbox').querySelectorAll('audio')
        
        audios.forEach((audio,i) => {
            audio.pause();
            audio.currentTime = 0;
        })

        $(`#${self.timeline.id} #${id} .info-textbox .audio-icon-triangle`).css({'border-right-color': ''})
        $(`#${self.timeline.id} #${id} .info-textbox  .audio-icon-square`).css({'background': ''})
            
        $(`#${self.timeline.id} #${id}`).toggleClass('flip-0',false);
        $(`#${self.timeline.id} #${id}`).prev().toggleClass('flip-180',false);
        $(`#${self.timeline.id} #${id}`).closest('.sub-info-card').removeAttr('style');
        //remove overlay
        $(`#${self.timeline.id} #${id}`).closest('.sub-info-card').prev().css({'display': 'none'});
        $(`#${self.timeline.id} .horizontal-subdivision`).toggleClass("disappear", false);
        $(`#${self.timeline.id} .wrapper-point`).toggleClass("disappear", false);
    }


    function togglePlay(self, audioId, id) {
        const audio = self.timelineElement.querySelector(`#${audioId}`)
        audio.paused ? $(`#${self.timeline.id} #${id} .audio-icon-triangle`).css({'border-right-color': '#2bb731'}) : $(`#${self.timeline.id} #${id} .audio-icon-triangle`).css({'border-right-color': ''});
        audio.paused ? $(`#${self.timeline.id} #${id} .audio-icon-square`).css({'background': '#2bb731'}) : $(`#${self.timeline.id} #${id} .audio-icon-square`).css({'background': ''});
        return audio.paused ? audio.play() : audio.pause();
    };

    function clickListener (self, event) {
        if(!event.target.id ) {
            return;
        }
        
        if ($(`#${self.timeline.id} #${event.target.id}`).prop('disabled')) {
            return;
        }
        else if(event.target.className === 'subdivision' ) {  
            zoomIntoDivision(self, event); 
        }
        else if(event.target.className === 'horizontal-subdivision' ) {  
            zoomIntoDivisionHorizontal(self, event); 
        }
        else if(self.activeSubDivion && event.target.id === self.timeline.id){
            self.horizontal ? zoomOutOfDivisionHorizontal(self, self.activeSubDivion) : zoomOutOfDivision(self, self.activeSubDivion);
        }
        else if(event.target.className === 'sub-point') {
            $(`#${self.timeline.id} #${event.target.id} .sub-info-card`).toggleClass('appear-sub-info-card');
        }
        else if(event.target.className === 'sub-info-card-front') {
            self.horizontal ?  displayBackSubInfoCardHorizontal(self, event) : displayBackSubInfoCard(self, event)
        }
        else if(event.target.className === 'close-btn') {
            const parentDivId = $(`#${self.timeline.id} #${event.target.id}`).parent()[0].id;

            self.horizontal ? displayFrontSubInfoCardHorizontal(self, parentDivId) : displayFrontSubInfoCard(self, parentDivId);
        }
        else if(event.target.className === 'point') {
            $(`#${self.timeline.id} #${event.target.id}`).next().toggleClass('appear-info-card');
            $(`#${self.timeline.id} #${event.target.id}`).prev().css({'display': 'none'});
        }
        else if(event.target.className === 'audio-icon-triangle' || event.target.className === 'audio-icon-square' || event.target.className === 'audio-icon') {
            const id = (event.target.className === 'audio-icon') ? event.target.id : $(`#${self.timeline.id} #${event.target.id}`).closest('.audio-icon')[0].id;
            togglePlay(self, `audio-${id}`, id);
        }
    }

    global.AdvancedTimeline = global.AdvancedTimeline || AdvancedTimeline

})(window, window.document, $);
