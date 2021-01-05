require('../src/db/mongoose')
const Task = require('../src/models/tasks')

// Task.findByIdAndDelete('5ff01b07bcbaab5f58b39c12').then(()=>{
//     return Task.countDocuments({completed:false})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteAndCount = async (id)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteAndCount('5ff02516994a6d418085514c').then((count)=>{
    console.log(count)
}).catch((error)=>{
    console.log(error)
})