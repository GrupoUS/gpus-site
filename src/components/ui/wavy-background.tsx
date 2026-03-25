"use client";
import {
	type HTMLAttributes,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

type WavyBackgroundProps = {
	children?: ReactNode;
	className?: string;
	containerClassName?: string;
	colors?: string[];
	waveWidth?: number;
	backgroundFill?: string;
	blur?: number;
	speed?: "slow" | "fast";
	waveOpacity?: number;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

export const WavyBackground = ({
	children,
	className,
	containerClassName,
	colors,
	waveWidth,
	backgroundFill,
	blur = 10,
	speed = "fast",
	waveOpacity = 0.5,
	...props
}: WavyBackgroundProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationIdRef = useRef<number | null>(null);

	useEffect(() => {
		const noise = createNoise3D();
		const waveColors = colors ?? [
			"#38bdf8",
			"#818cf8",
			"#c084fc",
			"#e879f9",
			"#22d3ee",
		];
		const getSpeed = () => {
			switch (speed) {
				case "slow":
					return 0.001;
				case "fast":
					return 0.002;
				default:
					return 0.001;
			}
		};

		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let w = 0;
		let h = 0;
		let nt = 0;

		const drawWave = (n: number) => {
			nt += getSpeed();
			for (let i = 0; i < n; i++) {
				ctx.beginPath();
				ctx.lineWidth = waveWidth ?? 50;
				ctx.strokeStyle = waveColors[i % waveColors.length];
				for (let x = 0; x < w; x += 5) {
					const y = noise(x / 800, 0.3 * i, nt) * 100;
					ctx.lineTo(x, y + h * 0.5);
				}
				ctx.stroke();
				ctx.closePath();
			}
		};

		const render = () => {
			ctx.fillStyle = backgroundFill ?? "black";
			ctx.globalAlpha = waveOpacity ?? 0.5;
			ctx.fillRect(0, 0, w, h);
			drawWave(5);
			animationIdRef.current = requestAnimationFrame(render);
		};

		const syncSize = () => {
			w = ctx.canvas.width = window.innerWidth;
			h = ctx.canvas.height = window.innerHeight;
			ctx.filter = `blur(${blur}px)`;
		};

		const onResize = () => {
			syncSize();
		};

		syncSize();
		nt = 0;
		window.addEventListener("resize", onResize);
		render();

		return () => {
			window.removeEventListener("resize", onResize);
			if (animationIdRef.current != null) {
				cancelAnimationFrame(animationIdRef.current);
				animationIdRef.current = null;
			}
		};
	}, [blur, speed, waveOpacity, backgroundFill, waveWidth, colors]);

	const [isSafari, setIsSafari] = useState(false);
	useEffect(() => {
		setIsSafari(
			typeof window !== "undefined" &&
				navigator.userAgent.includes("Safari") &&
				!navigator.userAgent.includes("Chrome"),
		);
	}, []);

	const safariFilterStyle =
		isSafari === true ? { filter: `blur(${blur}px)` } : undefined;

	return (
		<div
			className={cn(
				"h-screen flex flex-col items-center justify-center",
				containerClassName,
			)}
		>
			<canvas
				className="absolute inset-0 z-0"
				ref={canvasRef}
				id="canvas"
				style={safariFilterStyle}
			></canvas>
			<div className={cn("relative z-10", className)} {...props}>
				{children}
			</div>
		</div>
	);
};
