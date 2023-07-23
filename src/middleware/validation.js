export const validation=(schema)=>{
 return (req,res,next)=>{
    const {error ,value} = schema.validate(req.body,{ abortEarly: false })
    if(error){
      const validaionErrors=error.details.reduce((acc,curr)=>{
        acc[curr.path[0]] = curr.message;
        return acc
      },{})
      return res.status(400).json({ errors: validaionErrors });
    }
    return next();

    }
}