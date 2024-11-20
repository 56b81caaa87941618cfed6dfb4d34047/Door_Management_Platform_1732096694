import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white p-8 w-full h-full relative"> {/* Full width and height */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{backgroundImage: 'url(https://raw.githubusercontent.com/56b81caaa87941618cfed6dfb4d34047/Door_Management_Platform_1732096694/main/src/assets/images/b724657521fc490bb063551b8e6946f3.jpeg)'}}></div>
      <div className="container mx-auto h-full relative z-10">
      <div className="container mx-auto h-full">
        <div className="flex flex-wrap justify-between h-full">
          
          {/* FOOTER COPY */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">DoorMaster</h3>
            <p className="text-gray-400">© 2023 DoorMaster. Elevating homes, one door at a time.</p>
          </div>

          {/* SOCIALS */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </footer>
  );
};

export { Footer as component };