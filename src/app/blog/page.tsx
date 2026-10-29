import type { Metadata } from "next";
import Link from "next/link";

import { BlogImage } from "@/components/blog-image";
import { PromotionShell } from "@/components/promotion-shell";
import { sanityClient } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";

import "./blog.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Consejos de mantenimiento, compatibilidad y cuidado para tu vehículo europeo.",
};

export const revalidate = 30;

const queryOptions = { next: { revalidate } };

function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

type BlogPost = Awaited<ReturnType<typeof loadPosts>>[number];

function BlogCard({ index, post }: { index: number; post: BlogPost }) {
  if (!post.title || !post.slug || !post.publishedAt || !post.coverImage) {
    return null;
  }

  const href = `/blog/${post.slug}`;

  return (
    <article className="blog-card">
      <Link
        aria-label={`Leer ${post.title}`}
        className="blog-card-media"
        href={href}
      >
        <BlogImage
          alt={post.coverImage.alt || ""}
          height={720}
          image={post.coverImage}
          preload={index === 0}
          sizes="(max-width: 760px) 100vw, 50vw"
          width={1200}
        />
      </Link>
      <div className="blog-card-copy">
        <div className="blog-card-meta">
          {post.category ? <span>{post.category}</span> : null}
          <time dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
        </div>
        <h2>
          <Link href={href}>{post.title}</Link>
        </h2>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
        <Link className="text-link" href={href}>
          Leer artículo
        </Link>
      </div>
    </article>
  );
}

export default async function BlogPage() {
  let unavailable = false;
  let posts: Awaited<ReturnType<typeof loadPosts>> = [];

  try {
    posts = await loadPosts();
  } catch {
    unavailable = true;
    console.error("Blog posts could not be loaded from Sanity.");
  }

  return (
    <PromotionShell>
      <article className="blog-page">
        <header className="blog-hero">
          <div className="container blog-hero-content">
            <h1 className="page-display-title">Nuestro Blog</h1>
            <p>
              Guías de mantenimiento, compatibilidad y cuidado para acompañarte
              en cada trayecto.
            </p>
          </div>
        </header>

        <section className="container blog-index" aria-label="Artículos">
          {unavailable ? (
            <div className="blog-empty-state" role="status">
              <h2>El blog no está disponible por el momento.</h2>
              <p>Intenta nuevamente en unos minutos.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="blog-empty-state">
              <h2>Estamos preparando nuevos artículos.</h2>
              <p>Muy pronto encontrarás consejos para cuidar tu vehículo.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post, index) => (
                <BlogCard index={index} key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>
      </article>
    </PromotionShell>
  );
}

async function loadPosts() {
  return sanityClient.fetch(POSTS_QUERY, {}, queryOptions);
}
