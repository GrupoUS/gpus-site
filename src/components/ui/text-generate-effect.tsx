"use client";
import { motion, stagger, useAnimate } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
	words,
	className,
	filter = true,
	duration = 0.5,
}: {
	words: string;
	className?: string;
	filter?: boolean;
	duration?: number;
}) => {
	const [scope, animate] = useAnimate();
	const [runMotion, setRunMotion] = useState(false);
	const wordsArray = useMemo(() => words.split(" "), [words]);

	useEffect(() => {
		setRunMotion(true);
	}, []);

	// #region agent log
	useEffect(() => {
		if (!runMotion) return;
		fetch("http://127.0.0.1:7777/ingest/0a9ce74c-a29a-4996-bf5d-a24a8b2822f7", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Debug-Session-Id": "651d29",
			},
			body: JSON.stringify({
				sessionId: "651d29",
				location: "text-generate-effect.tsx:runMotion",
				message: "motion headline phase active",
				data: { wordCount: wordsArray.length },
				timestamp: Date.now(),
				hypothesisId: "C",
				runId: "verify",
			}),
		}).catch(() => {});
	}, [runMotion, wordsArray.length]);
	// #endregion

	// biome-ignore lint/correctness/useExhaustiveDependencies: new spans mount when `wordsArray` changes; `animate("span")` must run again for those nodes
	useEffect(() => {
		if (!runMotion) return;
		animate(
			"span",
			{
				opacity: 1,
				filter: filter ? "blur(0px)" : "none",
			},
			{
				duration: duration ? duration : 1,
				delay: stagger(0.2),
			},
		);
	}, [wordsArray, filter, duration, animate, runMotion]);

	if (!runMotion) {
		return (
			<div className={cn("font-bold", className)}>
				<div className="mt-4">
					<p className="text-text-primary leading-snug tracking-wide">
						{words}
					</p>
				</div>
			</div>
		);
	}

	const renderWords = () => {
		return (
			<motion.div ref={scope}>
				{wordsArray.map((word, idx) => {
					const positionKey = wordsArray.slice(0, idx + 1).join(" ");
					return (
						<motion.span
							key={positionKey}
							className="text-text-primary opacity-0"
							style={{
								filter: filter ? "blur(10px)" : "none",
							}}
						>
							{word}{" "}
						</motion.span>
					);
				})}
			</motion.div>
		);
	};

	return (
		<div className={cn("font-bold", className)}>
			<div className="mt-4">
				<div className="text-text-primary text-2xl leading-snug tracking-wide">
					{renderWords()}
				</div>
			</div>
		</div>
	);
};
