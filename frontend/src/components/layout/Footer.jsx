const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Countries Explorer. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <p>Built with React + REST Countries API</p>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;