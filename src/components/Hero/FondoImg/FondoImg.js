import './FondoImg.css';

function FondoImg({ image }) {
  return <div className="hero-background" style={{ backgroundImage: `url(${image})` }} />;
}

export default FondoImg;
