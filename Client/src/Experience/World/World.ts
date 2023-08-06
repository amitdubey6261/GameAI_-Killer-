import Experience from "../Experience";
import Resources from "../Utils/Resources";

import * as THREE from 'three' ; 
import * as YUKA from 'yuka' ; 

import createGraphHelper from "./GraphHelper";
import { createConvexRegionHelper } from "./ConvexRegionHelper";

import Time from "../Utils/Time";

class World{
    experience : Experience ; 
    scene : THREE.Scene ;
    resources : Resources ; 
    items : any ;
    time : YUKA.Time ; 
    v : THREE.Mesh ;
    vehicle : YUKA.Vehicle ; 
    em : YUKA.EntityManager ; 
    navmesh : YUKA.NavMesh ;
    navgroup : THREE.Mesh ;
    camera : THREE.PerspectiveCamera ;
    raycaster : THREE.Raycaster ; 

    constructor(){
        this.experience = new Experience() ; 
        this.camera = this.experience.camera.perspectiveCamera ; 
        this.scene = this.experience.scene ; 
        this.resources = this.experience.resources ; 
        this.items = this.resources.items ; 
        this.time = new YUKA.Time()  ;


        this.create();
    }

    create(){
        this.scene.add(this.items.n1.scene);//base
        this.navmesh = this.items.n2 ; 
        this.raycaster = new THREE.Raycaster() ; 

        const graph = this.navmesh.graph ; 

        const GraphHelper = createGraphHelper(graph , 0.2 );
        this.scene.add(GraphHelper) ; 

        this.navgroup = createConvexRegionHelper(this.navmesh);
        this.scene.add(this.navgroup) ; 

        this.createAgent() ; 
        this.navigate() ; 

    }

    createAgent(){
        this.v = new THREE.Mesh(
            new THREE.ConeGeometry( .15 , .5 , 16 ) ,
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
        const followPathBehavior = new YUKA.FollowPathBehavior() ; 
        followPathBehavior.active = false ; 
        followPathBehavior.nextWaypointDistance = 0.5 ;
        
        this.vehicle = new YUKA.Vehicle() ; 
        this.vehicle.setRenderComponent(this.v , sync ) ; 
        this.vehicle.steering.add(followPathBehavior);
        this.em.add(this.vehicle) ; 
    }

    navigate(){

        window.addEventListener('mousedown' , this.onMouseDown.bind(this) , false  ) ; 

    }

    onMouseDown(e:any){
        const mousePosition = new THREE.Vector2(); 

        mousePosition.x = (e.clientX/window.innerWidth)*2 - 1 ; 
        mousePosition.y = -(e.clientY/window.innerHeight)*2 + 1 ;

        this.raycaster.setFromCamera( mousePosition , this.camera ) ; 


        const intersects = this.raycaster.intersectObject( this.navgroup , true ) ; 
        console.log(intersects)

        if( intersects.length > 0 ){
            this.findPathto(new YUKA.Vector3().copy(new YUKA.Vector3(intersects[0].point.x , intersects[0].point.y , intersects[0].point.z ))) ; 
        }
    }

    findPathto( vec : YUKA.Vector3 ){
        const from = this.vehicle.position ; 
        const to = vec ; 

        const path = this.navmesh.findPath( from , to ) ;

        const followPathBehavior : any = this.vehicle.steering.behaviors[ 0 ];
        followPathBehavior.active = true ; 
        followPathBehavior.path.clear() ; 
        
        for (const point of path ){
            followPathBehavior.path.add(point);
        }
        // const followPathBehavior = this.vehicle.steering.behaviors[0] ; 
        // followPathBehavior.active = true ; 
        // console.log(followPathBehavior)
    }


    update(){
        const delta = this.time.update().getDelta() ; 
        this.em.update(delta) ; 
    }

    resize(){

    }
}

export default World ; 