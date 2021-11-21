# Replecon

Replecon is an app made to simulate a small economy virtually to allow students of economics classes to experience topics they learn about hands on.

## Live Website

replecon.com

## Motivation

As two former economics students we felt that there was a lack of hands on learning in our classes. Having seen teachers trying to implement such a system in a physical manner
and seeing all the drawbacks that came with it, we wanted to make the system virtual to effortlessly implement the system in any class. 

## Tech used

Front End
- React
- Javascript
- Bootstrap

Back End
- Django
- MySQL Database
- Python

## Features

Teachers
- Creating classes
- Creating a store within a class
- Creating a bank within a class
- Paying/charging students
- Taxing class

Students
- Joining a class
- Purchasing/using items
- Inserting savings
- Sending money to classmates

## Installation

### Back End Installation
Make sure you have pip and python installed (*Optional: create a virtualenviornment for the project*)
Use pip to install all required packages 

```
cd backEnd
pip install requirements.txt
cd replecon
python manage.py migrate
```

Find your local ip and runserver on it
```
python manage.py runserver YOURIP:8000
```

### Front End Installation
Make sure you have the latest version of node installed
Use NPM to install all required dependencies

```
cd frontEnd
cd web
npm install 
```
Next you need to add your IP that you are running the server on to the setup.js file in the src directory, and then run it in the node console
```
node setup.js
```
Then you need to change the settings.js file, and add the IP address on which you are running the backend server to the ip variable so that the front end calls it.
With the setup done you can now run the website!
```
npm start
```

## Roadmap

We are currently continously working on the live version of the website with feedback that we are getting from our set of live users. 

## ERD

https://github.com/steveno06/RepleconScreenShots/blob/main/Replecon_ERD_1.pdf

## Projec Architecture

<img src="https://lh3.googleusercontent.com/ri34KIzMSKMSWYfX1iTTVYBe-W7zqb8_snRPpJTg3JXM5TVO7ZPAQ_Tw5F1h5AHr3mQ5eFJajF58ZA=w2560-h1369-rw" alt="Deployment pipeline diagram"/>

## Backend Architecture

https://github.com/steveno06/RepleconScreenShots/blob/main/Replecon_Backend_Architecture.pdf

## Backend Description

https://github.com/steveno06/RepleconScreenShots/blob/main/Backend%20API%20Description.pdf

## Cyber Security Measures Implemented
https://docs.google.com/document/d/1MOT0_gzFjEICuPPi4KH5cjHGamvCaiEhg8BfUleZ8Vw/edit?usp=sharing

## Cyber Threat Model

https://drive.google.com/file/d/1vE0p3WX5gI913MC737ZC4oShM1_O_MrC/view?usp=sharing

## Deployment Pipeline Diagram

<img src="https://lh6.googleusercontent.com/znu1ph1zoTJqJeHtD4_1shu_mTxGoZ-WFpJHCsYNuQaX-SS5MZ4f4Nw2OyXWlmH093Lm6CYU63Amnw=w2560-h1369-rw" alt="Deployment pipeline diagram"/>

## Backend Team Contribution

- Bank App - Sverre & Steven
- Classroom App - Steven
- Store App - Steven
- Tax App - Steven
- Transaction App - Sverre
- Users App - Sverre

## Frontend Team Contribution
- Login and Sign up - Sverre & Steven
- Profile Screen - Sverre(Teacher) & Steven(Student)
- Student Screens - Steven
- Teacher Screens - Sverre
