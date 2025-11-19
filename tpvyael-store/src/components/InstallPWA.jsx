import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 rounded-lg shadow-2xl p-4 z-50"
      style={{ backgroundColor: '#EEEEEE' }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: '#FACC2E' }}
        >
          <Download size={24} color="#111827" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold mb-1" style={{ color: '#111827' }}>
            Instalar TPV Yael
          </h3>
          <p className="text-sm mb-3" style={{ color: '#6C757D' }}>
            Instala la aplicación en tu dispositivo para acceso rápido
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 rounded-lg font-semibold text-sm"
              style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
            >
              Instalar
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="px-4 py-2 rounded-lg font-semibold text-sm"
              style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
            >
              Ahora no
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowInstall(false)}
          style={{ color: '#6C757D' }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export default InstallPWA;