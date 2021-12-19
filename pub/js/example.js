'use strict';

//basic timeline
const timeline4 = new AdvancedTimeline();

timeline4.makeTimeline('#example1', false, 'white',  "Start", "End", 'Starting Point', 'EndPoint')
timeline4.makeNewPoint("Middle", 'Middle Point')

//horizontal timeline
const timeline5 = new AdvancedTimeline();

timeline5.makeTimeline('#example2', true, 'white',  "Start", "End", 'Starting Point', 'EndPoint')
timeline5.makeNewPoint("Middle", 'Middle Point')


//timeline with sub points
const timeline6 = new AdvancedTimeline();

const [startPoint, endPoint] = timeline6.makeTimeline('#example3', false, 'white',  "Start", "End", 'Starting Point', 'EndPoint')

timeline6.makeSubPoint(startPoint, "Point 1 (Click Me)", "Point 1 Information")
timeline6.makeSubPoint(startPoint, "Point 2", "Point 2 Information")

const middlePoint = timeline6.makeNewPoint("Middle", 'Middle Point')
timeline6.makeSubPoint(middlePoint, "Point 1 (Click Me)", "Point 1 Information")

//styled timeline 
const timeline8 = new AdvancedTimeline();

const pointStyle = {
    'background-color': '#0bbb80',
    '--box-shadow-color': '#29d198'
}

const subDivisionStyle = {
    'background-color': '#0bbb80',
    '--box-shadow-color': 'rgb(58 220 165)'
}

const subStyle = {
    'background-color': 'rgb(11, 187, 128)',
    '--box-shadow-color': '#29d198',
    'border-color': '#139113'
};

const [startPoint1, endPoint1] = timeline8.makeTimeline('#example4', false, 'rgb(64 72 105)',  "Start", "End", 'Starting Point', 'EndPoint', pointStyle, subDivisionStyle, pointStyle);

timeline8.makeSubPoint(startPoint1, "Point 1 (Click Me)", "Point 1 Information", subStyle);
timeline8.makeSubPoint(startPoint1, "Point 2", "Point 2 Information", subStyle);

const middlePoint1 = timeline8.makeNewPoint("Middle", 'Middle Point', pointStyle, subDivisionStyle);
timeline8.makeSubPoint(middlePoint1, "Point 1 (Click Me)", "Point 1 Information", subStyle);


//subpoint with text elements
const timeline7 = new AdvancedTimeline();

const [startPoint2, endPoint2] = timeline7.makeTimeline('#example5', false, 'white',  "Start", "End", 'Starting Point', 'EndPoint')

const subPoint = timeline7.makeSubPoint(startPoint2, "Point 1 (Click Me)", "Point 1 Information")

//Create a regular text element
timeline7.addTextElementToSubPoint(subPoint, 'This is the first subpoint')

//Style a text element
const style = {
    'color': 'green',
    'font-size': '15px'
}

timeline7.addTextElementToSubPoint(subPoint, 'This is the first subpoint', '', '', '', '', style)

//Position a text element
timeline7.addTextElementToSubPoint(subPoint, 'This is the first subpoint', 50, 20, '', '')


//subpoint with image elements
const timeline10 = new AdvancedTimeline();

const [startPoint4, endPoint4] = timeline10.makeTimeline('#example6', false, 'white',  "Start", "End", 'Starting Point', 'EndPoint')

const subPoint2 = timeline10.makeSubPoint(startPoint4, "Point 1 (Click Me)", "Point 1 Information")

//Create a regular image element
timeline10.addImageElementToSubPoint(subPoint2, '../timeline.png')

//Style an image element
const style1 = {
    'width': '60px',
    'border': '1px solid orangered',
    "border-radius": '5px'
}

timeline10.addImageElementToSubPoint(subPoint2, '../timeline.png', '', '', '', '', style1)

//Position an image element
timeline10.addImageElementToSubPoint(subPoint2, '../timeline.png','', 40, '', 0)


//subpoint with audio elements
const timeline9 = new AdvancedTimeline();

const [startPoint3, endPoint3] = timeline9.makeTimeline('#example7', false, 'white',  "Start", "End", 'Starting Point', 'EndPoint')

const subPoint1 = timeline9.makeSubPoint(startPoint3, "Point 1 (Click Me)", "Point 1 Information")

//Create a regular audio element
timeline9.addAudioToSubPoint(subPoint1, '../piano_cover.mp3', 'Piano Cover')

//Style an audio element
const style2 = {
    'color': 'blue',
    'font-size': '15px'
}

timeline9.addAudioToSubPoint(subPoint1, '../piano_cover.mp3', 'Piano Cover', '', '', '', '', style2)

//Position an audio element
timeline9.addAudioToSubPoint(subPoint1, '../piano_cover.mp3', 'Piano Cover', '', '', '', 30)


//subpoint with video elements
const timeline11 = new AdvancedTimeline();

const [startPoint5, endPoint5] = timeline11.makeTimeline('#example8', false, 'white',  "Start", "End", 'Starting Point', 'EndPoint')

const subPoint3 = timeline11.makeSubPoint(startPoint5, "Point 1 (Click Me)", "Point 1 Information")

//Create a regular video element
timeline11.addVideoElementToSubPoint(subPoint3, '../TimelineExample.mp4')

//Style a video element
const style3 = {
    'width': '150px',
    'height': '',
    'border': '1px solid orangered'
}

timeline11.addVideoElementToSubPoint(subPoint3, '../TimelineExample.mp4', false, '', '', '', '', style3)

//Add video from a different webpage (ex.youtube)
timeline11.addVideoElementToSubPoint(subPoint3, 'https://www.youtube.com/embed/rTIAcCUaYsw', true, '', '', '', '')

//Position a video element
timeline11.addVideoElementToSubPoint(subPoint3, '../TimelineExample.mp4', false, '', 180, '', 30)


