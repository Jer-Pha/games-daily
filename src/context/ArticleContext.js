import React, { createContext, useState } from "react";

const ArticleContext = createContext();

const ArticleProvider = ({ children }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <ArticleContext.Provider value={{ selectedArticle, setSelectedArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};

export { ArticleContext, ArticleProvider };
