import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { getTvShowDetail, getTvShows, IGetTvShowsDetail, ITvShowsResult } from "../api";
import { BigTv } from "../Components/BigTv";
import Loader from "../Components/Loader";
import { TvSlider } from "../Components/TvSlide";
import { TvTypes} from "../enums";
import { makeImagePath } from "../utiles";
import { Banner, BtnVariants, HomeDetailBtn, HomeGengre, HomeRank, Overview, TagBox, Title, Wrapper } from "./Home";

export function Tv() {
  const { isLoading, data } = useQuery<ITvShowsResult>(["tvshow", "airingtoday"], ()=>getTvShows(TvTypes.on_the_air))
  const navigate = useNavigate();
  const btnClick = (movieId:number|undefined)=> {
    navigate(`/tvs/${TvTypes.airing_today}/${movieId}`)
    document.body.classList.add("stop-scroll")
  }
  const bigTvMatch = useMatch(`/tvs/${TvTypes.airing_today}/:tvId`)
  const {scrollY} = useScroll()
  const {data:detailData, isLoading:detailLoding} = useQuery<IGetTvShowsDetail>([data?.results[0].id, "detail"], ()=>getTvShowDetail(data?.results[0].id+""))
    return(
      <>
        <Wrapper>
          { isLoading ? (
            <Loader>Now Loading...</Loader>
          ) : (
              <>
                <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <TagBox>
                      <HomeRank>★{data?.results[0].vote_average}</HomeRank>
                      {detailData?.genres.map((genres)=><HomeGengre>#{genres.name}</HomeGengre>)}
                    </TagBox>
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
        <AnimatePresence
          onExitComplete={() =>
            document.body.classList.remove("stop-scroll")
          }
        >
          { bigTvMatch?
              <BigTv type={TvTypes.airing_today} data={data} scrollY={scrollY.get()}></BigTv>
          : null }
        </AnimatePresence>
      </>
    )
}