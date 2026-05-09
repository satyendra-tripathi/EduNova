import  mongoose from"mongoose"
export const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"MERN_TUTOR"
    }).then(()=>{
        console.log("Database connected successfully.")
    }).catch((err)=>{
        console.log("Error occured during database connection", err);
    })
}