import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSearchResult, ITvShowsResult } from "../../Api/api";
import { makeImagePath } from "../../Api/utiles";
import { BoxVariants, Content, ContentImg, ContentInfo, ContentInfoBox, ContentRate, ContentTitle, NoSearch} from "./MovieSearch";

function TvShowSearch() {
  let params = useParams();
  let keyword = params.keyword
    const { data } = useQuery<ITvShowsResult>(["searchTvShow", 1],()=>getSearchResult({
      category: "tv",
      keyword: keyword + "",
      page:1
    }),
    {refetchInterval: 1000}
    )

    const noData = data?.total_pages!! < 1;

    return(
      noData ? ( 
        <NoSearch>
          <span>' {keyword} '</span> 에 대한 검색결과가 없습니다.
          <p>영문이나 보다 일반적인 검색어를 입력해주세요</p>
        </NoSearch>
      ) : (
        <>
          {data?.results.map((tvshow)=>
              <Content
                variants={BoxVariants}
                initial="normal"
                whileHover="hover"
                transition={{type:"tween"}}
                key={tvshow.id + ""}
              >
                  <ContentImg bgphoto={ makeImagePath(tvshow.poster_path, "w500" || tvshow.backdrop_path)}>
                  </ContentImg>
                  <ContentInfoBox>
                      <ContentTitle>{tvshow.name}</ContentTitle>
                      <ContentInfo>
                          <span>개봉일 {tvshow.first_air_date}</span>
                          <ContentRate>
                              <span>⭐ {tvshow.vote_average.toFixed(1)}</span>
                          </ContentRate>
                      </ContentInfo>
                  </ContentInfoBox>
              </Content>
          )}
        </>
      )
    )
}

export default TvShowSearch;