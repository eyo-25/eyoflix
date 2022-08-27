import { useQuery } from "@tanstack/react-query";
import { useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { getTvShows, ITvShowsResult } from "../api";
import { BigTv } from "../Components/BigTv";
import Loader from "../Components/Loader";
import { TvSlider } from "../Components/TvSlide";
import { TvTypes} from "../enums";
import { makeImagePath } from "../utiles";
import { Banner, BtnVariants, HomeDetailBtn, Overview, Title, Wrapper } from "./Home";

export function Tv() {
  const { isLoading, data } = useQuery<ITvShowsResult>(["tvshow", "airingtoday"], ()=>getTvShows(TvTypes.on_the_air))
  const navigate = useNavigate();
  const btnClick = (movieId:number|undefined)=> navigate(`/tvs/${TvTypes.airing_today}/${movieId}`)
  const bigTvMatch = useMatch(`/tvs/${TvTypes.airing_today}/:tvId`)
  const {scrollY} = useScroll()
    return(
      <>
        <Wrapper>
          { isLoading ? (
            <Loader>Now Loading...</Loader>
          ) : (
              <>
                <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].name}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                    <HomeDetailBtn
                      layoutId={TvTypes.airing_today + data?.results[0].id}
                      onClick={()=>btnClick(data?.results[0].id)} variants={BtnVariants}
                      whileHover="hover"
                    >
                      상세정보
                    </HomeDetailBtn>
                </Banner>
                <TvSlider type={TvTypes.popular}/>
                <TvSlider type={TvTypes.airing_today}/> 
                <TvSlider type={TvTypes.on_the_air}/>
                <TvSlider type={TvTypes.top_rated}/>
              </>
          )}
        </Wrapper>
        { bigTvMatch?
            <BigTv type={TvTypes.airing_today} data={data} scrollY={scrollY.get()}></BigTv>
        : null }
      </>
    )
}