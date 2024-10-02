import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CultivosPrediosDashboard from '../components/CultivosPrediosDashboard';

function Home() {
  const [hectareasInfo, setHectareasInfo] = useState(null);
  const [tiposCultivos, setTiposCultivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [responseHectareas, responseCultivos] = await Promise.all([
          axios.get('http://localhost:5000/api/hectareas-info'),
          axios.get('http://localhost:5000/api/tipos-cultivos')
        ]);
        setHectareasInfo(responseHectareas.data);
        setTiposCultivos(responseCultivos.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Hubo un error al cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Cargando información...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h1>Bienvenido</h1>
      <p>Aun esta en consttrucion</p>

      {hectareasInfo && <CultivosPrediosDashboard hectareasInfo={hectareasInfo} />}

      <h2 className="mt-4">Tipos de Cultivos</h2>
      <div className="row">
        {tiposCultivos.map(cultivo => (
          <div className="col-md-4" key={cultivo.id_tipo_cultivo}>
            <div className="card mb-4">
              {cultivo.imagen_url ? (
                <img 
                  src={cultivo.imagen_url} 
                  className="card-img-top" 
                  alt={cultivo.nombre_cultivo}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'ruta/a/imagen/por/defecto.jpg';
                  }}
                />
              ) : (
                <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                  <span className="text-muted">No image available</span>
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{cultivo.nombre_cultivo}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;