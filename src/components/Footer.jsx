import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="footer-logo-dot" />
            <span className="footer-title">Rumah Bunda LMS</span>
            <span className="badge badge-sage" style={{ fontSize: '0.7rem', padding: '1px 7px' }}>Kelas VII SMP</span>
          </div>
          <p className="footer-tagline">
            Platform Belajar Mandiri Interaktif untuk Siswa Kelas VII SMP
          </p>
        </div>

        <div className="footer-right">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Rumah Bunda. Seluruh hak cipta dilindungi.
          </div>
          <div className="footer-subtext">
            <span>Dibuat dengan</span>
            <Heart size={13} color="#E11D48" fill="#E11D48" style={{ display: 'inline', margin: '0 3px' }} />
            <span>untuk pendidikan anak bangsa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
