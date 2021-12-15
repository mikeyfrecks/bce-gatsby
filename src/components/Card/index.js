

import React, { useState } from "react"

import * as styles from "./styles.module.scss";

import { HtmlStrip, truncateString } from "../../utilities"
import LazyImg from "../LazyImg";
import { Link } from "gatsby";
import { navigate, } from "gatsby"
import SVG from "../SVG";

import {
    fontSans,
    noUnderline,
    tagLine
 } from "../../global-styles/utilities.module.scss"
 const {
    card,
    imgContainer,
    kickerStyle,    
    textArea,
    h2,
    
} = styles;

const ThumbImage = ({featuredImage}) => {
    if(!featuredImage) {
        return null;
    }
    const {
        mediaDetails,
        altText,
        localFile
    } = featuredImage.node
    const {childImageSharp} = localFile
    const {
        width,
        height
    } = mediaDetails
    const {src} = childImageSharp.fixed
    const {srcSet} = childImageSharp.fluid
    return (
        <div className={imgContainer}>
            <LazyImg 
                    isPoster={true}
                    srcSet={srcSet}
                    sourceUrl={src}
                    sourceWidth={width}
                    sourceHeight={height}
                    altText={altText}
                    />
        </div>
    )
} 




export default function Card(props) {

    const {featuredImage,title, link, kicker, desc,  externalLink, extraClasses, styleMod} = props
    const ctaText = props.ctaText || "View post"; 

    const CTA = () => <div className={`${fontSans} ${styles.ctaText}`}><span>{ctaText}</span><SVG icon={"arrow"} /></div>

    const [downTime, setDownTime] = useState(0);


    const cardClick = (e) => {
     
        if(e.button !== 0) {
            return ;
        }
        if( e.type === "mousedown") {
            setDownTime(+new Date());
            return
        }
        
        if ((+new Date() - downTime) > 200) {
            return ;
        }
        if(externalLink) {
            window.location.href = link;
            return ; 
        }
        e.preventDefault() ; 
        navigate(link);
    }

    
    return <div role="presentation" onMouseDown={cardClick} onMouseUp={cardClick} className={`${card} ${(styleMod)? styles[styleMod]: ""} ${extraClasses}  `}>
        <ThumbImage featuredImage={featuredImage} />
        <div className={textArea}>
        {(kicker)?<div className={`${kickerStyle} ${fontSans}`}>{kicker}</div>: null}
        <h2 className={h2}>{(link)?<Link className={noUnderline} to={link}>{title}</Link>:title}</h2>
        {(desc)?<div className={`${tagLine}`}>{truncateString(HtmlStrip(desc),75)}</div>: null}
       
        </div>
         <CTA />

    </div>
}