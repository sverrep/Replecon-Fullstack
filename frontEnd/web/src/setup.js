import axios from 'axios';

const IP = ""

function setupUsers () {
    axios.post(IP+'/setup/')
    .then(response => {
        console.log("The app is setup and ready to go!")
    })
    .catch(error => console.log(error))
};

setupUsers()
