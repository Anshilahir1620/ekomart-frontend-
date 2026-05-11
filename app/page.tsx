import React from 'react';
import Banner from './components/Banner';
import CategoriesSection from '@/app/components/CategorySection';
import DealsSection from '@/app/components/Dealsection';
import BestSellingSection from '@/app/components/BestSellingSection';
import Footer from './components/Footer';

const Home: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <main>
          <Banner />
          <CategoriesSection />

          <section className="py-8 bg-gray-50">
            <div className="px-4">

              <DealsSection/>
             
            </div>
          </section>
                       <BestSellingSection/>

        </main>
        <Footer/>
      </div>
    </>
  );
};

export default Home;