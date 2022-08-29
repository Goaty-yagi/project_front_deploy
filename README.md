# project_front_deploy

# **What is it?**


This is Quiz-Ranking application. This app gives users opportunities to test their knowledge and compare to other users. 
your knowledge indicates as score and will be in the ranking. 
So you can visualy see where you are like how many score the top user has.


# **Where to play this App?**


This app is deployed in heroku.
[Quiz-Ranking-Dojo](https://quiz-ranking-dojo.herokuapp.com/)


# **Why should I make it?**


This is my final project in General Assembly development course.
My previous career was teacher so I thought how I could build a fun activity for learning. 
The answer is "Quick Answer Questions". I think this must be fun, and you can compire your score to other users, which could make users motivated.


# **Where I get Question data?**


The question data was provided as a js file for homework purpose from GA.  I built DB, and set all the data into the DB as Api.
[git-hub page](https://github.com/Goaty-yagi/project-beck-deploy)
[question-data endpoint](https://murmuring-peak-30038.herokuapp.com/api/quiz/js)



# **Which part I want you to see?**


I built SPA from scratch. There were a few choices to build SPA in easier way, 
such as React, Vue and Angular, but I would like to understand how SPA work, 
so I choose to build it in this way. I believe that this knowledge definitely help my future-self, when I learn new frameworks or libraries.
There are two things I want you to see,


## **1,  Routing.**


Regarding to SPA, routing is one of the most crutial component. 
Because SPA is one HTML file rendered and a bunch of JS file munipulate dom element to be in the browser, 
so  I couldn't rely on default routing.

## **2,  Life Sycle Hook.**


Life sycle Hook, this idea comes from Vue.js. 
It would devide a component life into layers. 
For example,  you are in the situation that fetch Api data, then set the data into dom elemets to be viewable in the browser,  
but does't show in one go because fetching is ascyncrones. 
You might think that fetch should be done before rendering dom element. Life Sycle Hook could solve this problem.

