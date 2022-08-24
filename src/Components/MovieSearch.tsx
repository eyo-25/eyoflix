import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion"
import { useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getMovieDetail, getSearchResult, IGetMovieDetail, IGetMoviesDetail, IGetMoviesResult } from "../api";
import { Before, BigBottom, BigCover, BigGenres, BigLang, BigMovie, BigOverview, BigTitle, Box, BoxVariants, Info, infovariants, Next, Overlay, Row, rowVariants, SliderTitle } from "../Components/Slider"
import { Loader } from "../Routes/Home";
import { Content, ContentImg, ContentInfo, ContentInfoBox, ContentRate, ContentTitle } from "../Routes/Search";
import { makeImagePath, useWindowDimensions } from "../utiles";

const offset = 6;

export const SliderWrapper = styled.div`
    display: flex;
    height:600px;
    width: 100%;
    padding: 20px 60px;
    position: relative;
`

export const TemplateBox = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    width: 100%;
    position: absolute;
`;

export const SliderContainer = styled.div`
    position: relative;
    height: 300px;
    margin-bottom: 20px;
    width: 100%;
    overflow-y: hidden;
    -ms-overflow-style: none;
    &::-webkit-scrollbar{
      display:none;
    }
`


function MovieSearch({ keyword }:{ keyword:string|null }) {
    const { data:dataFirst, isLoading: isLoadingfirst } = useQuery<IGetMoviesDetail>(["searchMovie", 1],()=>getSearchResult({
      category: "movie",
      keyword: keyword,
      page:1
    }))
    const { data: dataSecond, isLoading: isLoadingSecond } =
    useQuery<IGetMoviesResult>(["search: " + keyword + "movie", 2], () =>
      getSearchResult({
        category: "movie",
        keyword: keyword,
        page: 2,
      })
    );
    const noData = dataFirst?.total_pages!! < 1;

    console.log(dataFirst)

    return(
      noData ? null : (
        <>
          {dataFirst?.results.map((movie)=>
              <Content key={movie.id+""}>
                  <ContentImg/>
                  <ContentInfoBox>
                      <ContentTitle>{movie.title}</ContentTitle>
                      <ContentInfo>
                          <span>개봉일 {movie.release_date}</span>
                          <ContentRate>
                              <span>⭐ {movie.vote_average.toFixed(1)}</span>
                          </ContentRate>
                      </ContentInfo>
                  </ContentInfoBox>
              </Content>
          )}
        </>
      )
    )
}

export default MovieSearch;