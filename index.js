const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('data', (req) => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Jemin Sieow",
    "number": "39-23-6423122",
    "id": 4
  }
  
]

// const Info = () => {
//   return (
//     <p>Phonebook has info for {persons.length} people</p>  
//   )
// }

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const note = persons.find(person => person.id === id)

  if(note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  const person = request.body
  const name = person.name

  if(!person.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if(!person.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  
  if(persons.find(person => person.name === name)) {
    console.log(person.name)
    console.log("persons.find =", persons.find(person => person.name === name))
    
    return response.status(404).json({ 
      error: 'name must be unique' 
    })
  }

  const id = Math.floor(Math.random() * 9999)
  person.id = id
  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  date = new Date()
  console.log(date)
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

