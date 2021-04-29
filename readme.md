# Replecon

Replecon is an app made to simulate a small economy virtually to allow students of economics classes to experience topics they learn about hands on.

## Motivation

As two former economics students we felt that there was a lack of hands on learning in our classes. Having seen teachers trying to implement such a system in a physical manner
and seeing all the drawbacks that came with it, we wanted to make the system virtual to effortlessly implement the system in any class. 

## Screenshots

<img src="https://github.com/steveno06/RepleconScreenShots/blob/main/62b616c4f431c6bfd9d48cc26326d961.png" alt="screenshot1" width="300"/> <img src="https://github.com/steveno06/RepleconScreenShots/blob/main/d570f21a5bc9c09121485520f15a8baa.png" alt="screenshot1" width="300"/> <img src="https://github.com/steveno06/RepleconScreenShots/blob/main/TecherClassScreen.png" alt="screenshot1" width="300"/> <img src="https://github.com/steveno06/RepleconScreenShots/blob/main/StudentScreen.png" alt="screenshot1" width="300"/> 




## Tech used

Front End
- React Native
- Javascript
- Android Emulator

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
Install React Native CLI Quickstart as described [here](https://reactnative.dev/docs/environment-setup)
When in IDE of your choice with React Native installed and open the cloned repository folder

```
cd frontEnd
npm install
```

Change the IP settings.js and setup.js file (frontEnd/components/settings/) to YOURIP:8000
Then do
```
cd components
cd settings
node setup.js
```

Now, with all the setup done, you can run the project! (requires two terminals in frontEnd directory)
```
npx react-native start
```
```
npx react-native run-android
```

Now your emulator or connected up mobile device should be running the application

## Roadmap

With the current working prototype we have, we want to continue working on the project and expanding its features. One such feature is making the stats screen display information
about the student's purchases and balance. We would also want to rework the entire UI, with a more cohesive theme and better design. Furthermore, we'd like to expand on the 
project as a whole by creating a webapp that could be used interchangably with the mobile app. 
