import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { useState } from "react"
import { useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getCredits, getMovieDetail, ICredits, IGetMovieDetail, IGetMoviesResult } from "../../Api/api"
import { Types } from "../../enums"
import { makeImagePath } from "../../Api/utiles"

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 11;
`

export const BigBox = styled(motion.div)`
  position: absolute;
  width: 640px;
  height: 75vh;
  left: 0;
  right: 0;
  margin:0 auto;
  background-color:${props => props.theme.black.darker};
  border-radius: 10px;
  z-index: 12;
  overflow-y: scroll;
`

export const BigCover = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center center;
  position: relative;
`

export const BigTitle = styled.div`
  padding: 30px;
  position: absolute;
  bottom: 0;
  h5 {
    margin-bottom: 8px;
    font-weight: 600;
    color: ${(props) => props.theme.white.lighter};
    letter-spacing: -.5px;
    font-size: 1.25rem;
    @media (min-width: 688px){
      font-size: 1.3rem;
    }
    @media (min-width: 992px){
      font-size: 1.6rem;
    }
    @media (min-width: 1312px){
      font-size: 2em;
    }
  }
  p {
    letter-spacing: -.5px;
    margin-bottom: 15px;
    font-weight: 400;
  }
`

export const TitleInfo = styled.div`
  display: flex;
  color: rgb(229, 229, 229);
  margin-bottom: 5px;
  span {
    text-transform: uppercase;
    margin-right: 10px;
  }
  p {
    font-size: 16px;
    font-weight: 300;
  }
`

export const TitleInfoBox = styled.div`
  display: flex;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 33px;
    border-radius: 4px;
    padding: 0 8px;
    margin-right: 5px;
    cursor: pointer;
  }
`

export const Rank = styled.div`
  background-color: rgba(87, 87, 87, 0.3);
  border: 1px solid rgba(87, 87, 87, 0.2);
`

export const Gengre = styled.div`
  font-size: 13px;
  font-weight: 500;
  box-sizing: border-box;
  color: rgb(254, 211, 48);
  border: 1px solid rgb(254, 211, 48);
  &:hover{
    color: rgb(255, 255, 255);
    background-color: rgb(254, 211, 48);
    border: rgb(254, 211, 48);
  }
`

export const BigInfo = styled.div`
  padding: 30px;
`

export const BigOverview = styled.div`
  font-size: 20px;
  position: relative;
  line-height: 1.6;
  margin-bottom: 30px;
  color: ${(props) => props.theme.white.lighter};
  h4{
    font-size: 18px;
    margin-bottom: 8px;
    font-weight: 500;
  }
  p {
    font-size: 14px;
    color: rgb(229, 229, 229);
  }
`

export const CastTitle = styled.div`
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: 500;
`

export const CastBox = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
`

export const CastImgBox = styled.div`

`

export const CastImg = styled.div<{ bgphoto: string }>`
  background: url(${props=>props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 160px;
  margin-bottom: 8px;
`

export const CastName = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  span{
    margin-bottom: 3px;
    font-weight: 400;
  }
  p{
    font-size: 13px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.5);
  }
`

export function BigMovie ({type, scrollY}:{type:Types, data:IGetMoviesResult|undefined, scrollY:number}){
    const bigMovieMatch = useMatch(`/movies/${type}/:movieId`)
    const {data:detailData, isLoading:detailLoding} = useQuery<IGetMovieDetail>([bigMovieMatch?.params.movieId, "detail"],
    ()=>getMovieDetail(bigMovieMatch?.params.movieId),{ enabled: !!bigMovieMatch?.params.movieId })
    const {data:creditData, isLoading:creditLoding} = useQuery<ICredits>([bigMovieMatch?.params.movieId, "credit"],
    ()=>getCredits({category:"movie",id:bigMovieMatch?.params.movieId}),{ enabled: !!bigMovieMatch?.params.movieId })
    //enabled: !!옵션값 옵션값이 ture이면 실행하는 동기적 처리
    const navigate = useNavigate()
    const onOverlayClicked = () => {
        navigate(-1)
      }
    const [index, setIndex] = useState(0)
    const offset = 5;
    return(
        <>
            { bigMovieMatch ?
                <>
                    <Overlay
                        onClick={onOverlayClicked}
                        exit={{opacity: 0}}
                        animate={{opacity: 1}}>
                    </Overlay>
                    <BigBox
                        layoutId={type + bigMovieMatch.params.movieId}
                        style={{ top: scrollY + 100 }}
                    >
                        {detailData && <>
                            <BigCover
                            style={{
                                backgroundImage:
                                    `
                                    linear-gradient(to top, rgba(0, 0, 0, 1) , rgba(0, 0, 0, 0)),
                                    linear-gradient(to right, rgba(0, 0, 0, 0.8), 50% , rgba(0, 0, 0, 0)),
                                    url(${makeImagePath(detailData.backdrop_path || detailData.poster_path,"w500")})
                                    `
                                }}
                            >
                              <BigTitle>
                                  <h5>{detailData.title}</h5>
                                  {detailData?.tagline !== ""? (
                                    <p>{detailData?.tagline}</p>
                                  ) :null}
                                  <TitleInfo>
                                    <span> {detailData.original_language}</span>
                                    <p>{detailData?.release_date}</p>
                                  </TitleInfo>
                                  <TitleInfoBox>
                                    <Rank>★ {detailData?.vote_average.toFixed(1)}</Rank>
                                    {detailData?.genres.map((genres)=><Gengre key={genres.id}>#{genres.name}</Gengre>)}
                                  </TitleInfoBox>
                              </BigTitle>
                            </BigCover>
                            <BigInfo>
                                  {detailData.overview !== "" ? 
                                      <BigOverview>
                                        <h4>줄거리</h4>
                                        <p>{detailData.overview}</p>
                                      </BigOverview>
                                    : null
                                  }
                                  {creditData ? (
                                    <>
                                      <CastTitle>
                                        주요 출연진
                                      </CastTitle>
                                      <CastBox>
                                        {creditData?.cast.slice(offset*index, offset*index+offset).map((cast)=>
                                          <CastImgBox key={cast.id}>
                                              {cast.profile_path ? (
                                                <>
                                                    <CastImg bgphoto={makeImagePath(cast.profile_path + "", "w200" || cast.profile_path + "w500")}/>
                                                    <CastName>
                                                      <span>{cast.name}</span>
                                                      <p>{cast.character}</p>
                                                    </CastName>
                                                </>
                                              ) : null}
                                          </CastImgBox>
                                        )}
                                      </CastBox>
                                    </>
                                  ) :null}
                            </BigInfo>
                        </>}
                    </BigBox>
                </>
            : null }
        </>
    )
}