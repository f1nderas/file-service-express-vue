import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { authRoutes } from './auth/auth.routes'
import { fileRoutes } from './file/file.routes'

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(fileUpload())

app.use('/api', authRoutes)
app.use('/api/file', fileRoutes)

const PORT = 4200
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`)
})