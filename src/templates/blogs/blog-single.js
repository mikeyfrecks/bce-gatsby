import React from "react"
import { graphql } from "gatsby"
import Layout from "../../components/Layout"
import { HtmlStrip } from "../../utilities";
import ReadingSection from "../../components/ReadingSection";
import CopyArea from "../../components/CopyArea";
import EndBullet from "../../components/EndBullet";
import TagList from "../../components/TagList";
import MorePosts from "../../components/MorePosts";
import LazyImg from "../../components/LazyImg";
import getImgSrc from "../../getImgSrc";
import {
    blogTagline,
    blogHero,
    blogCopy,
    blogSingleHeadline
} from "./blogstyles.module.scss";
import {
    articleHeading,
    tagLine,
    posterContainer,
    posterImg,
    thinBox
} from "../../global-styles/utilities.module.scss"
export default function BlogSingle({data}) {
    const {
        currentPost,
        otherPosts
    } = data; 
    
    const excerpt = HtmlStrip(currentPost.excerpt);
    
    return <Layout
        pageTitle={currentPost.title} 
        activeMenu={"Writing"}
        headerDescription={excerpt}
        headerImg={(currentPost.featuredImage) ? getImgSrc(currentPost.featuredImage.node.databaseId) : null}
        headerLink={currentPost.link}
    >
        <ReadingSection>
            <h1 className={`${blogSingleHeadline} ${articleHeading}`}>{currentPost.title}</h1>
            <div className={`${blogTagline} ${tagLine}`}>{excerpt}</div>
            {(currentPost.featuredImage)?
            <div className={`${blogHero} ${thinBox} ${posterContainer}`} style={{paddingTop: "56.25%"}}>
                <LazyImg 
                {...currentPost.featuredImage.node}
                isPoster={true} 
                
                addClasses={`${posterImg}`}
                />
            </div>
            :null}
            <div className={blogCopy}><CopyArea copy={currentPost.content} /><EndBullet /></div>
            <TagList items={currentPost.tags.nodes} />
            <MorePosts posts={otherPosts.edges.map(e => e.node)} title={"More writing"} />
        </ReadingSection>
        



    </Layout>
}



export const query = graphql`
  query($slug: String!, $otherPosts: [String!] ) {
    currentPost: wpPost(slug: {eq: $slug}) {
      ...postData
      tags {
        nodes {
          slug
          name
        }
      }
      excerpt
      ...featuredImagePost
    }
    otherPosts: allWpPost(sort: {fields: date, order: DESC}
      filter: {slug: {in: $otherPosts}}) {
      edges {
        node {
          title
          slug
          link
          excerpt
          ...featuredImagePost
        }
      }
    }
  } 
`
