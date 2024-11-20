import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [doorColor, setDoorColor] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [number1, setNumber1] = useState<number>(0);
  const [number2, setNumber2] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);


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

  const handleCalculation = () => {
    setResult(number1 + number2);
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
          <span className="font-bold">Price: ${price}</span>
        </div>

        <div className="flex items-center ml-4">
          <input
            type="number"
            value={number1}
            onChange={(e) => setNumber1(Number(e.target.value))}
            className="w-16 p-2 mr-2 text-blue-500 rounded-lg"
          />
          <span className="mr-2">+</span>
          <input
            type="number"
            value={number2}
            onChange={(e) => setNumber2(Number(e.target.value))}
            className="w-16 p-2 mr-2 text-blue-500 rounded-lg"
          />
          <button
            onClick={handleCalculation}
            className="bg-green-500 text-white p-2 rounded-lg"
          >
            <i className='bx bx-calculator mr-1'></i>
            Calculate
          </button>
          {result !== null && (
            <span className="ml-2 font-bold">= {result}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header as component };