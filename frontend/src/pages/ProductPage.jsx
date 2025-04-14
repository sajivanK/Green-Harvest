import React from 'react'
import Header from '../components/common/Header'
import StatCard from '../components/common/StatCard'
import ProductTable from '../components/products/ProductTable'


import { motion } from "framer-motion"
import { AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react'
import CategoryDistributionChart from '../components/overview/CategoryDistributionChart'
import SalesTrendChart from '../components/products/SalesTrendChart'


const ProductPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'> 
      <Header title="Products" />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
          {/* STATS */}  
          <motion.div
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1}}
          >
            <StatCard name="Total Sales" icon={Package} value='$1,234' color='#6366F1'/>
            <StatCard name="New Users" icon={TrendingUp} value='128' color='#6366F1'/>
            <StatCard name="Total Products" icon={AlertTriangle} value='56' color='#6366F1'/>
            <StatCard name="Conversion Rate" icon={DollarSign} value='12.5%' color='#6366F1'/>
            
          </motion.div>

          {/* ProductTable */}
          <ProductTable />

          {/* CHARTS */}
          <div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
            <SalesTrendChart />
            <CategoryDistributionChart />

          </div>
      </main>
      
    </div>
  )
}

export default ProductPage
