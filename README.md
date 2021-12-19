# Advanced Timeline JS Library

## Website Link
https://advancedtimeline.herokuapp.com/landingPage.html

## Documentation Link
https://advancedtimeline.herokuapp.com/documentation.html

## Getting Started

### Step 1: Install jQuery
This library requires the external library jQuery to function. You can install it using the instructions on their webpage (https://jquery.com/download/) or you can include the script in your html file using the code below.

```
<script defer src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
```


### Step 2: Install the Advanced Timeline Library
Download the library's css and javascript files from the documentation page on the library's website.

Include the css file in your html file using the code below

```
<link rel='stylesheet' type='text/css' href='AdvancedTimeline.css'></link>
```

Include the javascript file in your html file using the code below

```
<script defer type="text/javascript" src="AdvancedTimeline.js"></script>
```


### Step 3: Initialize an Advanced Timeline
Create a javascript file and include the script in your html file using the code below.

```
<script defer type="text/javascript" src="example.js"></script>
```

Call the constructor function to create an AdvancedTimeline object.

```
const timeline = new AdvancedTimeline();
```


### Step 4: Create a Timeline
Use the makeTimeline method to create a timeline. Provide the id of the DOM element in which you would like to create the timeline as the first parameter. Specify the value of the starting and ending points.

Optionally, you can specify a description of these points. This function returns the id of the starting and ending points.

```
const [startPoint, endPoint] = timeline.makeTimeline('#example1', false, 'white',  "Start", "End", 'Starting Point', 'EndPoint')
```

### Step 5: Create a Point
Use the makeNewPoint method to create a point. Provide the value of the point as the first parameter. Optionally, you can specify a description of the point. This function returns the point's id.

```
const middlePoint = timeline.makeNewPoint("Middle", 'Middle Point')
```

### Step 6: Create a Subpoint
Use the makeSubPoint method to create a subpoint for a point. Provide the id of the point in which you would like to create the sub point as the first parameter. Specify the value of the subpoint and optionally a description for it. This function returns the subpoint's id.

```
const subPoint = timeline.makeSubPoint(startPoint, "Point 1", "Point 1 Information")
```

### Step 7: Add Text to a Subpoint's Information Card
Use the addTextElementToSubPoint method to add text to the subPoint's information card. Provide the id of the subpoint in which you would like to add the text as the first parameter. Specify the value of the text. You can also add images, audio, and video elements.

```
timeline.addTextElementToSubPoint(subPoint, 'This is the first subpoint')
```