import React, { useState } from 'react';

const Header: React.FC = () => {
  const [doorColor, setDoorColor] = useState<string>('');

  return (
    <header className="bg-blue-500 text-white p-4 w-full h-full">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="text-2xl font-bold">DoorMaster</div>
        
        <form className="flex items-center">
          <label htmlFor="doorColor" className="mr-2">
            <i className='bx bx-palette mr-1'></i>
            Door Color:
          </label>
          <select
            id="doorColor"
            value={doorColor}
            onChange={(e) => setDoorColor(e.target.value)}
            className="bg-white text-blue-500 rounded-lg p-2"
          >
            <option value="">Select color</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
          </select>
        </form>
      </div>
    </header>
  );
};

export { Header as component };