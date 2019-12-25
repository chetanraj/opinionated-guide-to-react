import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import toc from "remark-toc";
import rehype2react from "rehype-react";
import slug from "remark-slug";
import rehypePrism from "@mapbox/rehype-prism";
import "prism-theme-night-owl";
import "./style.css";

const BlogIndex = ({ data, location }) => {
  const [book, setBook] = useState("");
  const siteTitle = data.site.siteMetadata.title;
  const markdownBook = data.markdownRemark;

  useEffect(() => {
    if (markdownBook) {
      unified()
        .use(markdown)
        .use(slug)
        .use(toc)
        .use(remark2rehype)
        .use(rehypePrism)
        .use(rehype2react, { createElement: React.createElement })
        .process(markdownBook.rawMarkdownBody, (err, file) => {
          console.log(err);
          setBook(file);
        });
    }
  }, [markdownBook]);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Opinionated guide to React" />
      {book && book.contents}
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark {
      rawMarkdownBody
    }
  }
`;
