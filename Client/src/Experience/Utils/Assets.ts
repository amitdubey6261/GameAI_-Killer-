export interface AssetT{
    name : string ; 
    type : string ; 
    path : string ; 
}

const AssetsArray : AssetT[] = [
    {
        name : "n1" , 
        type : "glbmodel",
        path : "/models/BASE.glb" , 
    }
    ,
    {
        name : "n2",  
        type : "navmesh" , 
        path : "/models/NAV.glb" , 
    }
    ,
    {
        name : "car",  
        type : "glbmodel" , 
        path : "/models/car.glb" , 
    }
    // {
    //     name : "n1" , 
    //     type : "glbmodel",
    //     path : "/models/nn1bob.glb" , 
    // }
    // ,
    // {
    //     name : "n2",  
    //     type : "navmesh" , 
    //     path : "/models/nn1b.glb" , 
    // }
]

export default AssetsArray ; 