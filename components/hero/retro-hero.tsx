"use client";

import Link from "next/link";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { neoButtonClasses } from "@/components/ui/neo-button";
import { RetroWindow } from "@/components/ui/retro-window";
import { TechBadge } from "@/components/ui/tech-badge";
import { siteConfig } from "@/data/site-config";

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "20+", label: "Projects Delivered" },
  { value: "Global", label: "Remote Worldwide" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function RetroHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-grid border-b-[3px] border-border">
        <div className="container-app grid gap-16 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.08 }}
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 font-retro text-lg tracking-wide text-accent-secondary"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-secondary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-secondary" />
              </span>
              SYSTEM ONLINE // AVAILABLE FOR NEW BUILDS
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-4 font-sans text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
            >
              I build websites that look impossible to ignore.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 max-w-xl font-sans text-lg text-muted"
            >
              I&rsquo;m {siteConfig.name}, a {siteConfig.role} who turns
              ideas into fast, polished, conversion-focused digital
              experiences.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 inline-flex items-center gap-2 neo-border bg-surface px-3 py-1.5"
            >
              <span className="h-2 w-2 rounded-full bg-crt-green" aria-hidden="true" />
              <span className="font-retro text-base tracking-wide">
                AVAILABLE FOR SELECT PROJECTS
              </span>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link href="/contact" className={neoButtonClasses("primary")}>
                Start a Project
              </Link>
              <Link
                href="#projects"
                className={neoButtonClasses("secondary")}
              >
                Explore My Work
              </Link>
            </motion.div>

            <motion.dl
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t-[3px] border-border pt-6"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-sans text-2xl font-bold sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dd className="font-retro text-base leading-tight text-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <motion.div
              animate={
                prefersReducedMotion ? undefined : { y: [0, -10, 0] }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <RetroWindow title="profile.sys" className="bg-surface">
                <dl className="space-y-3 font-retro text-lg">
                  <div className="flex justify-between gap-4 border-b border-border/40 pb-2">
                    <dt className="text-muted">NAME</dt>
                    <dd>{siteConfig.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-border/40 pb-2">
                    <dt className="text-muted">ROLE</dt>
                    <dd className="text-right">{siteConfig.role}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-border/40 pb-2">
                    <dt className="text-muted">LOCATION</dt>
                    <dd>{siteConfig.location}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">STATUS</dt>
                    <dd className="text-crt-green">ONLINE</dd>
                  </div>
                </dl>
              </RetroWindow>
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="absolute -left-8 -top-6 hidden sm:block"
              animate={
                prefersReducedMotion ? undefined : { y: [0, 8, 0] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <TechBadge variant="blue">React</TechBadge>
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="absolute -bottom-4 -right-6 hidden sm:block"
              animate={
                prefersReducedMotion ? undefined : { y: [0, -8, 0] }
              }
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <TechBadge variant="pink">Next.js</TechBadge>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
