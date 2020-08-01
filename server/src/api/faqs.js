const express =require('express');
const monk=require('monk');
const Joi=require('@hapi/joi');
const db=monk(process.env.MONGO_URI);
const faqs=db.get('faqs');
const router=express.Router();
const schema=Joi.object(
    {
        question:Joi.string().trim().required(),
        answer:Joi.string().trim().required(),
        video_url:Joi.string().uri(),
    }
);
//READ ALL
router.get('/',async(req,res,next)=>{
    try{
const items=await faqs.find({});
res.json(items);
    }catch(e){
next(e);
    }
});

//Read One
router.get('/:id', async(req, res, next) => {
try{
const {id}=req.params;
const item=await faqs.findOne({
    _id:id,
})
if(!item) return res.json({"message":"The data you are looking for is not available"});
return res.json(item);
}catch(e){
    next(e);
}
});

//Create One
router.post('/', async(req, res, next) => {
try{
    console.log(req.body);
    const value=await schema.validateAsync(req.body);
    const inserted=await faqs.insert(value);
    res.json(inserted);
}catch(e){
next(e);
}
});

//Update One
router.put('/:id',async(req, res, next) => {
try {
    const {id}=req.params;
    const value = await schema.validateAsync(req.body);
    const item = await faqs.findOne({_id: id})
   if (!item) return next();
   const updated = await faqs.update({_id:id},{$set:value});
   res.json(updated);
} catch (e) {
    next(e);
}
});

//Delete One
router.delete('/:id', async(req, res, next) => {
    try{
const {id}=req.params;
await faqs.remove({_id:id})
res.json({
    "message":"Success"
})
    }catch(e){
        next(e);
    }
});

module.exports=router;