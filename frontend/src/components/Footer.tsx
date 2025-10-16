import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-white border-t border-gray-200 text-center text-gray-500 text-sm mt-12">
      {new Date().getFullYear()} - Diretoria de Gestão de Projetos e Processos. Secretaria de Planejamento de Avaliação e Informações Institucionais. UFG
    </footer>
  );
};

export default Footer; 