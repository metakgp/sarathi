
# [TravelKGP](https://travelkgp.herokuapp.com/)

<h5 align="center">
<img src="https://github.com/aribalam/TravelKGP/blob/master/logo.png"/>
</h5>

TravelKGP is a progressive web application intended to connect a group of people taking the same journey at the same time for sharing cabs.

## Motivation
IIT Kharagpur has a facebook page named [Travel KGP!](https://www.facebook.com/groups/1808688549401165/) where students would post their journey details with a prospect of finding other students with similar journey to share rides. The process however was quite disorganized due to the following reasons

1. The users were unable to search for posts matching with their travel timings. The only way was to scroll through all posts and look for the required one.
2. The above point would lead to multiple posts for the same journey.
3. There was no way to know whether the creator of the post is still open to accepting people without commenting on their posts asking about the status.

TravelKGP Web app aims at solving all the above problems by - 
1. Letting users search for groups matching their journey details as well have the option of creating a new one.
2. Having a well defined procedure of joining groups through sending requests to its creators.
3. Creating an option for changing the status of the group between open/closed to allow/deny users to join the group.
4. Implementing push notifications to notify user regarding updates of their joined/created groups.

## Technology Stack
<b>Backend:</b> NodeJS using the Express framework <br>
<b>Database:</b> MongoDB connected to backend using mongoose driver <br>
<b>Frontend:</b> ReactJS

## Features
1. Searching for groups and joining one.
2. Creating groups
3. Approving/rejecting requests
4. Changing status/time of groups
5. Reading notifications
