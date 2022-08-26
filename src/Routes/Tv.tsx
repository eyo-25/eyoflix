import { useQuery } from "@tanstack/react-query";
import { getTvShows, ITvShowsResult } from "../api";
import Loader from "../Components/Loader";
import { TvSlider } from "../Components/TvSlide";
import { TvTypes} from "../enums";
import { makeImagePath } from "../utiles";
import { Banner, Overview, Title, Wrapper } from "./Home";

export function Tv() {
  const { isLoading, data } = useQuery<ITvShowsResult>(["tvshow", "airingtoday"], ()=>getTvShows(TvTypes.on_the_air))
    console.log(data)
    return(
      <>
        <Wrapper>
          { isLoading ? (
            <Loader>Now Loading...</Loader>
          ) : (
              <>
                <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].name}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
                <TvSlider type={TvTypes.popular}/>
                <TvSlider type={TvTypes.airing_today}/> 
                <TvSlider type={TvTypes.on_the_air}/>
                <TvSlider type={TvTypes.top_rated}/>
              </>
          )}
        </Wrapper>
      </>
    )
}