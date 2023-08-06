import Experience from "../Experience";
import * as THREE from 'three' ; 
import { GUI } from "dat.gui";

class Env{
    experience : Experience ; 
    scene : THREE.Scene ;
    gui : GUI ; 

    constructor(){
       this.experience = new Experience() ; 
       this.gui = this.experience.gui ; 
       this.scene = this.experience.scene ; 
       this.setAmb() ;  
    }

    setAmb(){
        const l1 = new THREE.AmbientLight('0xff0000' , 0.5 ) ; 
        const l2 = new THREE.DirectionalLight('0xffff00' , 2 );

        const lightFolder = this.gui.addFolder('light');

        lightFolder.add(l2.position , 'x' , 0 , 10 ) ; 
        lightFolder.add(l2.position , 'y' , 0 , 10 ) ; 
        lightFolder.add(l2.position , 'z' , 0 , 10 ) ; 
        lightFolder.open() ; 

        this.scene.add(l1);
        this.scene.add(l2);
    }

    update(){
        
    }
}

export default Env ; 