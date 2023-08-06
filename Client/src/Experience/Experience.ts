import * as THREE from 'three' ; 
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Resources from './Utils/Resources';
import AssetsArray from './Utils/Assets';

import Camera from './Camera';
import Renderer from './Renderer';
import Helper from './Helper';
import Controllers from './Controllers';
import World from './World/World';
import Env from './World/Env';

import { GUI } from 'dat.gui'

class Experience{
    static instance : Experience ; 
    canvas : HTMLCanvasElement ; 
    scene : THREE.Scene ;
    sizes : Sizes ; 
    time : Time ; 
    resources : Resources ; 
    world : World ; 
    env : Env ; 
    gui : GUI ; 

    camera : Camera ;
    renderer : Renderer ; 
    helper : Helper ; 
    controllers : Controllers ; 

    constructor(canvas?: HTMLCanvasElement ){
        if(Experience.instance){
            return Experience.instance ; 
        }
        else{
            Experience.instance = this ; 
            if(canvas){
                this.canvas = canvas ; 
            }
            this.scene = new THREE.Scene() ;
            this.sizes = new Sizes() ; 
            this.time = new Time() ;
            this.resources = new Resources(AssetsArray) ;

            this.camera = new Camera() ; 
            this.renderer = new Renderer() ;
            this.controllers = new Controllers() ;
            this.helper = new Helper() ; 

            this.gui = new GUI() ; 

            this.sizes.on('resize' , ()=>{
                this.resize() ; 
            })

            this.time.on('update' , ()=>{
                this.update() ; 
            })

            this.resources.on('ready' , ()=>{
                console.log('ready') ;
                this.env = new Env() ; 
                this.world = new World() ; 
            })
        }
    }

    resize(){
        console.log('resize');
    }

    update(){
        this.renderer.update() ;
        if( this.env ) this.env.update() ; 
        if( this.controllers ) this.controllers.update() ;
        if( this.world ) this.world.update() ;
    }
} ; 


export default Experience ; 