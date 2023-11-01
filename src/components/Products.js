import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
   CircularProgress,
   Grid,
   InputAdornment,
   TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
// import Cart, { generateCartItemsFrom } from "./Cart";

const Products = () => {
   const token = localStorage.getItem("token");
   const { enqueueSnackbar } = useSnackbar();
   const [isLoading, setLoading] = useState(false);
   const [debounceTimeout, setDebounceTimeout] = useState(null);
   const [products, setProducts] = useState([]);
   const [filteredProducts, setFilteredProducts] = useState([]);
   // const [items, setItems] = useState([]);

   /**
    * Make API call to get the products list and store it to display the products
    *
    * @returns { Array.<Product> }
    */
   const performAPICall = async () => {
      setLoading(true);

      try {
         const response = await axios.get(`${config.endpoint}/products`);
         setLoading(false);
         setProducts(response.data);
         setFilteredProducts(response.data);
      } catch (e) {
         setLoading(false);

         if (e.response && e.response.status === 500) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
            return null;
         } else {
            enqueueSnackbar(
               "Something went wrong. Check the backend console for more details",
               { variant: "error" }
            );
         }
      }
   };

   /**
    * Definition for search handler
    * This is the function that is called on adding new search keys
    *
    * @param {string} text
    *    Text user types in the search bar. To filter the displayed products based on this text.
    *
    * @returns { Array.<Product> }
    *      Array of objects with complete data on filtered set of products
    *
    * API endpoint - "GET /products/search?value=<search-query>"
    *
    */
   const performSearch = async (text) => {
      try {
         const response = await axios.get(
            `${config.endpoint}/products/search?value=${text}`
         );

         setFilteredProducts(response.data);
      } catch (e) {
         if (e.response) {
            if (e.response.status === 404) {
               setFilteredProducts([]);
            }

            if (e.response.status === 500) {
               enqueueSnackbar(e.response.data.message, {
                  variant: "error",
               });
               setFilteredProducts(products);
            }
         } else {
            enqueueSnackbar(
               "Something went wrong. Check the backend console for more details",
               { variant: "error" }
            );
         }
      }
   };

   /**
    * Definition for debounce handler
    * With debounce, this is the function to be called whenever the user types text in the searchbar field
    *
    * @param {{ target: { value: string } }} event
    *    JS event object emitted from the search input field
    *
    * @param {NodeJS.Timeout} debounceTimeout
    *    Timer id set for the previous debounce call
    *
    */
   const debounceSearch = (event, debounceTimeout) => {
      const value = event.target.value;

      if (debounceTimeout) {
         clearTimeout(debounceTimeout);
      }

      const Timeout = setTimeout(async () => {
         await performSearch(value);
      }, 500);
      setDebounceTimeout(Timeout);
   };


   useEffect(() => {
      performAPICall();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);


   return (
      <div>
         <Header>
            <TextField
               className="search-desktop"
               size="small"
               InputProps={{
                  className: "search",
                  endAdornment: (
                     <InputAdornment position="end">
                        <Search color="primary" />
                     </InputAdornment>
                  ),
               }}
               placeholder="Search for items/categories"
               name="search"
               onChange={(e) => debounceSearch(e, debounceTimeout)}
            />
         </Header>

         {/* Search view for mobiles */}
         <TextField
            className="search-mobile"
            size="small"
            fullWidth
            InputProps={{
               endAdornment: (
                  <InputAdornment position="end">
                     <Search color="primary" />
                  </InputAdornment>
               ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={(e) => debounceSearch(e, debounceTimeout)}
         />

         <Grid container>
            <Grid item className="product-grid" md={token ? 12 : 12}>
               <Box className="hero">
                  <p className="hero-heading">
                     India’s{" "}
                     <span className="hero-highlight">FASTEST DELIVERY</span> to
                     your door step
                  </p>
               </Box>

               {isLoading ? (
                  <Box className="loading">
                     <CircularProgress />
                     <h4>Loading Products...</h4>
                  </Box>
               ) : (
                  <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
                     {filteredProducts.length ? (
                        filteredProducts.map((product) => (
                           <Grid item xs={6} md={3} key={product._id}>
                              <ProductCard
                                 product={product}
                              />
                           </Grid>
                        ))
                     ) : (
                        <Box className="loading">
                           <SentimentDissatisfied color="action" />
                           <h4 style={{ color: "#636363" }}>
                              No products found
                           </h4>
                        </Box>
                     )}
                  </Grid>
               )}
            </Grid>

            {/* {token ? (
               <Grid item xs={12} md={14} bgcolor="#E9F5E1">
               </Grid>
            ) : null} */}
         </Grid>
         <Footer />
      </div>
   );
};

export default Products;
