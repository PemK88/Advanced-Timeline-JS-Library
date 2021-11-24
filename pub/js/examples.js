'use strict';

document.head.insertAdjacentHTML('beforeend', "<link rel='stylesheet' type='text/css' href='AdvancedTimeline.css'>");

const timeline1 = new AdvancedTimeline;

const [setup, end] = timeline1.makeTimeline('#container1', 'gainsboro',  "SETUP", "FINISHED", '2-3 Months Before Active Event', 'Event Completed!',)
const promote = timeline1.makeNewPoint("PROMOTE", '4-5 Weeks Before Active Event')
const remind = timeline1.makeNewPoint("REMIND",'1-7 Days Before Active Event') 
const inspire = timeline1.makeNewPoint('INSPIRE', "LIVE Day of Active Event")
const thank = timeline1.makeNewPoint('THANK', "1-3 Days of Active Event") 
const engage = timeline1.makeNewPoint("ENGAGE", "1-3 Days of Active Event")

timeline1.makeSubPoint(setup, "Goal 1 (click to see more information)", "Prepare participant, team and sponsor sign-up forms")
timeline1.makeSubPoint(setup, "Goal 2 (click to see more information)", "Prepare Peer-to-peer fundraising sign-up form")
timeline1.makeSubPoint(setup, "Goal 3 (click to see more information)", "Mobile number verification")
timeline1.makeSubPoint(setup, "Goal 4 (click to see more information)", "Text-to keywords and short links for social sharing")
timeline1.makeSubPoint(setup, "Goal 5 (click to see more information)", "Participant and donor email confirmations")
timeline1.makeSubPoint(setup, "Goal 6 (click to see more information)", "Instructions for fundraisers (toolkit)")

timeline1.makeSubPoint(remind, "Reminder 1 (click to see more information)", "Participant sign-up deadline")
timeline1.makeSubPoint(remind, "Reminder 2 (click to see more information)", "How many participants have signed up so far")
timeline1.makeSubPoint(remind, "Reminder 3 (click to see more information)", "Top fundraisers and teams so far")
timeline1.makeSubPoint(remind, "Reminder 4 (click to see more information)", "How much left to reach goal")
timeline1.makeSubPoint(remind, "Reminder 5 (click to see more information)", "Date, time and location via text and email (ongoing updates)")
timeline1.makeSubPoint(remind, "Reminder 6 (click to see more information)", "Tips for training")
timeline1.makeSubPoint(remind, "Reminder 7 (click to see more information)", "Out-of-towner donation options")

timeline1.makeSubPoint(promote, "Task 1 (click to see more information)", "Invitations via direct mail, text messaging, email and social media")
timeline1.makeSubPoint(promote, "Task 2 (click to see more information)", "Videos, photos and testimonials showcasing your campaign – participants will use to promote fundraising pages")
timeline1.makeSubPoint(promote, "Task 3 (click to see more information)", "Featured teams and participants")
timeline1.makeSubPoint(promote, "Task 4 (click to see more information)", "Sign-up and donation forms via team captains")

timeline1.makeSubPoint(inspire, "Inspiration 1 (click to see more information)", "Encourage participants via text all day long")
timeline1.makeSubPoint(inspire, "Inspiration 2 (click to see more information)", "Send fundraising goal results via text and email")
timeline1.makeSubPoint(inspire, "Inspiration 3 (click to see more information)", "Send special Instructions to team captains")
timeline1.makeSubPoint(inspire, "Inspiration 4 (click to see more information)", "Instruct everyone to post photos and videos to social all day long with event #hashtag")
timeline1.makeSubPoint(inspire, "Inspiration 5 (click to see more information)", "Show thermometer with all revenue totals and make asks to reach goal")

timeline1.makeSubPoint(engage, "Task 1 (click to see more information)", "Announce upcoming campaign dates and details")
timeline1.makeSubPoint(engage, "Task 2 (click to see more information)", "Share the different ways participants and donors can get involved")
timeline1.makeSubPoint(engage, "Task 3 (click to see more information)", "Internal recap to discuss improvements needed for next campaign")


timeline1.makeSubPoint(thank, "Task 1 (click to see more information)", "Send thank you videos via text, email and social")
timeline1.makeSubPoint(thank, "Task 2 (click to see more information)", "Share the different ways participants and donors can get involved")
timeline1.makeSubPoint(thank, "Task 3 (click to see more information)", "Share photos, videos and highlight reels")
timeline1.makeSubPoint(thank, "Task 4 (click to see more information)", "Post personal thank yous on social media for captains, donors and fundraising participants")
