require('../src/db/mongoose')
const User = require('../src/models/users')

// User.findByIdAndUpdate('5ff027b4b84ffd31dc45fbee',{age: 1}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const UpdateAgeandCount = async (id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count
}

UpdateAgeandCount('5ff027b4b84ffd31dc45fbee', 3).then((count)=>{
    console.log(count)
}).catch((error)=>{
    console.log(error)
})