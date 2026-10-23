import React from 'react';
import { AlertOctagon, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const RestrictedBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="restricted-ribbon-banner">
      <div className="ribbon-content">
        <AlertOctagon size={18} className="ribbon-icon" />
        <span>{t('restrictedWarning')}</span>
      </div>
      <a href="mailto:admin@villonwood.com" className="ribbon-contact-link">
        <Mail size={14} /> Contacter l'Admin
      </a>
    </div>
  );
};

export default RestrictedBanner;
