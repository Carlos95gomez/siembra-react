const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Registro de usuarios
app.post('/api/registro', async (req, res) => {
  const { nombre, correo_electronico, contrasena } = req.body;
  try {
    const [existingUsers] = await db.query(
      'SELECT * FROM usuarios WHERE correo_electronico = ?',
      [correo_electronico]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo_electronico, contrasena, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo_electronico, hashedPassword, 'normal']
    );
    res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// Inicio de sesión
app.post('/api/login', async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  try {
    const [users] = await db.query(
      'SELECT * FROM usuarios WHERE correo_electronico = ?',
      [correo_electronico]
    );
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const user = users[0];
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { userId: user.id, rol: user.rol },
      'tu_secreto_jwt',
      { expiresIn: '1h' }
    );
    res.json({
      message: 'Login exitoso',
      token,
      rol: user.rol,
      nombre: user.nombre  // Añadimos el nombre del usuario a la respuesta
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// Información de hectáreas, cultivos y fechas de cosecha
app.get('/api/hectareas-info', async (req, res) => {
  try {
    const [prediosResult] = await db.query('SELECT COUNT(*) as totalPredios, SUM(hectareas) as totalHectareas FROM predios');
    const [sectoresResult] = await db.query('SELECT COUNT(DISTINCT nombre_sector) as totalSectores FROM predios');
    const [siembrasResult] = await db.query(`
      SELECT tc.nombre_cultivo, COUNT(*) as cantidad, 
             SUM(p.hectareas) as hectareas_sembradas,
             MIN(s.fecha_cosecha) as proxima_cosecha
      FROM siembras s
      JOIN predios p ON s.id_predio = p.id_predio
      JOIN tipos_cultivos tc ON s.id_tipo_cultivo = tc.id_tipo_cultivo
      WHERE s.fecha_cosecha >= CURDATE()
      GROUP BY tc.id_tipo_cultivo
      ORDER BY hectareas_sembradas DESC
    `);
    res.json({
      totalHectareas: prediosResult[0].totalHectareas || 0,
      totalPredios: prediosResult[0].totalPredios || 0,
      totalSectores: sectoresResult[0].totalSectores || 0,
      siembrasActuales: siembrasResult
    });
  } catch (error) {
    console.error('Error al obtener información de hectáreas:', error);
    res.status(500).json({ message: 'Error al obtener información de hectáreas', error: error.message });
  }
});

// Obtener tipos de cultivos
app.get('/api/tipos-cultivos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_tipo_cultivo, nombre_cultivo, imagen_url FROM tipos_cultivos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de cultivos:', error);
    res.status(500).json({ message: 'Error al obtener tipos de cultivos', error: error.message });
  }
});

// Obtener todos los predios
app.get('/api/predios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM predios');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener predios:', error);
    res.status(500).json({ message: 'Error al obtener predios', error: error.message });
  }
});

// Crear un nuevo predio
app.post('/api/predios', async (req, res) => {
  const { hectareas, nombre_sector } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO predios (hectareas, nombre_sector) VALUES (?, ?)',
      [hectareas, nombre_sector]
    );
    res.status(201).json({ id: result.insertId, hectareas, nombre_sector });
  } catch (error) {
    console.error('Error al crear predio:', error);
    res.status(500).json({ message: 'Error al crear predio', error: error.message });
  }
});

// Eliminar un predio
app.delete('/api/predios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM predios WHERE id_predio = ?', [id]);
    res.json({ message: 'Predio eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar predio:', error);
    res.status(500).json({ message: 'Error al eliminar predio', error: error.message });
  }
});

// Actualizar un predio
app.put('/api/predios/:id', async (req, res) => {
  const { id } = req.params;
  const { hectareas, nombre_sector } = req.body;
  try {
    await db.query(
      'UPDATE predios SET hectareas = ?, nombre_sector = ? WHERE id_predio = ?',
      [hectareas, nombre_sector, id]
    );
    res.json({ message: 'Predio actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar predio:', error);
    res.status(500).json({ message: 'Error al actualizar predio', error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!', error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});