import styled from "styled-components"
import { motion, useAnimation, useScroll } from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 14px;
  padding: 20px 40px;
  z-index: 100;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 50px;
  width:115px;
  height: 45px;
  cursor: pointer;
  path {
    stroke: white;
    stroke-width: 2;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li<{isActive:boolean}>`
  margin-left: 40px;
  color: ${(props) => props.isActive ? "rgba(227, 9, 20,1)" :props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    scale: 1.2;
    transition: scale 0.3s linear;
  }
  a {
    font-weight: 600;
    font-size: 17px;
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

const navVariants = {
    up: {
        backgroundColor: "rgba(0,0,0,0)",
        backdropFilter: "blur(0px)"
    },
    scroll: {
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(3px)"
    },
}

const logoVariants = {
  normal:{
    fill:"rgba(227, 9, 20,1)",
    pathLength:0
  },
  end:{
    fill:["rgba(255,255,255,0)","rgba(227, 9, 20,1)"],
    pathLength:[0,1],
    transition:{
      duration: 3,
      type:"linear"
    }
  },
  active:{
    fillOpacity:[1,0,1],
    transition:{
      repeat:Infinity,
      duration: 1.2,
    }
  }
};

interface IForm {
  keyword: string;
}

export function Header() {
    const tvMatch = useMatch("/tvs")
    const homeMatch = useMatch("/")
    const searchMach = useMatch(`/search`)
    const searchKeywordMach = useMatch(`/search/:keyword`)
    const movieIdMatch = useMatch(`/movies/:types/:movieId`)
    const tvIdMatch = useMatch(`/tvs/:types/:movieId`)
    const { scrollY } = useScroll()
    //scrollY 유저가 스크롤한 양  scrollYProgress는 0~1까지의 전체에서 현재페이지의 퍼센트다
    const navAnimation = useAnimation();

    useEffect(()=>{
      scrollY.onChange(()=>{
        if(scrollY.get() > 60){
          navAnimation.start("scroll")
        }else{
          navAnimation.start("up")
        }
      })
    })

    const navigate = useNavigate()
    const logoClicked = ()=>{navigate(`/`)}

    let keyword = useParams();
    console.log(keyword)
    
    return (
        <Nav variants={navVariants} animate={navAnimation}>
            <Col>
                <Logo
                    onClick={logoClicked}
                    xmlns="http://www.w3.org/2000/svg"
                    width="1024"
                    height="276.742"
                    viewBox="0 0 1024 276.742"
                >
                  <motion.path
                    variants={logoVariants}
                    initial="normal"
                    animate="end"
                    whileHover="active"
                    d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
                  />
                </Logo>
              </Col>
              <Col>
                <Items>
                    <Item isActive={homeMatch !== null || movieIdMatch !== null }>
                        <Link to={'/'}>영화{homeMatch || movieIdMatch ? <Circle layoutId="circle"/>: null}</Link>
                    </Item>
                    <Item isActive={tvMatch !== null || tvIdMatch !== null }>
                      <Link to={'/tvs'}>TV{tvMatch || tvIdMatch ? <Circle layoutId="circle"/>: null}</Link>
                    </Item>
                    <Item isActive={searchMach !== null || searchKeywordMach !== null }>
                      <Link to={'/search/movies'}>검색{searchMach || searchKeywordMach ? <Circle layoutId="circle"/>: null}</Link>
                    </Item>
                </Items>
            </Col>
        </Nav>
    )
}