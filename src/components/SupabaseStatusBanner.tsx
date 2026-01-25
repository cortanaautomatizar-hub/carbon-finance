import React, { useEffect, useState } from 'react';
import getSupabase from '../services/supabase';

export const SupabaseStatusBanner: React.FC = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const [status, setStatus] = useState<'ok' | 'missing_env' | 'auth_error' | 'error' | 'loading'>('loading');

  useEffect(() => {
    if (!url || !key) {
      setStatus('missing_env');
      return;
    }

    const sb = getSupabase();
    if (!sb) {
      setStatus('missing_env');
      return;
    }

    // Try a lightweight request to check auth/availability
    (async () => {
      try {
        const res = await sb.from('cards').select('id').limit(1);
        // If Supabase returns an error due to RLS / auth, we consider it auth_error
        if (res.error) {
          // supabase-js returns error with status
          const statusCode = (res.error as { status?: number })?.status;
          if (statusCode === 401 || statusCode === 403) setStatus('auth_error');
          else setStatus('error');
        } else {
          setStatus('ok');
        }
      } catch (e) {
        setStatus('error');
      }
    })();
  }, [url, key]);

  if (status === 'ok' || status === 'loading') return null;

  const baseClass = 'p-3 text-sm text-center';
  if (status === 'missing_env') {
    return (
      <div className={`${baseClass} bg-yellow-200 text-yellow-900`}>
        Aviso: variáveis de ambiente do Supabase não configuradas. Para habilitar cartões, adicione <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no painel do Vercel e redeploy.
      </div>
    );
  }

  if (status === 'auth_error') {
    return (
      <div className={`${baseClass} bg-red-200 text-red-900`}>
        Erro de autenticação ao conectar ao Supabase. Verifique se a chave <code>VITE_SUPABASE_ANON_KEY</code> está correta e se as policies de Row Level Security permitem acesso de preview.
      </div>
    );
  }

  return (
    <div className={`${baseClass} bg-red-100 text-red-800`}>
      Erro ao conectar ao Supabase. Verifique conexões e variáveis de ambiente.
    </div>
  );
};

export default SupabaseStatusBanner;
