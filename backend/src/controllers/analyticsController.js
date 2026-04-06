import Sale from '../models/Sale.js';
import Purchase from '../models/Purchase.js';
import Product from '../models/Product.js';

export const getRevenue = async (req, res) => {
  try {
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const allSales = await Sale.find();
    const allPurchases = await Purchase.find();
    

    const totalSalesAmount = allSales.reduce((sum, sale) => {
      const saleAmount = sale.totalAmount || (sale.salePrice * sale.quantity);
      return sum + saleAmount;
    }, 0);

    const totalPurchasesAmount = allPurchases.reduce((sum, purchase) => {
      const purchaseAmount = purchase.totalAmount || (purchase.unitPrice * purchase.quantity);
      return sum + purchaseAmount;
    }, 0);

    const totalRevenue = totalSalesAmount - totalPurchasesAmount;
    const totalSales = allSales.length;
    const totalPurchases = allPurchases.length;

    const salesThisMonth = allSales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    }).length;

    res.json({
      totalRevenue,
      totalSales,
      totalSalesAmount,
      totalPurchases,
      totalPurchasesAmount,
      salesThisMonth
    });
  } catch (error) {
    console.error('Analytics: Error fetching revenue data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const sales = await Sale.find();
    const productSales = {};

    sales.forEach(sale => {
      const productId = sale.productId.toString();
      if (!productSales[productId]) {
        productSales[productId] = {
          productId,
          productName: sale.productName,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      
      productSales[productId].totalQuantity += sale.quantity;
      productSales[productId].totalRevenue += (sale.totalAmount || (sale.salePrice * sale.quantity));
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSalesTrend = async (req, res) => {
  try {
    const sales = await Sale.find();
    const now = new Date();
    const monthlyData = {};

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toLocaleString('default', { month: 'short' });
      monthlyData[monthKey] = { month: monthKey, sales: 0 };
    }

    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate);
      const monthKey = saleDate.toLocaleString('default', { month: 'short' });
      const saleAmount = sale.totalAmount || (sale.salePrice * sale.quantity);
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].sales += saleAmount;
      }
    });

    const salesTrendData = Object.values(monthlyData);
    res.json(salesTrendData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getInventoryByCategory = async (req, res) => {
  try {
    const products = await Product.find();
    const categoryData = {};

    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categoryData[category]) {
        categoryData[category] = { category, count: 0 };
      }
      categoryData[category].count += product.stock || 0;
    });

    const inventoryData = Object.values(categoryData).sort((a, b) => b.count - a.count);
    res.json(inventoryData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCategoryDistribution = async (req, res) => {
  try {
    const products = await Product.find();
    const categoryData = {};
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    let colorIndex = 0;

    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categoryData[category]) {
        categoryData[category] = {
          name: category,
          value: 0,
          color: colors[colorIndex % colors.length]
        };
        colorIndex++;
      }
      categoryData[category].value += product.stock || 0;
    });

    const distributionData = Object.values(categoryData).sort((a, b) => b.value - a.value);
    res.json(distributionData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getInventoryValue = async (req, res) => {
  try {
    const products = await Product.find();
    const purchases = await Purchase.find();
    
    let totalValue = 0;
    
    products.forEach(product => {
      const productPurchases = purchases.filter(p => 
        p.product && p.product.toString() === product._id.toString()
      );
      
      if (productPurchases.length > 0) {
        const avgUnitPrice = productPurchases.reduce((sum, purchase) => 
          sum + purchase.unitPrice, 0) / productPurchases.length;
        totalValue += (product.stock || 0) * avgUnitPrice;
      }
    });

    res.json({ totalInventoryValue: totalValue });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAdvancedMetrics = async (req, res) => {
  try {
    const products = await Product.find();
    const purchases = await Purchase.find();
    const sales = await Sale.find();
    
    const totalSalesAmount = sales.reduce((sum, sale) => {
      const saleAmount = sale.totalAmount || (sale.salePrice * sale.quantity);
      return sum + saleAmount;
    }, 0);

    const totalPurchasesAmount = purchases.reduce((sum, purchase) => {
      const purchaseAmount = purchase.totalAmount || (purchase.unitPrice * purchase.quantity);
      return sum + purchaseAmount;
    }, 0);

    const profit = totalSalesAmount - totalPurchasesAmount;
    
    const totalPurchaseCost = purchases.reduce((sum, purchase) => 
      sum + (purchase.totalAmount || (purchase.unitPrice * purchase.quantity)), 0);
    
    let totalInventoryValue = 0;
    products.forEach(product => {
      const productPurchases = purchases.filter(p => 
        p.product && p.product.toString() === product._id.toString()
      );
      
      if (productPurchases.length > 0) {
        const avgUnitPrice = productPurchases.reduce((sum, purchase) => 
          sum + purchase.unitPrice, 0) / productPurchases.length;
        totalInventoryValue += (product.stock || 0) * avgUnitPrice;
      }
    });

    const inventoryTurnover = totalInventoryValue > 0 ? totalPurchaseCost / totalInventoryValue : 0;

    res.json({
      profit,
      totalSalesAmount,
      totalPurchasesAmount,
      inventoryTurnover: Math.round(inventoryTurnover * 10) / 10,
      totalInventoryValue,
      totalPurchaseCost,
      stockAccuracy: null,
      orderFillRate: null
    });
  } catch (error) {
    console.error('Analytics: Error calculating advanced metrics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
