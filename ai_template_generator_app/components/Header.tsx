
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-sky-400 tracking-tight">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block mr-2 -mt-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.0001 1.62207L20.3781 6.00007V14.7781L12.0001 22.3781L3.62207 14.7781V6.00007L12.0001 1.62207ZM12.0001 3.87707L5.80307 7.12307V13.6551L12.0001 19.8251L18.1971 13.6551V7.12307L12.0001 3.87707ZM12.0001 6.31107L15.3781 8.19607L12.0001 10.0821L8.62207 8.19607L12.0001 6.31107ZM7.00007 9.30407L10.3781 11.1891V14.9661L7.00007 13.0801V9.30407ZM17.0001 9.30407V13.0801L13.6221 14.9661V11.1891L17.0001 9.30407Z"/>
          </svg>
          AI Website Template Generator
        </h1>
        <p className="text-slate-400 mt-1">Craft your dream website with the power of AI.</p>
      </div>
    </header>
  );
};
