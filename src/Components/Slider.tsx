import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, getMovies, IGetMovieDetail, IGetMoviesResult } from "../api";
import { Types } from "../enums";
import { makeImagePath, useWindowDimensions } from "../utiles";
import { BigMovie } from "./BigMovie";

export const SliderTitle = styled.h4`
    text-transform: uppercase;
    font-size: 30px;
    font-weight: 500;
    padding-bottom: 20px;
`

export const SliderWrapper = styled.div`
    padding: 0 60px 40px 60px;
`

export const SliderContainer = styled.div`
    position: relative;
    top: -200px;
    width: 100%;
    overflow-y: hidden;
    -ms-overflow-style: none;
    &::-webkit-scrollbar{
      display:none;
    }
    @media screen and (min-width: 43rem) {
      height: 400px;
    }
    @media screen and (min-width: 62rem) {
      height: 500px;
    }
    @media screen and (min-width: 82rem) {
      height: 600px;
    }
`

export const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    width: 100%;
    position: absolute;
    @media screen and (min-width: 43rem) {
      grid-template-columns: repeat(4,1fr);
    }
    @media screen and (min-width: 62rem) {
      grid-template-columns: repeat(5,1fr);
    }
    @media screen and (min-width: 82rem) {
      grid-template-columns: repeat(6,1fr);
    }
`

export const Box = styled(motion.div)<{ bgphoto: string }>`
    background-color: white;
    height: 470px;
    font-size: 66px;
    background-size: cover;
    background-position: center center;
    background-image: url(${(props) => props.bgphoto});
    position: relative;
    border-radius: 4px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
    @media screen and (min-width: 43rem) {
      height: 200px;
    }
    @media screen and (min-width: 62rem) {
      height: 300px;
    }
    @media screen and (min-width: 82rem) {
      height: 470px;
    }
`

export const HoverBox = styled(motion.div)`
    padding: 70px 40px;
    background-color: rgba(0, 0, 0, 0.8);
    opacity: 0;
    position: relative;
    width: 100%;
    height: 100%;
    @media screen and (min-width: 43rem) {
      padding: 20px 10px;
    }
    @media screen and (min-width: 62rem) {
      padding: 55px 30px;
    }
    @media screen and (min-width: 82rem) {
      padding: 70px 40px;
    }
    h4 {
        line-height: 1.8;
        letter-spacing: -1px;
        color: white;
        text-align: center;
        font-size: 15px;
        font-weight: 500;
        
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 7;
        -webkit-box-orient: vertical;
        @media screen and (min-width: 43rem) {
          -webkit-line-clamp: 3;
        }
        @media screen and (min-width: 62rem) {
          -webkit-line-clamp: 5;
        }
        @media screen and (min-width: 82rem) {
          -webkit-line-clamp: 7;
        }
    }
`

export const HoverDetailBtn = styled(motion.button)`
    position: absolute;
    width: 50%;
    display: flex;
    text-align: center;
    bottom: 40px;
    right: 0;
    left: 0;
    margin: 0 auto;
    justify-content: center;
    font-weight: 600;
    padding: 8px 15px;
    color: white;
    border: 1px solid white;
    border-radius: 5px;
    background: none;
    cursor: pointer;
    &:hover{
      color: rgb(61, 145, 255);
      border: 1px solid rgb(61, 145, 255);
      transition: all 0.2s linear 0s;
    }
        @media screen and (min-width: 43rem) {
          width: 70%;
        }
        @media screen and (min-width: 62rem) {
          width: 60%;
        }
        @media screen and (min-width: 82rem) {
          width: 50%;
        }
`

export const rowVariants = {
  hidden: ({width, clickReverse}:{width:number, clickReverse:boolean})=>({
      x: clickReverse ? -width - 5 : width + 5,
  }),
  visible: {
    x: 0,
  },
  exit: ({width, clickReverse}:{width:number, clickReverse:boolean})=>({
    x: clickReverse ? width + 5 : -width - 5,
}),
};
// user의 화면크기 = window.outerWidth 마지막에 +10 -10은 row끼리의 간격을 잡기위해서이다

export const BoxVariants = {
  normal:{
    scale: 1,
  },
  hover:{
    zIndex: 9,
    scale: 1.05,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
}

// hover에만 transition을 주어야 hover동작시에만 delay가 들어가고 다른 동작에 delay가 걸리지않는다

export const infovariants = {
  hover:{
    opacity: 1,
    trasition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    }
  }
}

export const Before = styled(motion.div)`
    height: 470px;
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    padding: 0 30px;
    background: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    svg{
        width: 20px;
        cursor: pointer;
    }
    @media screen and (min-width: 43rem) {
      height: 200px;
    }
    @media screen and (min-width: 62rem) {
      height: 300px;
    }
    @media screen and (min-width: 82rem) {
      height: 470px;
    }
`

export const Next = styled(motion.div)`
    height: 470px;
    position: absolute;
    right: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    padding: 0 30px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    svg{
        width: 20px;
        cursor: pointer;
    }
    @media screen and (min-width: 43rem) {
      height: 200px;
    }
    @media screen and (min-width: 62rem) {
      height: 300px;
    }
    @media screen and (min-width: 82rem) {
      height: 470px;
    }
