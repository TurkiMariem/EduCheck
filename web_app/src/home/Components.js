import styled from 'styled-components';

export const Container = styled.div`
background-color: #F7F7F7;
border-radius: 10px;
box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
height:550px;
width:900px;
display: flex;
overflow: hidden;
position: fixed ;
z-index:1;
transform: translate(-20%, 40%);
@media (max-width: 1200px) {
    width: 700px;
}
@media (max-width: 992px) {
    width: 600px;
}
@media (max-width: 768px) {
    width: 500px;
}
@media (max-width: 576px) {
    width: 90%;
    height: auto;
    padding: 20px;
}
`;
export const Container1 = styled(Container)`
background-color: #ffbbdd;
height:400px;
width:900px;
position: fixed ;
right:0%;
top:0%;
z-index:1;
transform: translate(-0%, 0%);
`;



export const SignInContainer = styled.div`
position: absolute;
top: 0;
height: 100%;
transition: all 0.6s ease-in-out;
left: 0;
width: 50%;
z-index: 2;
${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;
export const SignUpContainer = styled.div`
position: absolute;
top: 0;
height: 100%;
transition: all 0.6s ease-in-out;
left: 0;
width: 50%;
z-index: 2;
${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;
export const SignUpInstitute = styled.div`
background: #7F78B1;
background: -webkit-linear-gradient(to right, #EFD2BE, #7F78B1);
background: linear-gradient(to right, #EFD2BE, #7F78B1);
background-repeat: no-repeat;
background-size: cover;
background-position: 0 0;
color: #F7F7F7;
position: absolute;
top: 0;
height: 100%;
transition: all 0.6s ease-in-out;
left: 0;
width: 100%;
z-index:200;
${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;
export const SignUpConference = styled.div`
background: #7F78B1;
background: -webkit-linear-gradient(to right, #9CBEC5, #7F78B1);
background: linear-gradient(to right, #9CBEC5, #7F78B1);
background-repeat: no-repeat;
background-size: cover;
background-position: 0 0;
color: #F7F7F7;
position: absolute;
top: 0;
height: 100%;
transition: all 0.6s ease-in-out;
left: 0;
width: 100%;
z-index: 300;
${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;
export const VerifFace = styled.div`
color: #F7F7F7;
position: absolute;
top: 0;
height: 90%;
padding-bottom:50px
margin-bottom:50px
transition: all 0.6s ease-in-out;
left: 0;
width: 100%;
z-index: 300;
${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;

export const Form = styled.form`
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
padding: 0 50px;
height: 100%;
text-align: center;
`;

export const Title1 = styled.h1`
font-weight: bold;
margin: 0;
color: #9AAFC7;
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;
export const Title2 = styled.h2`
font-weight: bold;
margin: 20px;
color: #ffffff;
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

export const Input = styled.input`
background-color: #eee;
border: none;
width: 100%;
margin:20px;
`;


export const Button = styled.button`
   border-radius: 20px;
   border: 2px solid #e9f0e3;
   background-color: #95B8D1;
   color: #ffffff;
   font-size: 12px;
   font-weight: bold;
   padding: 12px 45px;
   letter-spacing: 1px;
   text-transform: uppercase;
   transition: transform 80ms ease-in;
   &:active{
       transform: scale(0.95);
   }
   &:focus {
       outline: none;
   }
`;
export const ButtonAnchor = styled.button`  
   color: #758EBC;
   font-size: 12px;
   letter-spacing: 1px;
   text-transform: uppercase;
   background:transparent;
   border:none;
`;
export const ButtonAnchor2 = styled.button`  
   color: ##fff;
   font-size: 12px;
   letter-spacing: 1px;
   text-transform: uppercase;
   background:transparent;
   border:none;
`;
export const GhostButton = styled(Button)`
background-color: transparent;
border-color: #F7F7F7;
`;
////////
// Styled components for the select and options
export const Select = styled.select`
  width: 95%;
  padding: 8px;
  margin:0px 10px 20px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background:#758EBC;
  color:#fff;

`;

export const Option = styled.option`
  font-size: 16px;
`;

export const Anchor = styled.a`
color: #333;
font-size: 14px;
text-decoration: none;
margin: 15px 0;
`;
export const OverlayContainer = styled.div`
position: absolute;
top: 0%;
left: 50%;
width: 50%;
height: 100%;
overflow: hidden;
transition: transform 0.6s ease-in-out;
z-index: 100;
${props =>
 props.signinIn !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div`
background: #7F78B1;
background: -webkit-linear-gradient(to right, #EFD2BE, #7F78B1);
background: linear-gradient(to right, #EFD2BE, #7F78B1);
background-repeat: no-repeat;
background-size: cover;
background-position: 0 0;
color: #F7F7F7;
position: relative;
left: -100%;
height: 100%;
width: 200%;
transform: translateX(0);
transition: transform 0.6s ease-in-out;
${props => (props.signinIn !== true ? `transform: translateX(50%);` : null)}
`;

export const OverlayPanel = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
`;

export const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${props => props.signinIn !== true ? `transform: translateX(0);` : null}
`;

export const RightOverlayPanel = styled(OverlayPanel)`
    right: 0;
    transform: translateX(0);
    ${props => props.signinIn !== true ? `transform: translateX(20%);` : null}
`;

export const Paragraph = styled.p`
font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: #576389;
  position:relative;
  display:flex;
  flex:left;
  margin-left:10px
`;
