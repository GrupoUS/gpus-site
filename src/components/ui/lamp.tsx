"use client";
import { motion } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

/** Animated lamp visuals only. Compose with Astro markup as a sibling so CTAs stay static HTML (data-reveal, Button.astro). */
export const LampBackdrop = ({ className }: { className?: string }) => {
	// #region agent log
	useEffect(() => {
		const section = document.getElementById("cta-lamp-section");
		fetch("http://127.0.0.1:7777/ingest/0a9ce74c-a29a-4996-bf5d-a24a8b2822f7", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Debug-Session-Id": "651d29",
			},
			body: JSON.stringify({
				sessionId: "651d29",
				location: "lamp.tsx:LampBackdrop",
				message: "data-reveal nodes in CTA section vs document",
				data: {
					revealInCtaSection:
						section?.querySelectorAll("[data-reveal]").length ?? -1,
					revealInDocument: document.querySelectorAll("[data-reveal]").length,
				},
				timestamp: Date.now(),
				hypothesisId: "B",
				runId: "verify",
			}),
		}).catch(() => {});
	}, []);
	// #endregion

	return (
		<div
			className={cn(
				"relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0",
				className,
			)}
		>
			<motion.div
				initial={{ opacity: 0.5, width: "15rem" }}
				whileInView={{ opacity: 1, width: "30rem" }}
				transition={{
					delay: 0.3,
					duration: 0.8,
					ease: "easeInOut",
				}}
				style={{
					backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
				}}
				className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-gold via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
			>
				<div className="absolute w-[100%] left-0 bg-navy h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
				<div className="absolute w-40 h-[100%] left-0 bg-navy bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
			</motion.div>
			<motion.div
				initial={{ opacity: 0.5, width: "15rem" }}
				whileInView={{ opacity: 1, width: "30rem" }}
				transition={{
					delay: 0.3,
					duration: 0.8,
					ease: "easeInOut",
				}}
				style={{
					backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
				}}
				className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-gold text-white [--conic-position:from_290deg_at_center_top]"
			>
				<div className="absolute w-40 h-[100%] right-0 bg-navy bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
				<div className="absolute w-[100%] right-0 bg-navy h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
			</motion.div>
			<div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-navy blur-2xl" />
			<div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
			<div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-gold opacity-50 blur-3xl" />
			<motion.div
				initial={{ width: "8rem" }}
				whileInView={{ width: "16rem" }}
				transition={{
					delay: 0.3,
					duration: 0.8,
					ease: "easeInOut",
				}}
				className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-gold-light blur-2xl"
			/>
			<motion.div
				initial={{ width: "15rem" }}
				whileInView={{ width: "30rem" }}
				transition={{
					delay: 0.3,
					duration: 0.8,
					ease: "easeInOut",
				}}
				className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-gold-light"
			/>

			<div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-navy" />
		</div>
	);
};
