import React, { useState, useRef, useEffect } from 'react';
import { Camera, Lock, User, Shield } from 'lucide-react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError('Acesso à câmera negado ou não disponível');
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="container">
      <div className="login-form-side">
        <Shield className="shield-icon" />
        <div className="header">
          <h2>Acesso Seguro</h2>
          <p>Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <div className="input-container">
              <User />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-container">
              <Lock />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Entrar
          </button>

          <a href="#" className="forgot-password">
            Esqueceu sua senha?
          </a>
        </form>
      </div>

      <div className="camera-side">
        <div className="camera-container">
          <div className="camera-header">
            <Camera />
            <span>Verificação Qr Code</span>
          </div>
          
          <div className="camera-view">
            {cameraError ? (
              <div className="error-message">
                <p>{cameraError}</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
              />
            )}
          </div>
          
          <div className="camera-status">
            Posicione seu Qr Code no centro da câmera para verificação de identidade.
          </div>

          {isProcessing && (
            <div className="processing-container">
              <span>Processando</span>
              <div className="processing-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;