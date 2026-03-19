import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

export default function Home() {
  const { currentUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) { navigate('/auth'); return; }
    switch (currentUser.role) {
      case 'admin': navigate('/hub'); break;
      case 'barber': navigate('/barber'); break;
      case 'customer': navigate('/customer'); break;
    }
  }, [currentUser, navigate]);

  return null;
}
