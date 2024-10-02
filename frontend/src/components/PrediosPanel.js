import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button, Alert, Modal, Container, Row, Col, Card } from 'react-bootstrap';

function PrediosPanel() {
  const [predios, setPredios] = useState([]);
  const [newPredio, setNewPredio] = useState({ hectareas: '', nombre_sector: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingPredio, setEditingPredio] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchPredios();
  }, []);

  const fetchPredios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/predios');
      setPredios(response.data);
    } catch (error) {
      setError('Error al cargar los predios');
      console.error('Error fetching predios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingPredio) {
      setEditingPredio({ ...editingPredio, [name]: value });
    } else {
      setNewPredio({ ...newPredio, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/predios', newPredio);
      fetchPredios();
      setNewPredio({ hectareas: '', nombre_sector: '' });
      setSuccess('Predio creado exitosamente');
    } catch (error) {
      setError('Error al crear el predio');
      console.error('Error creating predio:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/predios/${id}`);
      fetchPredios();
      setSuccess('Predio eliminado exitosamente');
    } catch (error) {
      setError('Error al eliminar el predio');
      console.error('Error deleting predio:', error);
    }
  };

  const handleEdit = (predio) => {
    setEditingPredio(predio);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/predios/${editingPredio.id_predio}`, editingPredio);
      setShowEditModal(false);
      setEditingPredio(null);
      fetchPredios();
      setSuccess('Predio actualizado exitosamente');
    } catch (error) {
      setError('Error al actualizar el predio');
      console.error('Error updating predio:', error);
    }
  };

  return (
    <Container>
      <Card className="mb-4">
        <Card.Header as="h5">Gestión de Predios</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit} className="mb-4">
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Hectáreas</Form.Label>
                  <Form.Control
                    type="number"
                    name="hectareas"
                    value={newPredio.hectareas}
                    onChange={handleInputChange}
                    placeholder="Ingrese cantidad de hectáreas"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Sector</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_sector"
                    value={newPredio.nombre_sector}
                    onChange={handleInputChange}
                    placeholder="Ingrese nombre del sector"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button type="submit" variant="primary" className="w-100">
                  Agregar Predio
                </Button>
              </Col>
            </Row>
          </Form>

          <Table striped bordered hover responsive>
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Hectáreas</th>
                <th>Nombre del Sector</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {predios.map((predio) => (
                <tr key={predio.id_predio}>
                  <td>{predio.id_predio}</td>
                  <td>{predio.hectareas}</td>
                  <td>{predio.nombre_sector}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => handleEdit(predio)}
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(predio.id_predio)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Predio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Hectáreas</Form.Label>
              <Form.Control
                type="number"
                name="hectareas"
                value={editingPredio?.hectareas || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Sector</Form.Label>
              <Form.Control
                type="text"
                name="nombre_sector"
                value={editingPredio?.nombre_sector || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PrediosPanel;