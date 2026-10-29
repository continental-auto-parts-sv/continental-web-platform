import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogImage } from "@/components/blog-image";
import { BlogPostBody } from "@/components/blog-post-body";
import { PromotionShell } from "@/components/promotion-shell";
import { sanityClient } from "@/sanity/client";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/queries";

import "../blog.css";

export const revalidate = 30;

const queryOptions = { next: { revalidate } };

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export async function generateStaticParams() {
  try {
    const slugs = await sanityClient.fetch(POST_SLUGS_QUERY, {}, queryOptions);

    if (slugs.length > 0 || process.env.GITHUB_PAGES !== "true") {
      return slugs;
    }

    return [{ slug: "_empty" }];
  } catch {
    return process.env.GITHUB_PAGES === "true" ? [{ slug: "_empty" }] : [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) return {};

  return {
    title: post.title || undefined,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (
    !post?.title ||
    !post.excerpt ||
    !post.category ||
    !post.publishedAt ||
    !post.coverImage ||
    !post.body
  ) {
    notFound();
  }

  return (
    <PromotionShell>
      <article className="blog-article">
        <header className="container blog-article-header">
          <Link className="blog-back-link" href="/blog">
            ← Volver al blog
          </Link>
          <div className="blog-article-meta">
            <span>{post.category}</span>
            <time dateTime={post.publishedAt}>
              {formatPostDate(post.publishedAt)}
            </time>
          </div>
          <h1 className="page-display-title">{post.title}</h1>
          <p className="blog-article-excerpt">{post.excerpt}</p>
        </header>

        <div className="container blog-article-cover">
          <BlogImage
            alt={post.coverImage.alt || ""}
            height={900}
            image={post.coverImage}
            preload
            sizes="(max-width: 760px) 100vw, 1200px"
            width={1600}
          />
        </div>

        <div className="container blog-article-content">
          <BlogPostBody value={post.body} />
        </div>
      </article>
    </PromotionShell>
  );
}

async function loadPost(slug: string) {
  try {
    return await sanityClient.fetch(POST_QUERY, { slug }, queryOptions);
  } catch {
    console.error("The requested blog post could not be loaded from Sanity.");
    return null;
  }
}
