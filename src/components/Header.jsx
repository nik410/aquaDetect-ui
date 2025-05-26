import logo from '../assets/logo.png';

export default function Header() {
  return (
    <header>
      <img src={logo} alt="A canvas" />
      <h1>AquaDetect</h1>
      <p>Fish Disease Detection</p>
    </header>
  );
}
