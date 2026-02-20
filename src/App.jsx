import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import PasswordGate from './components/PasswordGate'
import AppShell from './components/layout/AppShell'
import ExecutiveHome from './components/executive/ExecutiveHome'
import ManagerHome from './components/manager/ManagerHome'
import ClientView from './components/manager/ClientView'
import CampaignView from './components/manager/CampaignView'
import AdGroupView from './components/manager/AdGroupView'
import PackageView from './components/manager/PackageView'
import DealView from './components/manager/DealView'
import CreativeView from './components/manager/CreativeView'
import GeoView from './components/manager/GeoView'

function AppInner() {
  const [mode, setMode] = useState('executive')
  const navigate = useNavigate()

  function handleModeChange(newMode) {
    setMode(newMode)
    navigate(newMode === 'executive' ? '/executive' : '/manager')
  }

  return (
    <AppShell mode={mode} onModeChange={handleModeChange}>
      <Routes>
        <Route path="/" element={<Navigate to="/executive" replace />} />
        <Route path="/executive" element={<ExecutiveHome />} />
        <Route path="/manager" element={<ManagerHome />} />
        <Route path="/manager/:clientId" element={<ClientView />} />
        <Route path="/manager/:clientId/:campaignId" element={<CampaignView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId" element={<AdGroupView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId" element={<PackageView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId" element={<DealView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId/:creativeId" element={<CreativeView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId/:creativeId/:geoId" element={<GeoView />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <PasswordGate>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppInner />
      </BrowserRouter>
    </PasswordGate>
  )
}
