import React, { Component } from 'react';
import './collaborators.css';

class Collab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collaborators: []
    };
  }

  componentDidMount() {
    this.fetchCollaborators();
  }

  fetchCollaborators = async () => {
    try {
      const response = await fetch('http://localhost:5000/collaborators');
      if (!response.ok) {
        throw new Error('Failed to fetch collaborators');
      }
      const collaborators = await response.json();
      this.setState({ collaborators });
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  };

  render() {
    const { collaborators } = this.state;
    return (
      <>
     
        <div className='collaborators'>
        <div class="row" style={{ display:"flex",justifyContent:"center",alignItems:"center" }}>
                <div class="col-md-12">
                    <div class="site-heading text-center" style={{ color:"#fff",marginTop:"50px" }}>
                        <h2>Our <span>Collaborators</span></h2>
                        <h4>Get to know our collaborators</h4>
                    </div>
                </div>
            </div>
          <div className="slider">
            <div className="slide-track">
              {collaborators.map((collab, index) => (
                <div className="slide" key={index}>
                  <img src={`/files/${collab.picture}`} height="200" width="250" alt={collab.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Collab;
