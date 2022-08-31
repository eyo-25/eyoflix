import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { getTvShows, ITvShowsResult } from "../../Api/api";
import { makeImagePath } from "../../Api/utiles";
import { TvTypes } from "../../enums";
import { BigTv } from "../Modal/BigTv";
import { Before, Box, BoxContainer, BoxVariants, HoverBox, HoverDetailBtn, HoverOverView, HoverVariants, InfoBox, InfoRate, InfoTextBox, InfoTitle, Next, Row, rowVariants, SliderContainer, SliderTitle, SliderWrapper } from "./Slider";

export function TvSlider({type}:{type:TvTypes}) {

    const [offset, setOffset] = useState(6);

    useEffect(()=>{
      const handleResize = () => {
        if(window.innerWidth <= 688){
          setOffset(3);
        }
        if(window.innerWidth > 688){
          setOffset(4);
        }
        if(window.innerWidth > 992){
          setOffset(5);
        }
        if(window.innerWidth > 1312){
          setOffset(6);
        }
      }
      handleResize();
      window.addEventListener('resize', handleResize)
      return()=>{
        window.removeEventListener('resize', handleResize)
      }
    },[]);

    const { data } = useQuery<ITvShowsResult>(["TvShows", type], ()=>getTvShows(type))
    const bigTvShowMatch = useMatch(`/tvs/${type}/:tvId`)
    const [index, setIndex] = useState(0)
    const [leaving, setLeaving] =useState(false)
    const toggleLeaving = ()=>setLeaving(prev=>!prev)
    const navigate = useNavigate()
    const [clickReverse, setClickReverse] = useState(false)
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
    const onBoxClicked = (tvId:number) => {
      navigate(`/tvs/${type}/${tvId}`)
      document.body.classList.add("stop-scroll")
    }
    const {scrollY} = useScroll()

    return(
      <>
        <SliderWrapper>
            <SliderContainer>
                <SliderTitle>
                  {type === "airing_today" && "오늘 방영하는 프로그램"}
                  {type === "on_the_air" && "현재 방영중"}
                  {type === "popular" && "인기 프로그램"}
                  {type === "top_rated" && "평점높은 프로그램"}
                </SliderTitle>
                <AnimatePresence custom={{clickReverse}} initial={false} onExitComplete={toggleLeaving}>
                    <Row
                    custom={{clickReverse}} 
                    transition={{type:"tween", duration: 1}}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={index}
                    >
                    {data?.results.slice(1).slice(offset*index, offset*index+offset).map((tv, i) =>
                        <BoxContainer
                          key={type + tv.id + ""}
                          variants={BoxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{type:"tween"}}
                        >
                          <Box
                          layoutId={type + tv.id}
                          onClick={()=> onBoxClicked(tv.id)}
                          transition={{type:"tween"}}
                          bgphoto={makeImagePath(tv.poster_path || tv.backdrop_path, "w500")}
                          key={type + tv.id}>
                                <HoverBox
                                  variants={HoverVariants}
                                  whileHover="hover"
                                >
                                  <HoverOverView>{tv.overview}</HoverOverView>
                                  <HoverDetailBtn>상세정보</HoverDetailBtn>
                                </HoverBox>
                          </Box>
                          <InfoBox>
                              <InfoTitle>{tv.name}</InfoTitle>
                              <InfoTextBox>
                                    <span>개봉일 {tv.first_air_date}</span>
                                  <InfoRate>
                                    <span>⭐ {tv.vote_average.toFixed(1)}</span>
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
        <AnimatePresence
          onExitComplete={()=>document.body.classList.remove("stop-scroll")}
        >
        { bigTvShowMatch?
            <BigTv type={type} data={data} scrollY={scrollY.get()}></BigTv>
                : null }
        </AnimatePresence>
      </>
    )
}