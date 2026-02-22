import React from 'react';
import BackButton from './BackButton';

const PageHeader = ({ 
  title, 
  subtitle, 
  onBack, 
  darkMode, 
  backLabel,
  actions,
  showBackButton = true 
}) => {
  return (
    <div className={`mb-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {showBackButton && onBack && (
            <BackButton 
              onClick={onBack} 
              darkMode={darkMode} 
              label={backLabel}
            />
          )}
          <div className="flex-1">
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
