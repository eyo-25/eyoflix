import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getMovieDetail, IGetMovieDetail, IGetMoviesResult } from "../api"
import { Types } from "../enums"
import { makeImagePath } from "../utiles"

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
  width: 600px;
  height: 70vh;
  left: 0;
  right: 0;
  margin:0 auto;
  background-color:${props => props.theme.black.darker};
  border-radius: 10px;
  overflow: hidden;
  z-index: 12;
`

export const BigCover = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center center;
  position: relative;
`

export const BigTitle = styled.div`
  padding: 25px 30px;
  position: absolute;
  bottom: 0;
  h5 {
    margin-bottom: 8px;
    font-weight: 600;
    color: ${(props) => props.theme.white.lighter};
    letter-spacing: -.5px;
    font-size: 1.25rem;
    @media screen and (min-width: 43rem) {
      font-size: 1.3rem;
    }
    @media screen and (min-width: 62rem) {
      font-size: 1.6rem;
    }
    @media screen and (min-width: 82rem) {
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
`

export const BigOverview = styled.p`
  font-size: 20px;
  position: relative;
  line-height: 1.6;
  padding: 30px;
  color: ${(props) => props.theme.white.lighter};
  h4{
    font-size: 18px;
    margin-bottom: 6px;
    font-weight: 500;
  }
  p {
    font-size: 14px;
  }
`

export function BigMovie ({type, data, scrollY}:{type:Types, data:IGetMoviesResult|undefined, scrollY:number}){
    const bigMovieMatch = useMatch(`/movies/${type}/:movieId`)
    const {data:detailData, isLoading:detailLoding} = useQuery<IGetMovieDetail>([bigMovieMatch?.params.movieId, "detail"], ()=>getMovieDetail(bigMovieMatch?.params.movieId))
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => movie.id + "" === bigMovieMatch?.params.movieId)
    const navigate = useNavigate()
    const onOverlayClicked = () => {
        navigate(-1)
      }
      console.log(detailData)
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
                        {clickedMovie && <>
                            <BigCover
                            style={{
                                backgroundImage:
                                    `
                                    linear-gradient(to top, rgba(0, 0, 0, 1) , rgba(0, 0, 0, 0)),
                                    linear-gradient(to right, rgba(0, 0, 0, 0.8), 50% , rgba(0, 0, 0, 0)),
                                    url(${makeImagePath(clickedMovie.backdrop_path || clickedMovie.poster_path,"w500")})
                                    `
                                }}
                            >
                            <BigTitle>
                                <h5>{clickedMovie.title}</h5>
                                <p>{detailData?.tagline}</p>
                                <TitleInfo>
                                  <span> {clickedMovie.original_language}</span>
                                  <p>{clickedMovie?.release_date}</p>
                                </TitleInfo>
                                <TitleInfoBox>
                                  <Rank>★ {clickedMovie?.vote_average}</Rank>
                                  {detailData?.genres.map((genres)=><Gengre>#{genres.name}</Gengre>)}
                                </TitleInfoBox>
                            </BigTitle>
                            </BigCover>
                            {clickedMovie.overview !== "" ? 
                                <BigOverview>
                                  <h4>줄거리</h4>
                                  <p>{clickedMovie.overview}</p>
                                </BigOverview>
                              : null
                            }
                        </>}
                    </BigBox>
                </>
            : null }
        </>
    )
}