import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { BigMovie } from "../Components/BigMovie";
import Loader from "../Components/Loader";
import { MovieSlider } from "../Components/Slider";
import { Types } from "../enums";
import { makeImagePath } from "../utiles";

export type genreType = {
  [key: number]: string;
};

const genres: genreType = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  10770: "TV 영화",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
};


export const Wrapper = styled.div`
  background: black;
`;

export const Banner = styled.div<{ bgphoto: string }>`
  height: 90vh;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image:
  linear-gradient(rgba(0, 0, 0, 0), 40%, rgba(0, 0, 0, 1)),
  linear-gradient(rgba(0, 0, 0, 0.2), 10% , rgba(0, 0, 0, 0)),
  url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  margin-bottom: 80px;
`;

export const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 15px;
  font-weight: 600;
  letter-spacing: -2.5px;
`;

export const Overview = styled.p`
  font-size: 16px;
  line-height: 1.6;
  width: 540px;
  margin-bottom: 30px;
`;

export const HomeDetailBtn = styled(motion.button)`
  font-size: 16px;
  width: 15vh;
  padding: 10px;
  border-radius: 5px;
  border: none;
  font-weight: 400;
  cursor: pointer;
  transition: 0.2 ease;
`

export const TagBox = styled.div`
    display: flex;
    margin-bottom: 15px;
    cursor: pointer;
    div {
      font-weight: 400;
      padding: 5px;
      border-radius: 5px;
    }
`

export const HomeRank = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
`

export const HomeGengre = styled.div`
  color: rgb(254, 211, 48);
  border: 1px solid rgb(254, 211, 48);
  margin-left: 6px;
  &:hover{
    color: rgb(255, 255, 255);
    background-color: rgb(254, 211, 48);
    border: rgb(254, 211, 48);
  }
`

export const BtnVariants = {
  normal: {
    scale:1,
    transition: {
      style:"tween",
      duration: 10,
    }
  },
  hover: {
    scale:[1,1.05,1],
    transition: {
      style:"ease-in",
      duration: 1,
      repeat: Infinity,
    },
  }
}

export function Home() {
    const { isLoading, data } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], ()=>getMovies(Types.now_playing))
    const navigate = useNavigate();
    const btnClick = (movieId:number|undefined)=> {
      navigate(`/movies/${Types.now_playing}/${movieId}`)
      document.body.classList.add("stop-scroll")
    }
    const bigMovieMatch = useMatch(`/movies/${Types.now_playing}/:movieId`)
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
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                    <HomeDetailBtn
                      initial="normal"
                      layoutId={Types.now_playing + data?.results[0].id}
                      onClick={()=>btnClick(data?.results[0].id)} variants={BtnVariants}
                      whileHover="hover"
                    >
                      상세정보
                    </HomeDetailBtn>
                </Banner>
                <MovieSlider type={Types.now_playing}/>
                <MovieSlider type={Types.popular}/>
                <MovieSlider type={Types.top_rated}/>
                <MovieSlider type={Types.upcoming}/>
              </>
          )}
        </Wrapper>
        <AnimatePresence
          onExitComplete={() =>
            document.body.classList.remove("stop-scroll")
          }
        >
          { bigMovieMatch?
              <BigMovie type={Types.now_playing} data={data} scrollY={scrollY.get()}></BigMovie>
          : null }
        </AnimatePresence>
      </>
    )
}