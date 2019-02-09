require('dotenv').config()
const mongoose = require('mongoose')
const args = process.argv.length
let onlyPrint = false

if (args !== 2 && args !== 4) {
    console.log('Wrong number of arguments');
    process.exit(1)
} else if (process.argv.length === 2) {
    onlyPrint = true
}

const name = process.argv[2]
const number = process.argv[3]
const url =  process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url, { useNewUrlParser: true })

if (onlyPrint) {
    console.log('Puhelinluettelo:');
    Person.find({}).then(result => {
        result.forEach(p => console.log(p.name, p.number))
        mongoose.connection.close()
      })
} else {
    const person = new Person({name, number})
    person.save().then(response => {
        console.log(`Lisätään ${name} numero ${number} luetteloon.`);
        mongoose.connection.close();
    })
}

