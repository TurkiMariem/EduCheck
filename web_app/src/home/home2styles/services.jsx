import { Component } from "react";
import './services.css';
class Services extends Component{
        constructor(props) {
          super(props);
          this.state = {
            Services: []
          };
        }
      
        getServices = async () => {
          try {
            const response = await fetch(`http://localhost:5000/Services`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            if (!response.ok) {
              throw new Error('Failed to fetch Services');
            }
            const data = await response.json();
            console.log("data", data);
            this.setState({ Services: data });
            console.log('Fetched Services:', this.state.Services);
            return data;
          } catch (error) {
            console.error('Error fetching Services:', error);
            return null;
          }
        }
      
        componentDidMount() {
          this.getServices();
         
        }
      
    render() {
            const { Services } = this.state;
            console.log("services",Services);
            const rows = [];
            for (let i = 0; i < Services.length; i += 3) {
              const serviceGroup = Services.slice(i, i + 3);
              rows.push(serviceGroup);
            }
        
        return(
<>
<section class="we-offer-area text-center bg-gray">
        <div class="containerS">
            <div class="row" style={{ display:"flex",justifyContent:"center",alignItems:"center" }}>
                <div class="col-md-12">
                    <div class="site-heading text-center" style={{ color:"#fff" }}>
                        <h2>What we <span>Offer</span></h2>
                        <h4>We are grateful to serve you</h4>
                    </div>
                </div>
            </div>
            <div className="rowS our-offer-items less-carousel">
        {rows.map((serviceGroup, rowIndex) => (
          <div className='row11'>
            {serviceGroup.map((service, colIndex) => (
              <div className="col-md-4 col-sm-6 equal-height" key={colIndex}>
                <div className="item">
                  <i className="fas fa-headset"><img src={`./files/${service.picture}`} alt="" /></i>
                  <h4 style={{ color:"#758EBC" }}>{service.title}</h4>
                  <p>{service.description}</p>
                        </div>
                    </div>
            ))}
                    </div>
        ))}
                </div>
        </div>
    </section>
</>
        );
    }
}
export default Services;

