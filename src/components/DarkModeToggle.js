import React from 'react';
import '../styles/DarkModeToggle.style.css';

const DarkModeToggle = () => {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  };

  return (
    <button className="toggle-dark-mode" onClick={toggleDarkMode}>
      <svg
        className="dark-mode-light"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 
                    17.316 22 12.001 22 6.477 22 2 17.523 2 12 
                    c0-5.315 4.146-9.661 9.38-9.981z"
        />
      </svg>
      <svg
        className="dark-mode-dark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 
                19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 
                7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 
                2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 
                1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 
                16.95l1.414 1.414-2.121 2.121-1.414-1.414 
                2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"
        />
      </svg>
    </button>
  );
};

export default DarkModeToggle;
