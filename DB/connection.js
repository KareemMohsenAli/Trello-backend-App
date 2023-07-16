import mongoose from 'mongoose'

const connectDB = async () => {
    return await mongoose.connect(`mongodb://localhost:27017/trello`)
        .then(result => {
            console.log(`DB Connected ......`);
        }).catch(err => {
            console.log(`Fail to connectDB ....... ${err}`);
        })
}

export  default  connectDB