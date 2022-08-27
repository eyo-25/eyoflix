import { useQuery } from "@tanstack/react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { getTvShowDetail, IGetTvShowsDetail, ITvShowsResult } from "../api";
import { TvTypes } from "../enums";
import { makeImagePath } from "../utiles";
import { BigBox, BigCover, BigOverview, BigTitle, Gengre, Overlay, Rank, TitleInfo, TitleInfoBox } from "./BigMovie";

export function BigTv ({type, data, scrollY}:{type:TvTypes, data:ITvShowsResult|undefined, scrollY:number}) {
    const bigTvShowMatch = useMatch(`/tvs/${type}/:tvId`)
    const navigate = useNavigate()
    const onOverlayClicked = () => {
        navigate(`/tvs`)
      }
    const clickedTvshow = bigTvShowMatch?.params.tvId && data?.results.find(movie => movie.id + "" === bigTvShowMatch?.params.tvId)
    const {data:detailData, isLoading:detailLoding} = useQuery<IGetTvShowsDetail>([bigTvShowMatch?.params.tvId, "detail"], ()=>getTvShowDetail(bigTvShowMatch?.params.tvId))
    console.log(detailData)
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
                                    url(${makeImagePath(clickedTvshow.backdrop_path || clickedTvshow.poster_path,"w500")})
                                    `
                                }}
                            >
                            <BigTitle>
                                <h5>{clickedTvshow.name}</h5>
                                <p>{detailData?.tagline}</p>
                                <TitleInfo>
                                  <span> {clickedTvshow.original_language}</span>
                                  <p>{clickedTvshow?.first_air_date}</p>
                                </TitleInfo>
                                <TitleInfoBox>
                                  <Rank>★ {clickedTvshow?.vote_average}</Rank>
                                  {detailData?.genres.map((genres)=><Gengre>#{genres.name}</Gengre>)}
                                </TitleInfoBox>
                            </BigTitle>
                            </BigCover>
                            {clickedTvshow.overview !== "" ? 
                                <BigOverview>
                                  <h4>줄거리</h4>
                                  <p>{clickedTvshow.overview}</p>
                                </BigOverview>
                              : null
                            }
                        </>}
                    </BigBox>
                </>
            : null}
        </>
    )
}