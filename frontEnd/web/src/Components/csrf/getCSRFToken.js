import React from "react";
import axios from "axios";

export default async function getCSRFToken(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
    }
    console.log(cookieValue)
    axios.defaults.headers.post['X-CSRF-Token'] = cookieValue;
  };