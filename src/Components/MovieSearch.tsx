import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components"
import { getSearchResult, IGetMoviesDetail } from "../api";
import { makeImagePath } from "../utiles";
import Loader from "./Loader";

export const Content = styled(motion.div)`
    width: 220px;
    border-radius: 7px;
    margin-right: 20px;
    margin-bottom: 45px;
`

export const Cover = styled(motion.div)`
    height: 340px;
    width: 220px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
`

export const DetailBtn = styled(motion.button)`
    font-weight: 600;
    padding: 8px 20px;
    position: absolute;
    bottom: 20px;
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
`

export const ContentImg = styled(motion.div)<{ bgphoto: string }>`
    background: url(${props=>props.bgphoto}) center center / cover no-repeat;
    height: 340px;
    transition: all 0.2s linear 0s;
    border-radius: 6px;
    cursor: pointer;
`

export const ContentInfoBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
`

export const ContentTitle = styled.span`
    color: white;
    font-size: 15px;
    margin-top: 12px;
    font-weight: bold;
    /* 줄임말 설정  */
    width: 180px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`
export const ContentInfo = styled.div`
    margin-top: 11px;
    display: flex;
    flex-direction: column;

    span{
        color: gray;
        font-size: 14px;
        margin-right: 10px;
    }
`

export const ContentRate = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
`

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

export const BoxVariants = {
  normal:{
    scale: 1,
  },
  hover:{
    zIndex: 20,
    scale: 1.05,
    transition: {
      duration: 0.3
    }
  }
}

export const CoverVariants = {
  normal:{
    opacity: 0
  },
  hover:{
    opacity: 1
  }
}

function MovieSearch() {
    let params = useParams();
    let keyword = params.keyword
    const navigate = useNavigate()
    const { data:dataFirst, isLoading: isLoadingfirst } = useQuery<IGetMoviesDetail>(["searchMovie", 1],()=>getSearchResult({
      category: "movie",
      keyword: keyword + "",
      page:1
    }),
    {refetchInterval: 1000}
    )
    const contentClick = (movieId:number)=>{
      navigate(`/search/movies/${keyword}/${movieId}`)
    }

    const noData = dataFirst?.total_pages!! < 1;

    return(
      noData ? <Loader>Now Loading...</Loader> : (
        <>
          {dataFirst?.results.map((movie)=>
              <Content
                onClick={()=>contentClick(movie.id)}
                variants={BoxVariants}
                initial="normal"
                whileHover="hover"
                transition={{type:"tween"}}
                key={movie.id + ""}
              >
                  <ContentImg bgphoto={ makeImagePath(movie.poster_path, "w500" || movie.backdrop_path)}>
                    <Cover variants={CoverVariants} initial="normal" whileHover="hover">
                      <DetailBtn>상세정보</DetailBtn>
                    </Cover>
                  </ContentImg>
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