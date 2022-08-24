import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion"
import { useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom"
import { getSearchResult, IGetMoviesResult, ITvShowsResult } from "../api";
import { Before, BigCover, BigMovie, BigOverview, BigTitle, Box, BoxVariants, Info, infovariants, Next, Overlay, Row, rowVariants, SliderTitle } from "../Components/Slider"
import { makeImagePath, useWindowDimensions } from "../utiles";
import { SliderContainer, SliderWrapper, TemplateBox } from "./MovieSearch";

const offset = 6;

export function TvSearch({ keyword }:{ keyword:string|null }) {
    const { data:firstdata } = useQuery<ITvShowsResult>(["searchtvshow", 1], ()=>getSearchResult({category: "tv", keyword: keyword, page:1}))

    return(
      <>

      </>
    )
}