import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CultivosPrediosDashboard = ({ hectareasInfo, tiposCultivos }) => {
  return (
    <Container className="mt-5">
      <h2 className="mb-4">Información de Cultivos y Predios</h2>
      
      {/* Resumen general */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Hectáreas</Card.Title>
              <Card.Text>{hectareasInfo.totalHectareas}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Predios</Card.Title>
              <Card.Text>{hectareasInfo.totalPredios}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Sectores</Card.Title>
              <Card.Text>{hectareasInfo.totalSectores}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Tarjetas de cultivos */}
      <h3 className="mb-3">Cultivos Actuales</h3>
      <Row>
        {tiposCultivos && tiposCultivos.length > 0 ? (
          tiposCultivos.map((cultivo, index) => (
            <Col xs={12} sm={6} md={4} key={index} className="mb-4">
              <Card>
                <Card.Img 
                  variant="top"
                  src={cultivo.imagen_url || `/api/placeholder/400/200?text=${cultivo.nombre}`}
                  alt={cultivo.nombre}
                />
                <Card.Body>
                  <Card.Title>{cultivo.nombre}</Card.Title>
                  <Card.Text>Descripción: {cultivo.descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No hay cultivos disponibles.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CultivosPrediosDashboard;
