import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [doorColor, setDoorColor] = useState<string>('');
  const [price, setPrice] = useState<number>(0);


  const getTitle = () => {
    return doorColor ? `DoorMaster - ${doorColor.charAt(0).toUpperCase() + doorColor.slice(1)} Door` : 'DoorMaster';
  };

  useEffect(() => {
    calculatePrice();
  }, [doorColor]);

  const calculatePrice = () => {
    switch (doorColor) {
      case 'red':
        setPrice(100);
        break;
      case 'blue':
        setPrice(120);
        break;
      case 'green':
        setPrice(110);
        break;
      case 'yellow':
        setPrice(90);
        break;
      default:
        setPrice(0);
    }
  };


  return (
    <header className="bg-blue-500 text-white p-4 w-full h-full">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="text-2xl font-bold">{getTitle()}</div>
        
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

        <div className="flex items-center ml-4">
          <i className='bx bx-calculator mr-2 text-xl'></i>
          <span className="font-bold">Price: ${price}</span>
        </div>
      </div>
      </div>
    </header>
  );
};

export { Header as component };