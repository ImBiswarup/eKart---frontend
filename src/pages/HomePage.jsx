import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';


const HomePage = () => {

  const { allItems } = useAppContext();
  // console.log("all items: ", allItems);

  

  return (
    <>
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-20 mx-auto">
          <div className="flex flex-wrap -m-4">
            {
              allItems?.map((item) => (
                <Link key={item._id} to={`${item._id}`} className="lg:w-1/4 md:w-1/2 p-4 w-full cursor-pointer gap-5 ">
                  <a className="block relative h-48 rounded overflow-hidden">
                    <img alt="ecommerce" className="object-center w-full h-full block object-cover" src={item.imageUrl} />
                  </a>
                  <div className="mt-4">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{item.category}</h3>
                    <h2 className="text-white title-font text-lg font-medium">{item.name}</h2>
                    <p className="mt-1">$ {item.price}</p>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
