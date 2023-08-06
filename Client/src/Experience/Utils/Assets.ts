export interface AssetT{
    name : string ; 
    type : string ; 
    path : string ; 
}

const AssetsArray : AssetT[] = [
    {
        name : "n1" , 
        type : "glbmodel",
        path : "/models/navbase.glb" , 
    }
    ,
    {
        name : "n2",  
        type : "navmesh" , 
        path : "/models/navmesh.glb" , 
    }
]

export default AssetsArray ; 