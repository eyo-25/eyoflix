import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useMatch } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MovieSearch from "../Components/MovieSearch";
import { TvSearch } from "../Components/TvSearch";
import { Category } from "../enums";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 160px;
`;

export const Title = styled.h1`
    text-align: center;
    color: white;
    font-size: 30px;
    margin-bottom: 30px;
    line-height: 1.6;
    letter-spacing: -1.3px;
`

export const SearchForm = styled.form`
    position: relative;
    margin-bottom: 80px;
`

export const SearchInput = styled.input`
    font-size: 20px;
    border: none;
    outline: none;
    width: 660px;
    padding: 15px 20px;
    background-color: white;
`

export const SearchButton = styled.button`
    border: none;
    outline: none;
    font-size: 20px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    background-color: rgb(227, 9, 20);
    color: white;
    padding: 14px 30px;
    cursor: pointer;
`

export const TabMenu = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0px;
    box-sizing: border-box;
`

export const TabList = styled.div<{isActive:boolean}>`
    display: flex;
    margin: 0px;
    padding: 0px;
    border: 0px;
    vertical-align: baseline;
    a{
        border-bottom: 3px solid ${props=> props.isActive ? "rgb(227, 9, 20)" : "transparent"};
        color: ${props=> props.isActive ? "rgb(227, 9, 20)" : "white"};
        margin: 0px 15px;
        padding: 10px;
        box-sizing: border-box;
        font-size: 17px;
        font-weight: bold;
    }
`

export const ContentsContainer = styled.div`
    padding: 0px 40px;
    margin-top: 30px;
`

export const ContentsWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    max-width: 2400px;
`

export const Content = styled.div`
    width: 220px;
    border-radius: 7px;
    margin-right: 20px;
    margin-bottom: 45px;
`

export const ContentImg = styled.div`
    background: url(https://image.tmdb.org/t/p/w300/bZLrpWM065h5bu1msUcPmLFsHBe.jpg) center center / cover no-repeat;
    height: 340px;
    transition: all 0.2s linear 0s;
    border-radius: 7px;
`

export const ContentInfoBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const ContentTitle = styled.span`
    color: white;
    font-size: 15px;
    margin-top: 12px;
    font-weight: bold;
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

interface IForm {
    keyword: string;
}

function Search() {
    const searchMach = useMatch(`/search/movies`)
    const searchTvsMach = useMatch(`/search/tvs`)
    const keywordMach = useMatch(`/search/movies/:keyword`)
    const keywordTvsMach = useMatch(`/search/tvs/:keyword`)

    const location = useLocation();
    const srcParams = new URLSearchParams(location.search);
    const [keyword, setKeyword] = useState("")
    const [search, setSearch] = useState(false)
    const { register, handleSubmit } = useForm<IForm>()
    const navigate = useNavigate();
    const onValid = (data:IForm) => {
        setKeyword(data.keyword)
        setSearch(true)
        searchMach || keywordMach ? (
            navigate(`/search/movies/${data.keyword}`)
        ) : (
            navigate(`/search//${data.keyword}`)
        )
    }
    console.log(keyword)

    return (
        <>
            <Container>
                <Title>
                수백만 편의 영화, TV 프로그램이 있습니다.<br/>지금 바로 검색해보세요.
                </Title>
                <SearchForm onSubmit={handleSubmit(onValid)}>
                    <SearchInput
                        {...register("keyword",{required:true, minLength: 2})}
                        placeholder="영화 또는 TV 프로그램을 검색하세요."
                    />
                    <SearchButton>검색</SearchButton>
                </SearchForm>
                <TabMenu>
                    <TabList isActive={searchMach !== null || keywordMach !== null }>
                        <Link to={'/search/movies'}>영화</Link>
                    </TabList>
                    <TabList isActive={searchTvsMach !== null || keywordTvsMach !== null }>
                        <Link to={'/search/tvs'}>TV 프로그램</Link>
                    </TabList>
                </TabMenu>
                <ContentsContainer>
                    <ContentsWrapper>
                        {search ?
                            <MovieSearch keyword={keyword}></MovieSearch>
                        : null}
                    </ContentsWrapper>
                </ContentsContainer>
            </Container>
        </>
    )
}

export default Search;