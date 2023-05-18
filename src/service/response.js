export const SendSuccess = (req,message,data)=>{
    req.status(200).json({status:true, message,data}) // 200 = ok,update,get,delete
}

export const SendCreate = (req,message,data)=>{
    req.status(201).json({status:true, message,data}) // 201 = Pos
}

export const SendError400 = (req,message,error)=>{
    req.status(400).json({status:false, message,data:{},error}) // 400 = Bad request
}

export const SendError401 = (req,message,error)=>{
    req.status(401).json({status:false, message,data:{},error}) // 401 = Unauthorization
}

export const SendError404 = (req,message,error)=>{
    req.status(404).json({status:false, message,data:{},error}) // 404 = Not Found
}

export const SendError500 = (req,message,error)=>{
    req.status(500).json({status:false, message,data:{},error}) // 500 = Internal Server Error
}