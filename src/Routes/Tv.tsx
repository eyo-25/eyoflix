import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { getTvShows, ITvShowsResult } from "../Api/api";
import { BigTv } from "../Components/Modal/BigTv";
import Loader from "../Components/Loader";
import { TvSlider } from "../Components/Home/TvSlide";
import { TvTypes} from "../enums";
import { makeImagePath } from "../Api/utiles";
import { Banner, BtnVariants, genreType, HomeDetailBtn, HomeGengre, HomeRank, Overview, TagBox, Title, Wrapper } from "./Home";

const genres: genreType = {
  10759: "액션 & 어드벤처",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  10762: "키즈",
  9648: "미스터리",
  10763: "뉴스",
  10764: "리얼리티",
  10765: "공상과학 & 판타지",
  10766: "연속극",
  10767: "토크",
  10768: "전쟁 & 정치",
  37: "서부",
};

export function Tv() {
  const { isLoading, data } = useQuery<ITvShowsResult>(["tvshow", "airingtoday"], ()=>getTvShows(TvTypes.on_the_air))
  const navigate = useNavigate();
  const btnClick = (movieId:number|undefined)=> {
    navigate(`/tvs/${TvTypes.airing_today}/${movieId}`)
    document.body.classList.add("stop-scroll")
  }
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
                    <TagBox>
                      <HomeRank>★{data?.results[0].vote_average}</HomeRank>
                      {data?.results[0].genre_ids.map((g)=><HomeGengre key={g}>#{genres[g]}</HomeGengre>)}
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