import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { fetchDataFromApi } from './utils/api';  // we have to write method name in curly brasic because we don't export method as "default"
import { useSelector, useDispatch } from 'react-redux'
import { getApiConfiguration , getGenres } from './store/homeSlice';
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from './pages/home/Home';
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from './pages/pageNotFound/PageNotFound';


function App() {
  const dispatch = useDispatch();  // to call the action (useDispatch is must for use action in components)
  const { url } = useSelector((state) => state.home); // Here, state return "reducer" object from store.js file hence we write state.home
  console.log(url);  // we use useSelector for use "values" of "action" (like url.total_pages)

  useEffect(() => {
    fetchApiConfig();
    generCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration")
      .then((res) => {
        console.log(res);

        const url ={          // all of this is for images url
          backdrop: res.images.secure_base_url + "original" ,
          poster: res.images.secure_base_url + "original" ,
          profile: res.images.secure_base_url + "original" ,
        }

        dispatch(getApiConfiguration(url));
      })
  };

  const generCall = async () => {
    let promises = []
    let endPoints = ["tv","movie"]
    let allGenres = {}

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises);
    data.map(({genres}) => {
      return genres.map((item) => (allGenres[item.id] = item)) // it store key value pair of id as key and item as value in allGeners obj.
    })
    dispatch(getGenres(allGenres));
  }
 

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:mediaType/:id' element={<Details />} />
        <Route path='/search/:query' element={<SearchResult />} />
        <Route path='/explore/:mediaType' element={<Explore />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App;


// The important thing is that we highly recommand to read tmdb website documentation
// for what url we need to show image and also url for trending in short end point must
// define as same as tmdb documentaion SVGRadialGradientElement.