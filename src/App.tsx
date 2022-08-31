import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './Components/Home/Header';
import { Home } from './Routes/Home';
import Search from './Routes/Search';
import { Tv } from './Routes/Tv';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header></Header>
      <Routes>
          <Route path="/" element={<Home/>}>
              <Route path="/movies/:types/:movieId" element={<Home/>}/>
          </Route>
          <Route path="/tvs" element={<Tv/>}>
              <Route path="/tvs/:types/:tvId" element={<Tv/>}/>
          </Route>
          <Route path="/search" element={<Search/>}>
            <Route path="/search/movies" element={<Search/>}>
              <Route path=":keyword" element={<Search/>}/>
            </Route>
            <Route path="/search/tvs" element={<Search/>}>
              <Route path=":keyword" element={<Search/>}/>
            </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
