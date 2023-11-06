import Experience from "../Experience";
import Resources from "../Utils/Resources";

import * as THREE from 'three';
import * as YUKA from 'yuka';

import createGraphHelper from "./GraphHelper";
import { createConvexRegionHelper } from "./ConvexRegionHelper";

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

class World {
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    items: any;
    time: YUKA.Time;
    v: THREE.Mesh;
    vehicle: YUKA.Vehicle;
    em: YUKA.EntityManager;
    navmesh: YUKA.NavMesh;
    navgroup: THREE.Mesh;
    camera: THREE.PerspectiveCamera;
    raycaster: THREE.Raycaster;
    car: any;
    ydoc: Y.Doc;
    mapPos: Y.Map<any>

    constructor() {
        this.experience = new Experience();
        this.camera = this.experience.camera.perspectiveCamera;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.items = this.resources.items;
        this.ydoc = new Y.Doc();
        const room = prompt('Enter Name : '); 
        this.ydoc = new Y.Doc() ; 
        const provider = new WebsocketProvider(
            "wss://viscommerce.com/server",
            room ,
            this.ydoc,
            {
              connect: true
            }
        );
        console.log(provider);
        this.time = new YUKA.Time();
        this.mapPos = this.ydoc.getMap('pos');


        this.car = this.resources.items.car.scene;
        this.create();
    }

    create() {
        this.scene.add(this.items.n1.scene);//base
        this.navmesh = this.items.n2;
        this.raycaster = new THREE.Raycaster();

        const graph = this.navmesh.graph;

        const GraphHelper = createGraphHelper(graph, 0.2);
        this.scene.add(GraphHelper);

        this.navgroup = createConvexRegionHelper(this.navmesh);
        this.scene.add(this.navgroup);

        this.createAgent();
        this.navigate();

    }

    createAgent() {
        this.v = new THREE.Mesh(
            new THREE.ConeGeometry(.15 * 5, 0.6 * 5, 16 * 5),
            new THREE.MeshNormalMaterial()
        )

        this.scene.add(this.v);

        function sync(entity: any, renderComponent: any) {
            renderComponent.matrix.copy(entity.worldMatrix);
        }

        this.em = new YUKA.EntityManager();
        const followPathBehavior = new YUKA.FollowPathBehavior();
        followPathBehavior.active = false;

        this.vehicle = new YUKA.Vehicle();
        this.car.matrixAutoUpdate = false;
        this.scene.add(this.car);
        this.vehicle.setRenderComponent(this.car, sync);
        this.vehicle.steering.add(followPathBehavior);
        this.vehicle.scale.set(.6, .6, .6);
        this.mapPos.set('pos', { x: this.vehicle.position.x, y: this.vehicle.position.y, z: this.vehicle.position.z, cid: this.ydoc.clientID });
        this.em.add(this.vehicle);

        this.mapPos.observe(() => {
            this.v.position.x = this.mapPos.get('pos').x;
            this.v.position.y = this.mapPos.get('pos').y;
            this.v.position.z = this.mapPos.get('pos').z;
        })

        this.clock();
    }

    navigate() {

        window.addEventListener('dblclick', this.onMouseDown.bind(this), false);

    }

    onMouseDown(e: any) {
        const mousePosition = new THREE.Vector2();

        mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(mousePosition, this.camera);


        const intersects = this.raycaster.intersectObject(this.navgroup, true);
        console.log(intersects)

        if (intersects.length > 0) {
            this.findPathto(new YUKA.Vector3().copy(new YUKA.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)));
        }
    }

    findPathto(vec: YUKA.Vector3) {
        const from = this.vehicle.position;
        const to = vec;

        const path = this.navmesh.findPath(from, to);

        const followPathBehavior: any = this.vehicle.steering.behaviors[0];
        followPathBehavior.active = true;
        followPathBehavior.path.clear();

        for (const point of path) {
            followPathBehavior.path.add(point);
        }
    }


    update() {
        const delta = this.time.update().getDelta();
        this.em.update(delta * 10);
    }

    clock() {
        setInterval(() => {
            this.mapPos.set('pos', { x: this.vehicle.position.x, y: this.vehicle.position.y, z: this.vehicle.position.z, cid: this.ydoc.clientID });
            console.log(this.mapPos.get('pos'));
        }, 1000);
    }

    resize() {

    }
}

export default World; 