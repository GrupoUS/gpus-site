import { ArrowRight } from "lucide-react";
import {
	domAnimation,
	LazyMotion,
	useReducedMotion,
	useScroll,
	useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ChapterVisualType = "aurora" | "glass" | "image" | "gradient" | "mesh";
type ChapterAccent = "gold" | "navy" | "mixed";

interface ChapterKpi {
	label: string;
	value: string;
}

interface ChapterQuote {
	text: string;
	author: string;
	role: string;
}

interface ChapterCta {
	label: string;
	url: string;
	whatsappMessage?: string;
	helperText?: string;
}

interface ChapterVisual {
	type: ChapterVisualType;
	src?: string;
	alt?: string;
	accent?: ChapterAccent;
}

export interface Chapter {
	id: string;
	eyebrow: string;
	headline: string;
	subheadline: string;
	body: string[];
	visual: ChapterVisual;
	kpis?: ChapterKpi[];
	quote?: ChapterQuote;
	ctaSlot?: ChapterCta;
}

interface NarrativeChaptersProps {
	chapters: Chapter[];
}

/* ── Visual layers ── */

function GradientVisual({ accent = "gold" }: { accent?: ChapterAccent }) {
	const gradient =
		accent === "navy"
			? "from-navy via-navy-light to-navy-lighter"
			: accent === "mixed"
				? "from-navy via-navy-light to-gold/30"
				: "from-gold/40 via-gold-dark/30 to-navy";
	return (
		<div
			className={cn(
				"relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br",
				gradient,
			)}
			aria-hidden="true"
		>
			<div className="absolute inset-0 landing-mesh-bg opacity-60" />
			<div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
			<div className="absolute bottom-6 left-6 right-6">
				<div className="h-px w-12 bg-gold/60" />
			</div>
		</div>
	);
}

function MeshVisual({ accent = "gold" }: { accent?: ChapterAccent }) {
	return (
		<div
			className={cn(
				"relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-navy-light",
				accent === "gold" && "depth-4",
			)}
			aria-hidden="true"
		>
			<div className="absolute inset-0 landing-mesh-bg" />
		</div>
	);
}

function GlassVisual({ accent = "mixed" }: { accent?: ChapterAccent }) {
	const stack = ["Técnica", "Gestão", "Comunidade"];
	const borderTint =
		accent === "gold"
			? "border-gold/30"
			: accent === "navy"
				? "border-navy-lighter"
				: "border-gold/20";
	return (
		<div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-navy-light/40 p-8">
			<div
				className="absolute inset-0 landing-mesh-bg opacity-40"
				aria-hidden="true"
			/>
			<div className="relative flex h-full flex-col justify-center gap-4">
				{stack.map((label, idx) => (
					<div
						key={label}
						className={cn(
							"glass-card flex items-center justify-between rounded-2xl border px-5 py-4",
							borderTint,
						)}
						style={{ transform: `translateX(${idx * 12}px)` }}
					>
						<span className="font-serif text-lg text-text-primary">
							{label}
						</span>
						<span className="text-xs font-semibold uppercase tracking-[0.24em] text-gold/75">
							0{idx + 1}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

function ImageVisual({
	src,
	alt,
	accent = "navy",
}: {
	src?: string;
	alt?: string;
	accent?: ChapterAccent;
}) {
	if (!src) return <GradientVisual accent={accent} />;
	return (
		<div
			className={cn(
				"relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-navy-light",
				accent === "gold" && "depth-4",
			)}
		>
			<img
				src={src}
				alt={alt ?? ""}
				width={800}
				height={1000}
				loading="lazy"
				decoding="async"
				className="absolute inset-0 h-full w-full object-cover"
			/>
			<div
				className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent"
				aria-hidden="true"
			/>
		</div>
	);
}

function ChapterVisualLayer({ visual }: { visual: ChapterVisual }) {
	switch (visual.type) {
		case "gradient":
			return <GradientVisual accent={visual.accent} />;
		case "mesh":
			return <MeshVisual accent={visual.accent} />;
		case "glass":
			return <GlassVisual accent={visual.accent} />;
		case "image":
			return (
				<ImageVisual src={visual.src} alt={visual.alt} accent={visual.accent} />
			);
		default:
			return <GradientVisual accent={visual.accent} />;
	}
}

/* ── Copy layer ── */

function ChapterCopy({ chapter }: { chapter: Chapter }) {
	return (
		<div className="flex flex-col gap-6">
			<span className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
				{chapter.eyebrow}
			</span>
			<h2
				id={`${chapter.id}-heading`}
				className="font-serif text-3xl font-bold leading-tight text-text-primary md:text-4xl lg:text-5xl"
			>
				{chapter.headline}
			</h2>
			<p className="text-lg leading-relaxed text-text-muted md:text-xl">
				{chapter.subheadline}
			</p>
			<div className="mt-2 flex flex-col gap-4 text-base leading-relaxed text-text-muted md:text-lg">
				{chapter.body.map((paragraph) => (
					<p key={paragraph.slice(0, 32)}>{paragraph}</p>
				))}
			</div>

			{chapter.kpis && chapter.kpis.length > 0 && (
				<dl className="mt-6 grid grid-cols-3 gap-4 border-t border-gold/15 pt-6">
					{chapter.kpis.map((kpi) => (
						<div key={kpi.label} className="flex flex-col gap-1">
							<dt className="text-xs uppercase tracking-wider text-text-muted">
								{kpi.label}
							</dt>
							<dd className="font-serif text-2xl font-bold text-gold tabular-nums md:text-3xl">
								{kpi.value}
							</dd>
						</div>
					))}
				</dl>
			)}

			{chapter.quote && (
				<figure className="mt-6 rounded-2xl border border-gold/15 bg-navy-light/40 p-6">
					<blockquote className="font-serif text-lg italic leading-relaxed text-text-primary md:text-xl">
						“{chapter.quote.text}”
					</blockquote>
					<figcaption className="mt-4 text-sm text-text-muted">
						<span className="font-semibold text-gold">
							{chapter.quote.author}
						</span>
						<span className="ml-2">{chapter.quote.role}</span>
					</figcaption>
				</figure>
			)}

			{chapter.ctaSlot && (
				<div className="mt-4 flex flex-col items-start gap-2">
					<a
						href={chapter.ctaSlot.url}
						className="btn-base btn-primary gold-glow inline-flex items-center gap-2 rounded-xl px-6 text-base min-h-12"
					>
						{chapter.ctaSlot.label}
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</a>
					{chapter.ctaSlot.helperText && (
						<p className="text-sm text-text-muted">
							{chapter.ctaSlot.helperText}
						</p>
					)}
				</div>
			)}
		</div>
	);
}

/* ── Chapter shells ── */

function ChapterStatic({
	chapter,
	index,
}: {
	chapter: Chapter;
	index: number;
}) {
	const isEven = index % 2 === 0;
	return (
		<section
			id={chapter.id}
			aria-labelledby={`${chapter.id}-heading`}
			className="px-4 py-16 sm:px-6 lg:py-32"
		>
			<div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
				<div className={cn("flex items-center", !isEven && "lg:order-2")}>
					<ChapterVisualLayer visual={chapter.visual} />
				</div>
				<div className={cn("flex items-center", !isEven && "lg:order-1")}>
					<ChapterCopy chapter={chapter} />
				</div>
			</div>
		</section>
	);
}

function ChapterScrubbed({
	chapter,
	index,
}: {
	chapter: Chapter;
	index: number;
}) {
	const sectionRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const visualY = useTransform(scrollYProgress, [0, 1], [60, -60]);
	const visualOpacity = useTransform(
		scrollYProgress,
		[0, 0.18, 0.82, 1],
		[0.3, 1, 1, 0.3],
	);
	const visualScale = useTransform(
		scrollYProgress,
		[0, 0.5, 1],
		[0.94, 1, 0.97],
	);
	const copyY = useTransform(scrollYProgress, [0, 1], [30, -30]);
	const copyOpacity = useTransform(
		scrollYProgress,
		[0, 0.2, 0.85, 1],
		[0.4, 1, 1, 0.5],
	);

	const isEven = index % 2 === 0;

	return (
		<section
			ref={sectionRef}
			id={chapter.id}
			aria-labelledby={`${chapter.id}-heading`}
			className="relative px-4 py-16 sm:px-6 lg:py-32"
		>
			<div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
				<div className={cn("flex items-center", !isEven && "lg:order-2")}>
					<div className="w-full lg:sticky lg:top-24">
						<m.div
							style={{
								y: visualY,
								opacity: visualOpacity,
								scale: visualScale,
								willChange: "transform, opacity",
							}}
						>
							<ChapterVisualLayer visual={chapter.visual} />
						</m.div>
					</div>
				</div>
				<div
					className={cn("flex items-center lg:py-24", !isEven && "lg:order-1")}
				>
					<m.div
						style={{
							y: copyY,
							opacity: copyOpacity,
							willChange: "transform, opacity",
						}}
						className="w-full"
					>
						<ChapterCopy chapter={chapter} />
					</m.div>
				</div>
			</div>
		</section>
	);
}

/* ── Main component ── */

export function NarrativeChapters({ chapters }: NarrativeChaptersProps) {
	const prefersReducedMotion = useReducedMotion();

	if (prefersReducedMotion) {
		return (
			<div className="bg-navy">
				{chapters.map((chapter, index) => (
					<ChapterStatic key={chapter.id} chapter={chapter} index={index} />
				))}
			</div>
		);
	}

	return (
		<LazyMotion features={domAnimation}>
			<div className="bg-navy">
				{chapters.map((chapter, index) => (
					<ChapterScrubbed key={chapter.id} chapter={chapter} index={index} />
				))}
			</div>
		</LazyMotion>
	);
}
