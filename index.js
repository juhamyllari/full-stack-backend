const express = require('express')
const app = express()
const MAX_ID_FACTOR = 1e9
const cors = require('cors')
const bodyParser = require('body-parser')
var morgan = require('morgan')

app.use(bodyParser.json())
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
  ]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)  
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
    res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
})

app.post('/api/persons/', (req, res) => {

  const generateId = () => {
    const newId = Math.floor(Math.random() * MAX_ID_FACTOR)
    if (persons.some(p => p.id === newId)) {
      return generateId()
    } else {
      return newId
    }
  }

  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (body.number === undefined) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.some(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    ...body,
    id: generateId()
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})