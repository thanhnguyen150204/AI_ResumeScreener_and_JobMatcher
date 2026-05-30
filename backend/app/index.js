import 'dotenv/config'
import express from 'express'
import authRouter from './routes/auth.routes.js'
import resumeRouter from './routes/resume.routes.js'

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/resume', resumeRouter)

app.get('/', (req, res) => {
  res.json({ message: 'AI Resume Screener API', version: '1.0.0' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})