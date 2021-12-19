const timeline2 = new AdvancedTimeline();

const [point95, pointEnd] = timeline2.makeTimeline('#container2', true, '#2f3653',  "1995", "2018", 'Javascript Invention', 'ES2018', {'background-color': '#0bbb80', '--box-shadow-color': '#29d198'}, {'background-color': '#0bbb80', '--box-shadow-color': '#29d198'}, {'background-color': '#0bbb80', '--box-shadow-color': '#29d198'})
timeline2.makeNewPoint("1997", 'ECSMAScript (ES1)', {'background-color': '#0bbb80', '--box-shadow-color': '#29d198'}, {'background-color': '#0bbb80', '--box-shadow-color': '#29d198'});
timeline2.makeNewPoint("1998", 'ECSMAScript2 (ES2)', {'background-color': '#0bbb80', '--box-shadow-color': '#29d198'}, {'background-color': '#0bbb80', '--box-shadow-color': '#29d198'});

text = `In late 1995, Microsoft was starting to catch on to the competitive threat the world wide web posed. So the team at Microsoft started the Internet Explorer (IE) project in an attempt to take control of the emerging technology from Netscape through an “embrace, extend, extinguish” strategy`
const point95P1 = timeline2.makeSubPoint(point95, "Microsoft's IE project", "The Introduction of Internet Explorer", {'background-color': 'rgb(11, 187, 128)', '--box-shadow-color': '#29d198', 'border-color': '#139113'});
timeline2.addImageElementToSubPoint(point95P1, '../microsoft_logo.jpg', '','','','', {'width': '150px', 'height': '80px', 'margin': 'auto', 'border-radius': '5px'})
timeline2.addTextElementToSubPoint(point95P1, text, '', '', '', '', {'font-weight': '500', 'padding': '10px'})
timeline2.makeSubPoint(point95, "Netscape's Response", "The Introduction of Internet Explorer", {'background-color': 'rgb(11, 187, 128)', '--box-shadow-color': '#29d198', 'border-color': '#139113'});
timeline2.makeSubPoint(point95, "Sun Microsystems and Netscape Collaboration", "The Introduction of Internet Explorer", {'background-color': 'rgb(11, 187, 128)', '--box-shadow-color': '#29d198', 'border-color': '#139113'});
timeline2.makeSubPoint(point95, "Javascript Is Born", "The Introduction of Internet Explorer", {'background-color': 'rgb(11, 187, 128)', '--box-shadow-color': '#29d198', 'border-color': '#139113'});

const timeline3 = new AdvancedTimeline();
timeline3.makeTimeline('#container3', false)