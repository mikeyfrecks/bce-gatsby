import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import "../../global-styles/global-styles.scss";
import { Fragment, useState, useRef, useEffect } from "react";
import Svg from "../SVG"
import GridLines from "../GridLines";
import {
    mainContentContainer ,
    spinner,
    navOpener,
    showMenu,
    scrim,
    nav,
    lockup,
    title,
    topLogo,
    topTagline,
    navItems, 
    navItem,
    active,
    footer,
    inner,
    contactFooter,
    mainLogo,
    logoText,
    copyright
} from "./styles.module.scss"
import {
    beforeBlock,
    afterBlock,
    middleCenter,
    fontSans,
    contentCenterer

} from "../../global-styles/utilities.module.scss"

export default function Layout({pageTitle, headerMeta, children, activeMenu}) {
    const data = useStaticQuery(
        graphql`
          query {
            wp {
                allSettings {
                  generalSettingsDescription
                  generalSettingsTitle
                }
              }
              wpMenu(name: {eq: "Main Menu"}) {
                menuItems {
                  nodes {
                    url
                    label
                    id
                  }
                }
              }
          }
        `
    )
    function hamburgerClick(e) {
    
        changeOpenState(!menuOpen);
    }
    const [menuOpen, changeOpenState] = useState(false);
    const theTitle = data.wp.allSettings.generalSettingsTitle,
          desc = data.wp.allSettings.generalSettingsDescription

    const headerCheck = useRef(null);
    const [hideHeader, updateHeaderState] = useState(false);
    const [favIconColor, updateFaviconColor] = useState("black");
    
    useEffect(()=>{
        const colors = ["red", "green", "blue", "purple","orange","bubblegum","brown","black"];
        
        let newColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.style.color = newColor;
        updateFaviconColor(newColor);
        const observer = new IntersectionObserver(function(changes){
            if(changes[0].isIntersecting) {
                updateHeaderState(false)
             
              } else {
                updateHeaderState(true)
            }
        })
        observer.observe(headerCheck.current);
        return () => {
            observer.disconnect();
        }
    },[updateFaviconColor])
  
    return (
        <Fragment>
        <Helmet>
            <title>{(!pageTitle)? theTitle : `${pageTitle} - ${theTitle}`}</title>
            <meta name="description" content={desc} />
            <link rel="icon" href={`data:image/svg+xml;utf8,%3Csvg id='FavLogo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cstyle%3E%23FavLogo %7Bfill: white;stroke:${favIconColor};%7D%3C/style%3E%3Ccircle cx='16' cy='16' r='15.5'/%3E%3Ccircle cx='16' cy='16' r='10.5' stroke-dasharray='3.5,2.5'/%3E%3C/svg%3E`} />
        </Helmet>
        <div id="header-test"></div>
        <header id="top-header" role="presentation"  className={`${(menuOpen)?showMenu :""}`}>
            <div className={mainLogo}>
                <a  aria-label={theTitle} href="/" className={`${spinner} ${beforeBlock}`}><span style={{display:"none"}}>{theTitle}</span></a>
                <div className={logoText} style={{display: (hideHeader)? "none": "" }}>
                    <div className={topLogo}>
                    <a className={"no-underline"}  href="/"><span className={`${title} ${fontSans}`}>{theTitle}</span></a> 
                    </div>
                    <div className={`${topTagline} `}><a className={"no-underline"} href="/">{desc}</a></div>
                </div>
            </div>
            
            <div className={scrim}></div>
            <nav className={nav}>
                <div className={lockup}>
                    <div className={topLogo}>
                        <a href="/">
                            <span className={`${title} ${fontSans}`}>
                                {
                                    theTitle.split(" ").map((n,i) => (
                                        <span key={i}>{n}</span>
                                    ))
                                }

                            </span>
                         </a>
                    </div>
                    <div className={topTagline}><a href="/">{desc}</a></div>
                </div>
                <div className={navItems}>
                    {
                    data.wpMenu.menuItems.nodes.map(n => (
                        <div className={`${navItem} ${(n.label === activeMenu)?active : ""}`} key={n.id}>
                            <a onClick={hamburgerClick} href={n.url}>{n.label}</a></div>
                      ))
                    }

                </div>
                <div id="color-mode-switcher" className="color-mode-switcher before-block after-block" >
                    <button data-colormode="<?= $colormode;?>" title="<?= $cmode_title;?>" id="color-mode-button" className="slider before-block after-block ">Switch color mode</button>
                </div>

            </nav>
            <button onClick={(e)=>{e.preventDefault();hamburgerClick()}}  id="nav-opener" className={`${navOpener} ${beforeBlock} ${afterBlock}`}>
                <span className={middleCenter}><Svg icon={(menuOpen)? "x" : "menu"} /></span>     
            </button>
        </header>
        <div id="footer-grid-wrap">
            <main id="main-content-container" className={mainContentContainer}>
                <div ref={headerCheck} style={{width: "100%", height: "1px"}}/>
                    {children}
            </main>
            <footer className={`${footer} ${fontSans}`}>
                <div className={`${inner} ${contentCenterer}`}>
                    <ul className={`${contactFooter} `}>
                        {
                            data.wpMenu.menuItems.nodes.map(n => (
                                <li key={n.id}><Link to={n.url}>{n.label}</Link></li>
                             ))
                         }
                    </ul>
                    <div className="copyright">
                        &copy;{new Date().getFullYear()} Mike Moore
                    </div>
                
                </div>
            </footer>
        </div>

        {
           (process.env.GATSBY_SHOW_GRID === "yes") ? <GridLines /> : ""
        }
        
        </Fragment>
    )
}