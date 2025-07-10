const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const timeNow = new Date()
    response.send(`<p> Phonebook has info for ${persons.length} people </p>
        <p> ${timeNow} </p>` )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(n => n.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const genId = () => {
    return Math.random() * 100
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    const nameList = persons.map(p => p.name)
    const nameCopy = nameList.includes(body.name)

    if (nameCopy) {
        return res.status(400).json({
            error: 'name already exists'
        })
    }

    const newPerson = {
        id: genId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)

    res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on port 3001 broski")
})