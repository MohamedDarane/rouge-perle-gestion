
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getActiveDrinks } from '../services/cafeService';
import { Drink } from '../types';
import { Coffee, Search, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Drink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch products when component mounts
    const drinks = getActiveDrinks();
    setProducts(drinks);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-cafeBlack">Produits</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cafeRed focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-cafeRed text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-red-700 transition-colors">
              <Plus size={18} className="mr-2" />
              Ajouter un produit
            </button>
          </div>
        </div>

        <div className="cafe-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium flex items-center">
                      <div className="h-8 w-8 bg-cafeLightGray rounded-full flex items-center justify-center mr-3">
                        <Coffee size={16} className="text-cafeRed" />
                      </div>
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price.toFixed(2)} €</TableCell>
                    <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Aucun produit trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
