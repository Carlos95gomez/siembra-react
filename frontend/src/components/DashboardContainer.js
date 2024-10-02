import React, { useState, useEffect } from 'react';
import CultivosPrediosDashboard from './CultivosPrediosDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

const DashboardContainer = () => {
  const [hectareasInfo, setHectareasInfo] = useState(null);
  const [tiposCultivos, setTiposCultivos] = useState([]);

  useEffect(() => {
    // Fetch hectareasInfo
    fetch('/api/hectareas-info')
      .then(response => response.json())
      .then(data => setHectareasInfo(data))
      .catch(err => console.error('Error fetching hectareas info:', err));

    // Fetch tiposCultivos
    fetch('/api/tipos-cultivos')
      .then(response => response.json())
      .then(data => setTiposCultivos(data))
      .catch(err => console.error('Error fetching tipos cultivos:', err));
  }, []);

  if (!hectareasInfo) return <div>Cargando información de hectáreas...</div>;

  return (
    <CultivosPrediosDashboard 
      hectareasInfo={hectareasInfo} 
      tiposCultivos={tiposCultivos}
    />
  );
};

export default DashboardContainer;
