import Experience from "../Experience";
import Resources from "../Utils/Resources";

import * as THREE from 'three' ; 
import * as YUKA from 'yuka' ; 
import createGraphHelper from "./GraphHelper";
import Time from "../Utils/Time";

class World{
    experience : Experience ; 
    scene : THREE.Scene ;
    resources : Resources ; 
    items : any ;
    time : Time ; 
    v : THREE.Mesh ;
    em : YUKA.EntityManager ; 
    navmesh : YUKA.NavMesh ; 

    constructor(){
        this.experience = new Experience() ; 
        this.scene = this.experience.scene ; 
        this.resources = this.experience.resources ; 
        this.items = this.resources.items ; 
        this.time = this.experience.time  ;
        this.create();
    }

    create(){
        this.scene.add(this.items.n1.scene);//base
        this.navmesh = this.items.n2 ; 
        const graph = this.navmesh.graph ; 
        
        const GraphHelper = createGraphHelper(graph , 0.2 );
        this.scene.add(GraphHelper)

        this.createAgent() ; 
    }

    createAgent(){
        this.v = new THREE.Mesh(
            new THREE.ConeGeometry( .25 , 1 , 16 ) ,
            new THREE.MeshNormalMaterial()
        )

        this.v.geometry.rotateX(Math.PI*.5);
        this.v.geometry.translate( .0 , .5 , 0 );
        this.v.matrixAutoUpdate = false ; 
        this.scene.add(this.v);

        function sync( entity : any , renderComponent : any ){
            renderComponent.matrix.copy(entity.worldMatrix);
        }

        this.em = new YUKA.EntityManager() ; 
        const fpb = new YUKA.FollowPathBehavior() ; 
        fpb.active = false ; 
        fpb.nextWaypointDistance = 0.5 ;
        
        const vehicle = new YUKA.Vehicle() ; 
        vehicle.setRenderComponent(this.v , sync ) ; 
        this.em.add(vehicle) ; 
        vehicle.steering.add(fpb);

        // const time = new YUKA.Time() ;  //////////////////////////////////////////////time 
    }


    update(){
        const delta = this.time.delta ; 
        this.em.update(delta) ; 
    }

    resize(){

    }
}

export default World ; 