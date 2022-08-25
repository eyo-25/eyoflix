import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSearchResult, IGetTvShowsDetail } from "../api";
import { makeImagePath } from "../utiles";
import { BoxVariants, Content, ContentImg, ContentInfo, ContentInfoBox, ContentRate, ContentTitle, Cover, CoverVariants, DetailBtn } from "./MovieSearch";

function TvShowSearch() {
    let keyword = useParams();
    const { data, isLoading } = useQuery<IGetTvShowsDetail>(["searchTvShow", 1],()=>getSearchResult({
      category: "tv",
      keyword: keyword.keyword + "",
      page:1
    }),
    {refetchInterval: 1000}
    )

    const noData = data?.total_pages!! < 1;

    console.log(keyword)

    return(
      noData ? null : (
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
                      <Cover variants={CoverVariants} initial="normal" whileHover="hover">
                        <DetailBtn>상세정보</DetailBtn>
                      </Cover>
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