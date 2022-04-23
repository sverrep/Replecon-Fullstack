import axios from "axios";
import getIP from '../../settings.js';

export default async function getCSRFToken() {
  await axios.get(getIP()+'/getCSRFToken/', {withCredentials: true})
  .then(response => {
      axios.defaults.headers.post['X-CSRFToken'] = response.data.csrfToken;
  })
};