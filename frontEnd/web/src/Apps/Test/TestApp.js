import React from 'react';
import { Link, withRouter } from "react-router-dom";


class TestApp extends React.Component {
    render() {
      return (
        <div>
          <p>
          Hello {this.props.location.state.password}
          </p>
          <Link to="/"><button>
            Return
          </button>
          </Link>
        </div>
      );
    }
  }

export default withRouter(TestApp)