`

export const InfoBox = styled.div`
  margin-top: 10px;
`

export const BoxContainer = styled(motion.div)`
    text-align: center;
`

export const InfoTextBox = styled.div`
    margin-top: 5px;
    display: flex;
    flex-direction: column;

    span{
        color: gray;
        font-size: 14px;
    }
`

export const InfoTitle = styled.span`
    color: white;
    font-size: 15px;
    margin-top: 12px;
    font-weight: bold;
    /* 줄임말 설정  */
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`

export const InfoRate = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
`

export function MovieSlider({type}:{type:Types}) {
    const {scrollY} = useScroll()
    const [offset,setOffset] = useState(6);
    useEffect(()=>{
      const resizeHandler = () => {
        if(window.innerWidth > 688){
          setOffset(4)
        }
        if(window.innerWidth > 992){
          setOffset(5)
        }
        if(window.innerWidth > 1312){
          setOffset(6)
        }
      }
      resizeHandler();
    },[window.innerWidth]);
    const { data } = useQuery<IGetMoviesResult>(["movies", type], ()=>getMovies(type))
    const [index, setIndex] = useState(0)
    const [leaving, setLeaving] =useState(false)
    const toggleLeaving = ()=>setLeaving(prev=>!prev)
    const navigate = useNavigate()
    const [clickReverse, setClickReverse] = useState(false)
    const bigMovieMatch = useMatch(`/movies/${type}/:movieId`)

    const nextSlide = ()=>{
      if(data) {
        if(leaving) return;
        setClickReverse(false)
        toggleLeaving()
        const totalMovies = data.results.length - 1
        const maxIndex = Math.floor(totalMovies / offset) - 1
        setIndex(prev => prev === maxIndex ? 0 : prev + 1)
      }
    }
    const prevSlide = ()=>{
        if(data) {
          if(leaving) return;
          setClickReverse(true)
          toggleLeaving()
          const totalMovies = data.results.length - 1
          const maxIndex = Math.floor(totalMovies / offset) - 1
          setIndex(prev => prev === 0 ? maxIndex : prev - 1)
        }
      }
    // data에서 bigMovie로 클릭한 movieid와 동일한 정보를 다 불러온다
    const onBoxClicked = (movieId:number) => {
      navigate(`/movies/${type}/${movieId}`)
    }
    const width = useWindowDimensions();
    // if(leaving) return; 슬라이더 버튼을 눌렀을때 setLeaving(true)가 되어 한번더 누르는걸 방지한다.
    // 또한 <AnimatePresence onExitComplete={()=>setLeaving(false)}>으로 애니메이션(슬라이드)이 끝났을때 초기화
    // <AnimatePresence initial={false} 사용시 페이지 로드시 애니메이션(initial)이 발생되지않는다
    return(
      <>
        <SliderWrapper>
            <SliderContainer>
                <SliderTitle>
                  {type === "popular" && "인기 영화"}
                  {type === "now_playing" && "현재상영중"}
                  {type === "top_rated" && "평점높은 영화"}
                  {type === "upcoming" && "상영 예정"}
                </SliderTitle>
                <AnimatePresence custom={{width, clickReverse}} initial={false} onExitComplete={toggleLeaving}>
                    <Row
                    custom={{width, clickReverse}} 
                    transition={{type:"tween", duration: 1}}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={index}
                    >
                    {data?.results.slice(1).slice(offset*index, offset*index+offset).map((movie, i) =>
                        <BoxContainer
                          variants={BoxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{type:"tween"}}
                        >
                          <Box
                            layoutId={type + movie.id}
                            onClick={()=> onBoxClicked(movie.id)}
                            bgphoto={makeImagePath(movie.poster_path || movie.backdrop_path, "w500")}
                            key={type + movie.id}>
                                <HoverBox variants={infovariants}>
                                  <h4>{movie.overview}</h4>
                                  <HoverDetailBtn>상세정보</HoverDetailBtn>
                                </HoverBox>
                          </Box>
                          <InfoBox>
                              <InfoTitle>{movie.title}</InfoTitle>
                              <InfoTextBox>
                                    <span>개봉일 {movie.release_date}</span>
                                  <InfoRate>
                                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                                  </InfoRate>
                              </InfoTextBox>
                          </InfoBox>
                        </BoxContainer>
                    )}
                    </Row>
                </AnimatePresence>
                <Before onClick={prevSlide}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 512"
                        fill="currentColor"
                    >
                        <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z" />
                    </svg>
                </Before>
                <Next onClick={nextSlide}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 512"
                        fill="currentColor"
                    >
                        <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
                    </svg>
                </Next>
            </SliderContainer>
        </SliderWrapper>
        <AnimatePresence>
        { bigMovieMatch?
                <BigMovie type={type} data={data} scrollY={scrollY.get()}></BigMovie>
        : null }
        </AnimatePresence>
      </>
    )
}

// <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}> 에서 data? || "" data가 들어오지 않으면 빈 string을 반환하도록한다.