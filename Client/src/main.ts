import Experience from "./Experience/Experience";
import './style.css' ;

const canvas = document.getElementById('Experience-canvas') as HTMLCanvasElement ; 
const experience = new Experience( canvas ) ; 
console.log(experience);
