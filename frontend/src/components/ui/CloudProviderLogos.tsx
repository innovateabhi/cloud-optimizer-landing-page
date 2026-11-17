import React from 'react';

// Amazon Web Services (AWS) Logo
export const AwsLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div 
    className={`h-9 px-2 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 select-none ${className}`} 
    title="Amazon Web Services"
  >
    <img
      src="/images/logos/aws.png"
      alt="AWS Logo"
      className="h-[26px] max-h-[26px] w-auto object-contain"
    />
  </div>
);

// Microsoft Azure Logo
export const AzureLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div 
    className={`h-9 px-2 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 select-none ${className}`} 
    title="Microsoft Azure"
  >
    <img
      src="/images/logos/azure.png"
      alt="Microsoft Azure Logo"
      className="h-[25px] max-h-[25px] w-auto object-contain"
    />
  </div>
);

// Google Cloud Logo
export const GoogleCloudLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div 
    className={`h-9 px-2 flex items-center gap-2 cursor-pointer transition-transform duration-200 hover:scale-105 select-none ${className}`} 
    title="Google Cloud Platform"
  >
    <svg className="h-[22px] w-auto shrink-0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.9c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.3-10.1 7.3-17.5z"/>
      <path fill="#FBBC05" d="M10.6 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C1 16.7 0 20.2 0 24s1 7.3 2.7 10.7l7.9-6.1z"/>
      <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-7.5-5.8c-2.2 1.5-5 2.4-8.5 2.4-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/>
    </svg>
    <span className="font-display font-bold text-sm tracking-tight text-slate-800">
      Google <span className="text-[#4285F4]">Cloud</span>
    </span>
  </div>
);

// DigitalOcean Logo
export const DigitalOceanLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div 
    className={`h-9 px-2 flex items-center gap-2 cursor-pointer transition-transform duration-200 hover:scale-105 select-none ${className}`} 
    title="DigitalOcean"
  >
    <img
      src="/images/logos/digitalocean.png"
      alt="DigitalOcean Logo"
      className="h-[22px] max-h-[22px] w-auto object-contain shrink-0"
    />
    <span className="font-display font-bold text-sm tracking-tight text-[#0080FF]">
      DigitalOcean
    </span>
  </div>
);

// Kubernetes Logo
export const KubernetesLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div 
    className={`h-9 px-2 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 select-none ${className}`} 
    title="Kubernetes"
  >
    <img
      src="/images/logos/kubernetes.png"
      alt="Kubernetes Logo"
      className="h-[24px] max-h-[24px] w-auto object-contain"
    />
  </div>
);
