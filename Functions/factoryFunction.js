const AppError = require("../utils/appError");
const catchAsync = require("../utils/asyncError");

exports.deleteOne = (Model) => catchAsync(async(req,res,next) => {
    const docId = req.params.id;
    const doc = await Model.findByIdAndDelete(docId);

    if(!doc){
        return next(new AppError(`No document found with that id`,404));
    }
    res.status(200).json({
        status : 'Success',
        data : null
    });
});

exports.updateOne = (Model) =>  catchAsync(async(req,res,next) => {
        const docId = req.params.id;
        const doc = await Model.findByIdAndUpdate(docId,req.body,{
            new : true,
            runValidators : true
        });
        if(!doc){
            return next(new AppError('Document not found :: Invalid Doc ID',404));
        }
        res.status(200).json({
            status : 'Success',
            data : {
                doc
            }
        });
    });
