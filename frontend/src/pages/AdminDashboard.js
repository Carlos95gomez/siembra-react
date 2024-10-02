import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PrediosPanel from '../components/PrediosPanel';
import SiembrasPanel from '../components/SiembrasPanel';
import UsuariosPanel from '../components/UsuariosPanel';
import TiposCultivosPanel from '../components/TiposCultivosPanel';

function AdminDashboard() {
  const [key, setKey] = useState('predios');

  return (
    <div className="container mt-5">
      <h2>Panel de Administración</h2>
      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="predios" title="Predios">
          <PrediosPanel />
        </Tab>
        <Tab eventKey="siembras" title="Siembras">
          <SiembrasPanel />
        </Tab>
        <Tab eventKey="usuarios" title="Usuarios">
          <UsuariosPanel />
        </Tab>
        <Tab eventKey="tipos_cultivos" title="Tipos de Cultivos">
          <TiposCultivosPanel />
        </Tab>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;