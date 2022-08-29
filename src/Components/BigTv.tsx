import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { getCredits, getTvShowDetail, ICredits, IGetTvShowsDetail, ITvShowsResult } from "../api";
import { TvTypes } from "../enums";
import { makeImagePath } from "../utiles";
import { BigBox, BigCover, BigInfo, BigOverview, BigTitle, CastBox, CastImg, CastImgBox, CastName, CastTitle, Gengre, Overlay, Rank, TitleInfo, TitleInfoBox } from "./BigMovie";

export function BigTv ({type, data, scrollY}:{type:TvTypes, data:ITvShowsResult|undefined, scrollY:number}) {
    const bigTvShowMatch = useMatch(`/tvs/${type}/:tvId`)
    const navigate = useNavigate()
    const onOverlayClicked = () => {
        navigate(`/tvs`)
      }
    const clickedTvshow = bigTvShowMatch?.params.tvId && data?.results.find(movie => movie.id + "" === bigTvShowMatch?.params.tvId)
    const {data:detailData, isLoading:detailLoding} = useQuery<IGetTvShowsDetail>([bigTvShowMatch?.params.tvId, "detail"],
    ()=>getTvShowDetail(bigTvShowMatch?.params.tvId), { enabled: !!bigTvShowMatch?.params.tvId})
    const {data:creditData, isLoading:creditLoding} = useQuery<ICredits>([bigTvShowMatch?.params.tvId, "credit"],
    ()=>getCredits({category:"tv", id:bigTvShowMatch?.params.tvId}),{ enabled: !!bigTvShowMatch?.params.tvId})
    const [index, setIndex] = useState(0)
    const offset = 5;
    return(
        <>
            { bigTvShowMatch ?
                <>
                    <Overlay
                        onClick={onOverlayClicked}
                        exit={{opacity: 0}}
                        animate={{opacity: 1}}>
                    </Overlay>
                    <BigBox
                        layoutId={type + bigTvShowMatch.params.tvId}
                        style={{ top: scrollY + 100 }}
                    >
                        {clickedTvshow && <>
                            <BigCover
                            style={{
                                backgroundImage:
                                    `
                                    linear-gradient(to top, rgba(0, 0, 0, 1) , rgba(0, 0, 0, 0)),
                                    linear-gradient(to right, rgba(0, 0, 0, 0.9), 50% , rgba(0, 0, 0, 0)),
                                    url(${makeImagePath(clickedTvshow.backdrop_path || clickedTvshow.poster_path)})
                                    `
                                }}
                            >
                            <BigTitle>
                                <h5>{clickedTvshow.name}</h5>
                                {detailData?.tagline !== ""? (
                                    <p>{detailData?.tagline}</p>
                                ) :null}
                                <TitleInfo>
                                  <span> {clickedTvshow.original_language}</span>
                                  <p>{clickedTvshow?.first_air_date}</p>
                                </TitleInfo>
                                <TitleInfoBox>
                                  <Rank>★ {clickedTvshow?.vote_average}</Rank>
                                  {detailData?.genres.map((genres)=><Gengre key={genres.id}>#{genres.name}</Gengre>)}
                                </TitleInfoBox>
                            </BigTitle>
                            </BigCover>

                            <BigInfo>
                                {clickedTvshow.overview !== "" ? 
                                    <BigOverview>
                                      <h4>줄거리</h4>
                                      <p>{clickedTvshow.overview}</p>
                                    </BigOverview>
                                  : null
                                }
                                {creditData? (
                                    <>
                                      <CastTitle>
                                        주요 출연진
                                      </CastTitle>
                                      <CastBox>
                                        {creditData?.cast.slice(offset*index, offset*index+offset).map((cast)=>
                                          <CastImgBox key={cast.id}>
                                              <CastImg bgphoto={makeImagePath(cast.profile_path + "", "w200" || cast.profile_path + "w500")}/>
                                              <CastName>
                                                <span>{cast.name}</span>
                                                <p>{cast.character}</p>
                                              </CastName>
                                          </CastImgBox>
                                        )}
                                      </CastBox>
                                    </>
                                  ) :null}
                            </BigInfo>
                        </>}
                    </BigBox>
                </>
            : null}
        </>
    )
}