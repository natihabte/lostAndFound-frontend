import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BackButton = ({ onClick, darkMode, label, className = '' }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 rounded-lg transition-all font-medium ${
        darkMode
          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
          : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 shadow-sm'
      } ${className}`}
      aria-label={label || t('navigation.back')}
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      <span>{label || t('navigation.back')}</span>
    </button>
  );
};

export default BackButton;
